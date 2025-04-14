import { NextResponse } from "next/server"
import { ObjectId, GridFSBucket } from "mongodb"
import { Buffer } from "buffer"
import clientPromise from "@/lib/mongodb"

// Configure the route to run on Node.js for file handling
export const runtime = "nodejs"

// Define allowed image MIME types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

// Helper: Upload a file (cover image) to GridFS using the persistent client.
async function uploadFileToGridFS(file: File): Promise<string> {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`)
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the maximum allowed size of 5MB`)
  }

  // Convert the Web File to a Node Buffer.
  const arrayBuffer = await file.arrayBuffer()
  const fileBuffer = Buffer.from(arrayBuffer)

  // Use the persistent client connection.
  const client = await clientPromise
  const db = client.db("insighthink")
  const bucket = new GridFSBucket(db, { bucketName: "images" })

  // Generate a unique filename with timestamp to avoid collisions
  const timestamp = Date.now()
  const uniqueFileName = `${timestamp}-${file.name}`

  // Open an upload stream to GridFS using the file name.
  const uploadStream = bucket.openUploadStream(uniqueFileName, {
    contentType: file.type || "application/octet-stream",
    metadata: {
      description: "Book cover image",
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  })

  // Write the file buffer into the stream.
  uploadStream.end(fileBuffer)

  // Wait for the stream to finish.
  await new Promise<void>((resolve, reject) => {
    uploadStream.on("finish", resolve)
    uploadStream.on("error", reject)
  })

  // Return the file ID as a string.
  return uploadStream.id.toString()
}

// Helper: Parse string to number or return undefined
function parseNumberOrUndefined(value: string | null | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number.parseInt(value, 10)
  return isNaN(parsed) ? undefined : parsed
}

// Helper: Parse genres string into array
function parseGenres(genresString: string | null | undefined): string[] {
  if (!genresString) return []
  return genresString
    .split(",")
    .map((genre) => genre.trim())
    .filter((genre) => genre.length > 0)
}

// GET: Fetch a single book by its ID.
export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!params?.id || typeof params.id !== "string" || !/^[a-fA-F0-9]{24}$/.test(params.id)) {
    return NextResponse.json({ error: "Invalid book ID format" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db("insighthink")
    const collection = db.collection("library")

    const options = {
      projection: {
        _id: 1,
        title: 1,
        author: 1,
        description: 1,
        content: 1,
        chapters: 1,
        keyTerms: 1,
        coverImageId: 1,
        image: 1, // legacy field fallback
        createdAt: 1,
        updatedAt: 1,
        genres: 1,
        pageCount: 1,
        readingTime: 1,
      },
    }

    const query = { _id: new ObjectId(params.id) }
    const book = await collection.findOne(query, options)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        _id: book._id.toString(),
        title: book.title,
        author: book.author,
        description: book.description || "",
        content: book.content || "",
        chapters: Array.isArray(book.chapters) ? book.chapters : [],
        keyTerms: Array.isArray(book.keyTerms) ? book.keyTerms : [],
        coverImageId: book.coverImageId || book.image || "",
        createdAt: book.createdAt ? new Date(book.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: book.updatedAt ? new Date(book.updatedAt).toISOString() : new Date().toISOString(),
        genres: Array.isArray(book.genres) ? book.genres : [],
        pageCount: book.pageCount || undefined,
        readingTime: book.readingTime || undefined,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=3600" },
      },
    )
  } catch (error: any) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}

