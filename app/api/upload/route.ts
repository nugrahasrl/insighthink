// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";
import { Buffer } from "buffer";

// Disable the built‑in body parser (not used since we use formData)
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// Use the new config keys (if needed)
export const revalidate = 0;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/insighthink";
const DB_NAME = "insighthink"; // adjust if needed

export async function POST(request: Request) {
  try {
    // Parse the form data from the request
    const formData = await request.formData();

    // Get the file from the form. The input name must be "file"
    const fileField = formData.get("file");
    if (!(fileField instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the file (a Web File) to an ArrayBuffer then to a Node.js Buffer
    const arrayBuffer = await fileField.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    // Create a GridFSBucket with the bucket name "images"
    const bucket = new GridFSBucket(db, { bucketName: "images" });

    // Open an upload stream. Use the file's name and type; include custom metadata if desired.
    const uploadStream = bucket.openUploadStream(fileField.name, {
      contentType: fileField.type || "application/octet-stream",
      metadata: {
        description: "Book cover image", // Example custom metadata; adjust as needed.
      },
    });

    // Write the file buffer to the upload stream
    uploadStream.end(fileBuffer);

    // Wait until the upload stream finishes
    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", () => resolve());
      uploadStream.on("error", (err) => reject(err));
    });

    // Optionally, close the MongoDB connection.
    await client.close();

    // Return a successful response with the file ID (as a string)
    return NextResponse.json(
      { message: "File uploaded successfully", fileId: uploadStream.id.toString() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
