import { NextResponse } from "next/server";
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

// GET Request Handler
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("insighthink");

    // Fetch all curated content from the database
    const curatedContents = await db.collection("curated_content").find({}).toArray();

    // Map the results to the CuratedContent interface
    const mappedContents = curatedContents.map((doc) => mapToCuratedContent(doc));

    // Return the curated content as JSON
    return NextResponse.json(mappedContents);
  } catch (error) {
    console.error("Error fetching curated contents:", error);
    return NextResponse.json({ error: "Failed to fetch curated contents" }, { status: 500 });
  }
}