import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 8);
    const limit = parseInt(url.searchParams.get("limit") || "8", 8);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("insighthink");
    const collection = db.collection("library");

    // Fetch total book count for pagination
    const totalBooks = await collection.countDocuments();

    // Retrieve books with pagination
    const books = await collection
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
          image: 1, // legacy field fallback
          createdAt: 1,
        },
      })
      .skip(skip)
      .limit(limit)
      .toArray();

    const transformedBooks = books.map((book: any) => ({
      _id: book._id.toString(),
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      content: book.content || "",
      chapters: Array.isArray(book.chapters) ? book.chapters : [],
      keyTerms: Array.isArray(book.keyTerms) ? book.keyTerms : [],
      coverImageId: (book.coverImageId || book.image || "").toString(),
      createdAt: book.createdAt ? new Date(book.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      books: transformedBooks,
      totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    }, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch (error: any) {
    console.error("Error in GET /api/library:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
