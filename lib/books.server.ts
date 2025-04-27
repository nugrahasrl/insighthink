import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { BookData } from "@/lib/book"

export async function getBook(id: string): Promise<BookData | null> {
  try {
    if (!ObjectId.isValid(id)) {
      console.error("Invalid book ID format:", id)
      return null
    }

    const client = await clientPromise
    const db = client.db("insighthink")
    const book = await db.collection("library").findOne({ _id: new ObjectId(id) })

    if (!book) {
      console.error("Book not found with ID:", id)
      return null
    }

    // Convert _id to string for JSON serialization in a new object
    const bookWithIdString = {
      ...book,
      _id: book._id.toString(),
    }

    // Ensure numeric fields are properly typed
    if (book.pageCount) {
      book.pageCount = Number(book.pageCount)
    }

    if (book.readingTime) {
    return bookWithIdString as BookData
    }

    return {
      _id: book._id.toString(),
      title: book.title || "",
      description: book.description || "",
      author: book.author || "",
      content: book.content || "",
      pageCount: book.pageCount ? Number(book.pageCount) : 0,
      readingTime: book.readingTime ? Number(book.readingTime) : 0,
      publishedDate: book.publishedDate || null,
    } as BookData
  } catch (error) {
    console.error("Error fetching book:", error)
    return null
  }
}
