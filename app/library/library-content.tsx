"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import type { BookData } from "@/lib/book";
import { formatDate, cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type LibraryContentProps = {
  initialBooks: BookData[];
  initialTotalPages: number;
};

export function LibraryContent({
  initialBooks,
  initialTotalPages,
}: LibraryContentProps) {
  const [books, setBooks] = useState<BookData[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery === "") {
      fetchBooks(page);
    }
  }, [page]);

  const fetchBooks = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/library?page=${page}&limit=10`);
      const data = await response.json();
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchBooks(page);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by title or author..."
            className="pl-10 pr-10 py-6 rounded-full border-muted bg-background/50 focus-visible:ring-offset-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          size="lg"
          className="rounded-full px-6 gap-2 min-w-[140px] shadow-sm"
          asChild
        >
          <Link href="/library/add">
            <Plus className="h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredBooks.map((book) => (
              <motion.div key={book._id} variants={item}>
                <BookCard book={book} />
              </motion.div>
            ))}
            {filteredBooks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="bg-muted/30 rounded-full p-6 mb-4">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {searchQuery ? "No books found" : "Your library is empty"}
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {searchQuery
                    ? `We couldn't find any books matching "${searchQuery}". Try a different search term.`
                    : "Start building your collection by adding your first book."}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/library/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Book
                    </Link>
                  </Button>
                )}
                {searchQuery && (
                  <Button variant="outline" onClick={handleClearSearch}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </motion.div>

          {filteredBooks.length > 0 && totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="lg"
                    onClick={() => setPage(page - 1)}
                    className={cn(
                      "transition-all",
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:scale-105"
                    )}
                  />
                </PaginationItem>

                {/* Display first page if applicable */}
                {page > 2 && (
                  <PaginationItem>
                    <PaginationLink
                      size="lg"
                      onClick={() => setPage(1)}
                      className="hover:scale-105 transition-all"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Ellipsis if skipping pages */}
                {page > 3 && <PaginationEllipsis />}

                {/* Display page numbers around the current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p >= page - 1 && p <= page + 1)
                  .map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        size="lg"
                        onClick={() => setPage(p)}
                        isActive={p === page}
                        className={cn(
                          "transition-all",
                          p === page ? "scale-110" : "hover:scale-105"
                        )}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {/* Ellipsis if there are more pages */}
                {page < totalPages - 2 && <PaginationEllipsis />}

                {/* Display last page if applicable */}
                {page < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      size="lg"
                      onClick={() => setPage(totalPages)}
                      className="hover:scale-105 transition-all"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    size="lg"
                    onClick={() => setPage(page + 1)}
                    className={cn(
                      "transition-all",
                      page >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:scale-105"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

type BookCardProps = {
  book: BookData;
};

const BookCard = ({ book }: BookCardProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl =
    book.coverImageId && !imageError
      ? `/api/book-cover/${book.coverImageId}`
      : "/placeholder.svg?height=300&width=200";

  return (
    <div className="group h-full rounded-xl overflow-hidden bg-background border border-muted/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="relative aspect-[2/3] bg-muted/30 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`Cover of ${book.title}`}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
          {book.author}
        </p>
        {book.createdAt && (
          <p className="text-xs text-muted-foreground mt-auto mb-3">
            Added on: {formatDate(book.createdAt)}
          </p>
        )}
        <Button
          asChild
          variant="secondary"
          className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
        >
          <Link
            href={`/library/${book._id}`}
            className="flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

const BookCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-background border border-muted/50 shadow-sm flex flex-col h-full">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-4 flex flex-col gap-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3 mt-auto mb-3" />
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  </div>
);
