import { BookData } from "@/types/book";
export const fetchBook = async (id: string): Promise<BookData> => {
    const response = await fetch(`/api/books/${id}`);
    if (!response.ok) throw new Error("Failed to fetch book");
    return response.json();
  };