// lib/books.client.ts
export async function getBook(id: string): Promise<any> {
    const res = await fetch(`/api/library/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch book data");
    }
    return res.json();
  }
  