import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Handle pagination with validation
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "8", 10)));
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("insighthink");
    
    // Parallelize count and data fetching
    const [totalBooks, books] = await Promise.all([
      db.collection("library").countDocuments(),
      db.collection("library")
        .find({}, {
          projection: {
            _id: 1,
            title: 1,
            author: 1,
            description: 1,
            content: 1,
            chapters: 1,
            keyTerms: 1,
            coverImageId: 1,
            image: 1,
            createdAt: 1,
          },
        })
        .skip(skip)
        .limit(limit)
        .toArray()
    ]);

    const transformedBooks = books.map((book) => ({
      _id: book._id.toString(),
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      content: book.content || "",
      chapters: Array.isArray(book.chapters) ? book.chapters : [],
      keyTerms: Array.isArray(book.keyTerms) ? book.keyTerms : [],
      coverImageId: (book.coverImageId || book.image || "").toString(),
      createdAt: book.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({
      books: transformedBooks,
      totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    }, {
      headers: { 
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" 
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/library:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}