// lib/books.server.ts
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
    const collection = db.collection("library");

    // Include fields for title, author, description, content, chapters, keyTerms, coverImageId and legacy image
    const projection = {
      title: 1,
      author: 1,
      description: 1,
      content: 1,
      chapters: 1,
      keyTerms: 1,
      coverImageId: 1,
      image: 1,  // Legacy field if used previously
      createdAt: 1,
      genres: 1,
    };

    const query = { _id: new ObjectId(id) };
    const book = await collection.findOne(query, { projection });
    if (!book) {
      return null;
    }

    // Map the document to our BookData type.
    return {
      _id: book._id.toString(),
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      content: book.content || "",
      createdAt: book.createdAt ? new Date(book.createdAt).toISOString() : new Date().toISOString(),
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
      // Use coverImageId if available, otherwise fallback to legacy image field.
      coverImageId: book.coverImageId || book.image || "",
      genres: book.genres || [],
      readingTime: 0, // Placeholder value for reading time
    };
  } catch (error) {
    console.error("Book fetch error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      bookId: id,
    });
    return null;
  }
}
