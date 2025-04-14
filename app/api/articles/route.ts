import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("insighthink");
    const articles = await db.collection("articles").find({}).toArray();

    // Map each article document to a safe object.
    const articlesMapped = articles.map((article: any) => ({
      _id: article._id.toString(),
      title: article.title,
      description: article.description,
      content: article.content,
      excerpt: article.excerpt,
      source: article.source,
      author: article.author,
      references: Array.isArray(article.references) ? article.references : [],
      createdAt: article.createdAt ? new Date(article.createdAt).toISOString() : null,
    }));

    return NextResponse.json(articlesMapped, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, content, author, source, excerpt, references } = data;

    // Validate required fields.
    if (!title || !description || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure references is an array.
    const refs = Array.isArray(references) ? references : [];

    const article = {
      title,
      description,
      content,
      author,
      source: source || "",
      excerpt: excerpt || "",
      references: refs,
      createdAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db("insighthink");
    const result = await db.collection("articles").insertOne(article);

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "Failed to add article" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, articleId: result.insertedId.toString() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding article:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
