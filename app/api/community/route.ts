import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export const runtime = "node";
export const revalidate = 0;

// GET handler for fetching posts with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("insighthink");

    // Fetch posts and total count in parallel
    const [posts, totalPosts] = await Promise.all([
      db
        .collection("CommunityPosts")
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("CommunityPosts").countDocuments(),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    // Transform MongoDB _id to string
    const transformedPosts = posts.map((post: any) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return NextResponse.json({ posts: transformedPosts, totalPages }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch posts" }, { status: 500 });
  }
}

// POST handler with authentication for creating new posts
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a post" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { title, content, imageUrl } = body;
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    // Use session.user.id if available, otherwise use a unique identifier
    const authorId = session.user.id || crypto.randomUUID();
    const authorName = session.user.name || "Anonymous User";
    
    // Create new post object
    const newPost = {
      title,
      content,
      imageUrl: imageUrl || null,
      authorName,
      authorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Connect to database and insert post
    const client = await clientPromise;
    const db = client.db("insighthink");
    const result = await db.collection("CommunityPosts").insertOne(newPost);

    if (!result.insertedId) {
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }

    // Return success response with created post
    return NextResponse.json(
      {
        message: "Post created successfully",
        post: { ...newPost, _id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}