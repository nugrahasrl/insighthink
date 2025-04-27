import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { GridFSBucket } from "mongodb"
import { Buffer } from "buffer"
import clientPromise from "@/lib/mongodb"

// Configure the route to run on Node.js
export const dynamic = "force-dynamic"
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

// Perbaiki fungsi parseNumberOrUndefined untuk memastikan konversi string ke number dilakukan dengan benar
function parseNumberOrUndefined(value: string | null | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
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

// GET handler to fetch a book by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("insighthink")
    const book = await db.collection("library").findOne({ _id: new ObjectId(id) })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Convert _id to string for JSON serialization
    const responseBook = { ...book, _id: book._id.toString() }

    return NextResponse.json(responseBook)
  } catch (error: any) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch book" }, { status: 500 })
  }
}

// PATCH handler to update a book
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID format" }, { status: 400 })
    }

    // Parse the incoming form data
    const formData = await request.formData()

    console.log("Received form data for update:", Object.fromEntries(formData.entries()))

    // Extract fields
    const title = formData.get("title")?.toString()
    const author = formData.get("author")?.toString()

    // Validate required fields
    if (!title || !author) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and author are required fields",
        },
        { status: 400 },
      )
    }

    // Extract optional fields
    const description = formData.get("description")?.toString() || ""
    const content = formData.get("content")?.toString() || ""
    const pageCountStr = formData.get("pageCount")?.toString()
    const readingTimeStr = formData.get("readingTime")?.toString()
    const genresStr = formData.get("genres")?.toString()

    // Parse numeric fields
    const pageCount = parseNumberOrUndefined(pageCountStr)
    const readingTime = parseNumberOrUndefined(readingTimeStr)

    console.log("Parsed numeric fields:", { pageCount, readingTime, pageCountStr, readingTimeStr })

    // Parse genres into array
    const genres = parseGenres(genresStr)

    // Extract and parse chapters and keyTerms (expected as JSON strings)
    const chaptersStr = formData.get("chapters")?.toString()
    const keyTermsStr = formData.get("keyTerms")?.toString()

    let chaptersParsed: any[] = []
    let keyTermsParsed: any[] = []

    try {
      if (chaptersStr) {
        chaptersParsed = JSON.parse(chaptersStr)
      }
    } catch (err) {
      console.error("Error parsing chapters:", err)
    }

    try {
      if (keyTermsStr) {
        keyTermsParsed = JSON.parse(keyTermsStr)
      }
    } catch (err) {
      console.error("Error parsing keyTerms:", err)
    }

    // Process the cover image file, if provided
    let coverImageId = undefined
    const coverImage = formData.get("coverImage")

    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      try {
        coverImageId = await uploadFileToGridFS(coverImage)
        console.log("Uploaded new cover image with ID:", coverImageId)
      } catch (error: any) {
        return NextResponse.json(
          {
            success: false,
            message: `Cover image error: ${error.message}`,
          },
          { status: 400 },
        )
      }
    }

    // Build the update document
    const updateDoc: any = {
      title,
      author,
      description,
      content,
      updatedAt: new Date().toISOString(),
      chapters: Array.isArray(chaptersParsed) ? chaptersParsed : [],
      keyTerms: keyTermsParsed,
      pageCount,
      readingTime,
      genres,
    }

    // Only include coverImageId if a new image was uploaded
    if (coverImageId) {
      updateDoc.coverImageId = coverImageId
    }

    console.log("Updating book with data:", updateDoc)

    // Update the book in the database
    const client = await clientPromise
    const db = client.db("insighthink")
    const result = await db.collection("library").updateOne({ _id: new ObjectId(id) }, { $set: updateDoc })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 })
    }

    // Fetch the updated book
    const updatedBook = await db.collection("library").findOne({ _id: new ObjectId(id) })
    if (!updatedBook) {
      return NextResponse.json({ success: false, message: "Failed to fetch updated book" }, { status: 500 })
    }

    // Convert _id to string for JSON serialization
    updatedBook._idString = updatedBook._id.toString()

    return NextResponse.json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    })
  } catch (error: any) {
    console.error("Error updating book:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred while updating the book",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// DELETE handler to delete a book
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("insighthink")

    // Get the book first to check if it exists and to get the coverImageId
    const book = await db.collection("library").findOne({ _id: new ObjectId(id) })

    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 })
    }

    // Jika buku memiliki cover image, hapus dari GridFS
    if (book.coverImageId) {
      try {
        const bucket = new GridFSBucket(db, { bucketName: "images" })
        await bucket.delete(new ObjectId(book.coverImageId))
      } catch (error) {
        console.error("Error deleting cover image:", error)
        // Lanjutkan meskipun penghapusan gambar gagal
      }
    }

    // Delete the book
    const result = await db.collection("library").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Failed to delete book" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting book:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred while deleting the book",
      },
      { status: 500 },
    )
  }
}
