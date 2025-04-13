// app/api/book-cover/[id]/route.ts
import { NextResponse } from "next/server";
import { MongoClient, ObjectId, GridFSBucket } from "mongodb";
import { Readable } from "stream"; // Node's stream module
// If you are on Node 18+ and using the experimental web stream API,
// you might need to import from "node:stream" instead.

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "insighthink"; // adjust as needed

async function getGridFsStream(id: string) {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // Create a GridFSBucket instance; ensure bucket name matches your uploads.
  const bucket = new GridFSBucket(db, { bucketName: "images" });

  // Validate and create an ObjectId from the provided id.
  let fileId: ObjectId;
  try {
    fileId = new ObjectId(id);
  } catch (error) {
    throw new Error("Invalid file id");
  }

  // Find file info in the files collection.
  const fileDoc = await db.collection("images.files").findOne({ _id: fileId });
  if (!fileDoc) {
    throw new Error("File not found");
  }

  // Open a download stream from GridFS.
  const downloadStream = bucket.openDownloadStream(fileId);

  // Convert the Node.js stream to a Web ReadableStream.
  const webStream = Readable.toWeb(downloadStream);

  return { stream: webStream, contentType: fileDoc.contentType || "image/jpeg", client };
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { stream, contentType, client } = await getGridFsStream(id);

    // Optionally close the MongoDB connection after a short delay
    setTimeout(() => client.close(), 1000);

    const headers = new Headers();
    headers.set("Content-Type", contentType);

    // Cast the web stream to BodyInit and return a NextResponse.
    return new NextResponse(stream as unknown as BodyInit, { headers });
  } catch (error: any) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
