import { NextResponse } from "next/server";
import { ObjectId, WithId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";
export const revalidate = 0;

interface ArticleDoc {
  _id?: ObjectId;
  title: string;
  description: string;
  content: string;
  excerpt?: string;
  author?: string;
  references?: string[];
  createdAt: string;
  updatedAt?: string;
}

const hexRegex = /^[0-9a-fA-F]{24}$/;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!hexRegex.test(id)) {
    return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db("insighthink");
    const articleDoc = await db
      .collection<ArticleDoc>("articles")
      .findOne({ _id: new ObjectId(id) });
    if (!articleDoc) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(
      { ...articleDoc, _id: articleDoc._id?.toString() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/articles/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!hexRegex.test(id)) {
    return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const { _id, references, ...updateData } = body; // Ignore `_id`
    updateData.updatedAt = new Date().toISOString();
    if (references) {
      updateData.references = Array.isArray(references)
        ? references
        : references.split("\n").map((ref: string) => ref.trim()).filter(Boolean);
    }
    const client = await clientPromise;
    const db = client.db("insighthink");
    const result = await db.collection<ArticleDoc>("articles").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );
    let updatedArticle = result?.value as ArticleDoc | null;
    if (!updatedArticle) {
      // Fallback: Lakukan query ulang jika findOneAndUpdate tidak mengembalikan dokumen
      updatedArticle = await db.collection<ArticleDoc>("articles").findOne({ _id: new ObjectId(id) });
      if (!updatedArticle) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }
    }
    return NextResponse.json(
      { success: true, article: { ...updatedArticle, _id: updatedArticle._id?.toString() } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/articles/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
