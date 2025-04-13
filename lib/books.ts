// lib/books.ts
import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import type { BookData } from "./book";
import crypto from "crypto";

export async function getBook(id: string): Promise<BookData | null> {
  try {
    if (!id) {
      console.warn("getBook called with empty ID");
      return null;
    }
    if (!ObjectId.isValid(id)) {
      return null; // Invalid ID format
    }

    const client = await clientPromise;
    const db = client.db("insighthink");
    // Query the "library" collection where your book documents are stored.
    const collection = db.collection("library");

    // Update the projection to include the coverImageId field.
    const projection = {
      title: 1,
      author: 1,
      description: 1,
      content: 1,
      createdAt: 1,
      chapters: 1,
      keyTerms: 1,
      coverImageId: 1, // This field stores the GridFS file ID for the cover image.
      genres: 1,
      pageCount: 1,
      readingTime: 1,
      updatedAt: 1,
      bookmarks: 1,
      readingProgress: 1,
      rating: 1,
      publishedDate: 1,
      coverImageUrl: 1,
    };

    const book = await collection.findOne({ _id: new ObjectId(id) }, { projection });
    if (!book) {
      return null; // Book not found
    }

    // Transform the book data into a type-safe format.
    return {
      _id: book._id.toString(),
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      content: book.content || "",
      createdAt: book.createdAt
        ? new Date(book.createdAt).toISOString()
        : new Date().toISOString(),
      chapters: (book.chapters || []).map((chapter: any) => ({
        id: chapter.id || crypto.randomUUID(),
        title: chapter.title || "",
        content: chapter.content || "",
        order: chapter.order || 0,
      })),
      keyTerms: (book.keyTerms || []).map((term: any, index: number) => ({
        id: term.id || index.toString(),
        term: term.term || "",
        definition: term.definition || "",
      })),
      coverImageId: book.coverImageId || "", // The GridFS file ID for the cover image
      genres: book.genres ? book.genres.join(", ") : "",
      pageCount: book.pageCount || 0,
      readingTime: book.readingTime || 0,
    };
  } catch (error) {
    console.error("Book fetch error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      bookId: id,
    });
    return null;
  }
}
