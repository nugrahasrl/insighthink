"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { LibraryContent } from "./library-content";
import Loading from "./loading";
import type { BookData } from "@/lib/book";

export default function LibraryPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 8; // Adjust based on API

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        console.log(`Fetching books for page ${currentPage}...`);
        const response = await fetch(
          `/api/library?page=${currentPage}&limit=${booksPerPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Client: Received books:", data);

        if (Array.isArray(data.books)) {
          setBooks(data.books);
          setTotalPages(data.totalPages);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        console.error("Client: Error fetching books:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch books"
        );
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [currentPage]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Library", href: "#" },
          { label: "All Books", active: true },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {loading ? (
          <div className="text-center py-8">
            <Loading />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <LibraryContent initialBooks={books} initialTotalPages={totalPages} />
        )}
      </div>
    </>
  );
}
