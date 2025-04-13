"use server"

import { google } from "googleapis"
import { Readable } from "stream"
import { connectToDatabase } from "@/lib/mongodb"

const SCOPES = ["https://www.googleapis.com/auth/drive.file"]

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || ""),
  scopes: SCOPES,
})

const drive = google.drive({ version: "v3", auth })

export async function addBook(formData: FormData) {
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const chapters = JSON.parse(formData.get("chapters") as string)
  const keyterms = formData.get("keyterms") as string
  const coverImage = formData.get("coverImage") as File

  let coverImageUrl = ""

  if (coverImage) {
    const fileMetadata = {
      name: `${title}_cover.${coverImage.type.split("/")[1]}`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    }

    const media = {
      mimeType: coverImage.type,
      body: Readable.from(Buffer.from(await coverImage.arrayBuffer())),
    }

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    })

    if (file.data.id) {
      await drive.permissions.create({
        fileId: file.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      })

      coverImageUrl = `https://drive.google.com/uc?export=view&id=${file.data.id}`
    }
  }

  const { db } = await connectToDatabase()

  const result = await db.collection("books").insertOne({
    title,
    author,
    description,
    content,
    chapters,
    keyterms: keyterms.split(",").map((term) => term.trim()),
    coverImageUrl,
    createdAt: new Date(),
  })

  return { success: true, bookId: result.insertedId }
}

