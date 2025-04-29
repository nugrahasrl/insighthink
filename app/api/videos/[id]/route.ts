// --- Next.js API Route Settings ---
export const dynamic = "force-dynamic"; // Disable caching
export const runtime = "nodejs"; // Needed for fs, formidable, etc.
// export const sizeLimit = "10mb"; // (Optional) max request body size

// --- Imports ---
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { VideoData } from "@/lib/video-types";

const uploadDir = path.join(process.cwd(), "public/uploads/videos")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Regex to validate a 24-character hex string (MongoDB ObjectId)
const hexRegex = /^[a-fA-F0-9]{24}$/

// Helper: jika field adalah string, kembalikan nilainya; jika array, kembalikan elemen pertama; jika tidak, kembalikan fallback
function getStringField(field: any, fallback: string): string {
  if (typeof field === "string") return field
  if (Array.isArray(field) && field.length > 0) return field[0]
  return fallback
}

async function parseFormData(request: Request) {
  const buf = Buffer.from(await request.arrayBuffer())
  const fakeReq = new Readable()
  fakeReq.push(buf)
  fakeReq.push(null)
    ; (fakeReq as any).headers = Object.fromEntries(request.headers.entries())
    ; (fakeReq as any).method = request.method
    ; (fakeReq as any).url = request.url
    ; (fakeReq as any).aborted = false
    ; (fakeReq as any).httpVersion = "1.1"
    ; (fakeReq as any).httpVersionMajor = 1
    ; (fakeReq as any).httpVersionMinor = 1

  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
      encoding: "utf-8",
    })
    form.parse(fakeReq as IncomingMessage, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (!hexRegex.test(id)) {
    return NextResponse.json({ error: "Invalid video ID format" }, { status: 400 })
  }
  try {
    // Parse FormData
    const { fields, files } = await parseFormData(request)
    console.log("PATCH fields:", fields)
    console.log("PATCH files:", files)

    // Ambil dokumen existing sebagai fallback
    const client = await clientPromise
    const db = client.db("insighthink")
    const existingDoc = await db.collection("videos").findOne({ _id: new ObjectId(id) })
    if (!existingDoc) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Gunakan helper untuk memastikan field-field tersimpan sebagai string
    const title = getStringField(fields.title, getStringField(existingDoc.title, ""))
    const embedUrl = getStringField(fields.embedUrl, getStringField(existingDoc.embedUrl, ""))
    const creatorName = getStringField(fields.creatorName, getStringField(existingDoc.creatorName, ""))
    const summary = getStringField(fields.summary, getStringField(existingDoc.summary, "<p><br></p>"))

    // Tangani file thumbnail
    let thumbnailUrl = ""
    let thumbnailFile = files.thumbnail
    if (Array.isArray(thumbnailFile)) {
      thumbnailFile = thumbnailFile[0]
    }
    if (thumbnailFile) {
      const actualThumbnailPath = thumbnailFile.filepath || thumbnailFile.path || thumbnailFile.newFilename
      if (actualThumbnailPath) {
        thumbnailUrl = `/uploads/videos/${path.basename(actualThumbnailPath)}`
      }
    }

    // Tangani file creatorAvatar
    let creatorAvatarUrl = ""
    let avatarFile = files.creatorAvatar
    if (Array.isArray(avatarFile)) {
      avatarFile = avatarFile[0]
    }
    if (avatarFile) {
      const actualAvatarPath = avatarFile.filepath || avatarFile.path || avatarFile.newFilename
      if (actualAvatarPath) {
        creatorAvatarUrl = `/uploads/videos/${path.basename(actualAvatarPath)}`
      }
    }

    const updatedVideo: Partial<VideoData> = {
      title,
      embedUrl,
      creatorName,
      summary,
      updatedAt: new Date().toISOString(),
    }
    if (thumbnailUrl) {
      updatedVideo.thumbnailUrl = thumbnailUrl
    }
    if (creatorAvatarUrl) {
      updatedVideo.creatorAvatarUrl = creatorAvatarUrl
    }

    const updateResult = await db.collection("videos").updateOne({ _id: new ObjectId(id) }, { $set: updatedVideo })
    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }
    const updatedDoc = await db.collection("videos").findOne({ _id: new ObjectId(id) })
    if (!updatedDoc) {
      return NextResponse.json({ error: "Video not found after update" }, { status: 404 })
    }
    const video: VideoData = {
      id: updatedDoc._id.toString(),
      title: getStringField(updatedDoc.title, ""),
      embedUrl: getStringField(updatedDoc.embedUrl, ""),
      creatorName: getStringField(updatedDoc.creatorName, ""),
      summary: getStringField(updatedDoc.summary, "<p><br></p>"),
      createdAt: updatedDoc.createdAt,
      creatorAvatarUrl: updatedDoc.creatorAvatarUrl,
      thumbnailUrl: updatedDoc.thumbnailUrl,
      duration: updatedDoc.duration,
      views: updatedDoc.views,
      likes: updatedDoc.likes,
    }
    return NextResponse.json({ message: "Video updated successfully", video }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating video:", error)
    return NextResponse.json({ error: error.message || "Failed to update video" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (!hexRegex.test(id)) {
    return NextResponse.json({ error: "Invalid video ID format" }, { status: 400 })
  }
  try {
    const client = await clientPromise
    const db = client.db("insighthink")
    const doc = await db.collection("videos").findOne({ _id: new ObjectId(id) })
    if (!doc) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }
    const video: VideoData = {
      id: doc._id.toString(),
      title: getStringField(doc.title, ""),
      embedUrl: getStringField(doc.embedUrl, ""),
      creatorName: getStringField(doc.creatorName, ""),
      summary: getStringField(doc.summary, "<p><br></p>"),
      createdAt: doc.createdAt,
      creatorAvatarUrl: doc.creatorAvatarUrl,
      thumbnailUrl: doc.thumbnailUrl,
      duration: doc.duration,
      views: doc.views,
      likes: doc.likes,
    }
    return NextResponse.json(video, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
