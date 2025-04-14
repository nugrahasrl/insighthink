import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import clientPromise from "@/lib/mongodb";
import type { VideoAPIResponse, VideoData } from "@/lib/video-types";

export const config = {
  api: {
    bodyParser: false,
  },
  // runtime: "nodejs",
  revalidate: 0,
};

const uploadDir = path.join(process.cwd(), "public/uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function parseFormData(request: Request) {
  const buf = Buffer.from(await request.arrayBuffer());
  const fakeReq = new Readable();
  fakeReq.push(buf);
  fakeReq.push(null);

  // Set properti yang dibutuhkan agar mirip IncomingMessage
  (fakeReq as any).headers = Object.fromEntries(request.headers.entries());
  (fakeReq as any).method = request.method;
  (fakeReq as any).url = request.url;
  (fakeReq as any).aborted = false;
  (fakeReq as any).httpVersion = "1.1";
  (fakeReq as any).httpVersionMajor = 1;
  (fakeReq as any).httpVersionMinor = 1;

  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });
    form.parse(fakeReq as IncomingMessage, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(request: Request) {
  try {
    const { fields, files } = await parseFormData(request);
    const { title, embedUrl, creatorName, summary } = fields;
    // Pastikan input file memiliki name "thumbnail" dan "creatorAvatar"
    let thumbnailFile = files.thumbnail;
    if (Array.isArray(thumbnailFile)) {
      thumbnailFile = thumbnailFile[0];
    }
    let avatarFile = files.creatorAvatar;
    if (Array.isArray(avatarFile)) {
      avatarFile = avatarFile[0];
    }

    let thumbnailUrl = "";
    if (thumbnailFile) {
      const actualThumbnailPath =
        thumbnailFile.filepath || thumbnailFile.path || thumbnailFile.newFilename;
      if (!actualThumbnailPath) {
        return NextResponse.json(
          { error: "File path not found for thumbnail" },
          { status: 500 }
        );
      }
      thumbnailUrl = `/uploads/videos/${path.basename(actualThumbnailPath)}`;
    }

    let creatorAvatarUrl = "";
    if (avatarFile) {
      const actualAvatarPath =
        avatarFile.filepath || avatarFile.path || avatarFile.newFilename;
      if (!actualAvatarPath) {
        return NextResponse.json(
          { error: "File path not found for creator avatar" },
          { status: 500 }
        );
      }
      creatorAvatarUrl = `/uploads/videos/${path.basename(actualAvatarPath)}`;
    }

    if (!title || !embedUrl || !creatorName || !summary) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVideo: Partial<VideoData> = {
      title,
      embedUrl,
      creatorName,
      summary,
      thumbnailUrl,
      creatorAvatarUrl,
      createdAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db("insighthink");
    const result = await db.collection("videos").insertOne(newVideo);
    if (!result.insertedId) {
      return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
    }
    return NextResponse.json(
      {
        message: "Video created successfully",
        video: { ...newVideo, id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating video:", error);
    return NextResponse.json({ error: error.message || "Failed to create video" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("insighthink");
    const videosDocs = await db.collection("videos").find({}).toArray();
    const videos = videosDocs.map((doc: any) => ({
      id: doc._id.toString(),
      title: doc.title,
      embedUrl: doc.embedUrl,
      creatorName: doc.creatorName,
      creatorAvatarUrl: doc.creatorAvatarUrl,
      thumbnailUrl: doc.thumbnailUrl,
      summary: doc.summary,
      createdAt: doc.createdAt,
      duration: doc.duration,
      views: doc.views,
      likes: doc.likes,
    }));
    const total = videos.length;
    const response: VideoAPIResponse = {
      videos,
      total,
      page: 1,
      perPage: total,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
