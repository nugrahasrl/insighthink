// app/api/library/add/route.ts
import { NextResponse } from "next/server"
import { GridFSBucket } from "mongodb"
import { Buffer } from "buffer"
import clientPromise from "@/lib/mongodb"

// Configure the route to run on Node.js
export const runtime = "nodejs"
export const revalidate = 0

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

export async function POST(request: Request) {
  try {
    // Parse the incoming multipart form data.
    const formData = await request.formData()

    // Extract required text fields.
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

    // Parse genres into array
    const genres = parseGenres(genresStr)

    const createdAt = new Date().toISOString()

    // Extract and parse chapters and keyTerms (expected as JSON strings).
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

    // Ensure keyTermsParsed is an array of objects with "term" and "definition".
    if (!Array.isArray(keyTermsParsed)) {
      keyTermsParsed = []
    } else {
      keyTermsParsed = keyTermsParsed.map((item: any) => ({
        term: item.term || "",
        definition: item.definition || "",
      }))
    }

    // Process the cover image file, if provided.
    let coverImageId = ""
    const coverImage = formData.get("coverImage")

    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      try {
        coverImageId = await uploadFileToGridFS(coverImage)
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

    // Build the book document.
    const book = {
      title,
      author,
      description,
      content,
      createdAt,
      updatedAt: createdAt,
      chapters: Array.isArray(chaptersParsed) ? chaptersParsed : [],
      keyTerms: keyTermsParsed,
      coverImageId, // Will be an empty string if no file is uploaded.
      pageCount,
      readingTime,
      genres,
    }

    // Use the persistent connection from clientPromise.
    const client = await clientPromise
    const db = client.db("insighthink")
    const collection = db.collection("library")

    // Insert the book document.
    const result = await collection.insertOne(book)

    // Do NOT close the client—let the persistent connection remain open.
    if (!result.acknowledged) {
      return NextResponse.json({ success: false, message: "Failed to add book to database" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookId: result.insertedId.toString(),
      message: "Book added successfully",
      book: {
        _id: result.insertedId.toString(),
        title,
        author,
        hasCover: !!coverImageId,
      },
    })
  } catch (error: any) {
    console.error("Error in /api/library/add:", error)

    // Determine appropriate status code based on error
    const statusCode = error.name === "ValidationError" ? 400 : 500

    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred while adding the book",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: statusCode },
    )
  }
}

