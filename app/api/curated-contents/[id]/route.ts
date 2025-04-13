import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// Define the interface for CuratedContent
interface CuratedContent {
  id: string;
  type: "articles" | "videos";
  title: string;
  description: string;
  source: string;
  link: string;
  readTime: string;
  likes: number;
  duration?: string;
  views?: number;
  content: string;
}

// Helper function to map MongoDB document to CuratedContent
function mapToCuratedContent(article: any): CuratedContent {
  return {
    id: article.id || article._id.toString(), // Use the `id` field or convert `_id` to a string
    type: article.type || "",
    title: article.title || "",
    description: article.description || "",
    source: article.source || "",
    link: article.link || "",
    readTime: article.readTime || "",
    likes: article.likes ? Number(article.likes) : 0,
    duration: article.duration || "",
    views: article.views || 0,
    content: article.content || "",
  };
}

// GET Request Handler: Fetch a single curated content by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("insighthink");

    // Convert the string ID to an ObjectId
    const objectId = new ObjectId(params.id);

    // Fetch the curated content from the database
    const article = await db.collection("curated_content").findOne({ _id: objectId });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Map the result to the CuratedContent interface
    const mappedArticle = mapToCuratedContent(article);

    // Return the curated content as JSON
    return NextResponse.json(mappedArticle);
  } catch (error) {
    console.error("Error fetching curated content:", error);
    return NextResponse.json({ error: "Failed to fetch curated content" }, { status: 500 });
  }
}

// PUT Request Handler: Update a single curated content by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json(); // Parse the request body
    const { type, title, description, source, link, readTime, likes, duration, views, content } = body;

    const client = await clientPromise;
    const db = client.db("insighthink");

    // Convert the string ID to an ObjectId
    const objectId = new ObjectId(params.id);

    // Update the curated content in the database
    const result = await db.collection("curated_content").updateOne(
      { _id: objectId },
      {
        $set: {
          type,
          title,
          description,
          source,
          link,
          readTime,
          likes,
          duration,
          views,
          content,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: "Article updated successfully" });
  } catch (error) {
    console.error("Error updating curated content:", error);
    return NextResponse.json({ error: "Failed to update curated content" }, { status: 500 });
  }
}

// DELETE Request Handler: Delete a single curated content by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("insighthink");

    // Convert the string ID to an ObjectId
    const objectId = new ObjectId(params.id);

    // Delete the curated content from the database
    const result = await db.collection("curated_content").deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting curated content:", error);
    return NextResponse.json({ error: "Failed to delete curated content" }, { status: 500 });
  }
}