// PATCH: Update a book (for editing)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!params?.id || typeof params.id !== "string" || !/^[a-fA-F0-9]{24}$/.test(params.id)) {
    return NextResponse.json({ error: "Invalid book ID format" }, { status: 400 })
  }

  try {
    // Check if the request is multipart form data or JSON
    const contentType = request.headers.get("content-type") || ""
    let data: any
    let coverImage: File | null = null

    if (contentType.includes("multipart/form-data")) {
      // Handle multipart form data (with file uploads)
      const formData = await request.formData()

      // Extract form fields
      data = {
        title: formData.get("title")?.toString(),
        author: formData.get("author")?.toString(),
        description: formData.get("description")?.toString(),
        content: formData.get("content")?.toString(),
        pageCountStr: formData.get("pageCount")?.toString(),
        readingTimeStr: formData.get("readingTime")?.toString(),
        genresStr: formData.get("genres")?.toString(),
      }

      // Extract chapters and keyTerms if present
      const chaptersStr = formData.get("chapters")?.toString()
      const keyTermsStr = formData.get("keyTerms")?.toString()

      if (chaptersStr) {
        try {
          data.chapters = JSON.parse(chaptersStr)
        } catch (err) {
          console.error("Error parsing chapters:", err)
          data.chapters = []
        }
      }

      if (keyTermsStr) {
        try {
          data.keyTerms = JSON.parse(keyTermsStr)
        } catch (err) {
          console.error("Error parsing keyTerms:", err)
          data.keyTerms = []
        }
      }

      // Get the cover image file if provided
      coverImage = (formData.get("coverImage") as File) || null
    } else {
      // Handle JSON data
      data = await request.json()
    }

    // Build the update object
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Set basic fields if provided
    if (data.title !== undefined) updateData.title = data.title
    if (data.author !== undefined) updateData.author = data.author
    if (data.description !== undefined) updateData.description = data.description
    if (data.content !== undefined) updateData.content = data.content

    // Handle arrays
    if (data.chapters !== undefined) {
      updateData.chapters = Array.isArray(data.chapters) ? data.chapters : []
    }

    if (data.keyTerms !== undefined) {
      updateData.keyTerms = Array.isArray(data.keyTerms) ? data.keyTerms : []
    }

    // Handle new fields
    if (data.pageCountStr !== undefined || data.pageCount !== undefined) {
      const pageCountValue = data.pageCountStr || data.pageCount
      updateData.pageCount = parseNumberOrUndefined(pageCountValue?.toString())
    }

    if (data.readingTimeStr !== undefined || data.readingTime !== undefined) {
      const readingTimeValue = data.readingTimeStr || data.readingTime
      updateData.readingTime = parseNumberOrUndefined(readingTimeValue?.toString())
    }

    if (data.genresStr !== undefined || data.genres !== undefined) {
      const genresValue = data.genresStr || data.genres
      if (typeof genresValue === "string") {
        updateData.genres = parseGenres(genresValue)
      } else if (Array.isArray(genresValue)) {
        updateData.genres = genresValue
      }
    }

    // Handle cover image upload if provided
    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      try {
        const coverImageId = await uploadFileToGridFS(coverImage)
        updateData.coverImageId = coverImageId
      } catch (error: any) {
        return NextResponse.json({ success: false, message: `Cover image error: ${error.message}` }, { status: 400 })
      }
    } else if (data.coverImageId !== undefined && data.coverImageId !== "") {
      updateData.coverImageId = data.coverImageId
    }

    const client = await clientPromise
    const db = client.db("insighthink")
    const collection = db.collection("library")

    const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Book updated successfully",
      bookId: params.id,
      updatedAt: updateData.updatedAt,
    })
  } catch (error: any) {
    console.error("Error updating book:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unknown error",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// DELETE: Remove a book
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!params?.id || typeof params.id !== "string" || !/^[a-fA-F0-9]{24}$/.test(params.id)) {
    return NextResponse.json({ error: "Invalid book ID format" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db("insighthink")
    const collection = db.collection("library")

    // First, get the book to check if it has a cover image
    const book = await collection.findOne({ _id: new ObjectId(params.id) }, { projection: { coverImageId: 1 } })

    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 })
    }

    // Delete the book
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    // If the book had a cover image, delete it from GridFS
    if (book.coverImageId) {
      try {
        const bucket = new GridFSBucket(db, { bucketName: "images" })
        await bucket.delete(new ObjectId(book.coverImageId))
      } catch (error) {
        console.error("Error deleting cover image:", error)
        // Continue even if image deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
      bookId: params.id,
    })
  } catch (error: any) {
    console.error("Error deleting book:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

