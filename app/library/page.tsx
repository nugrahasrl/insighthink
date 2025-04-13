'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from "../../components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LibraryContent } from "./library-content";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import type { BookData } from '@/lib/book';

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
        const response = await fetch(`http://localhost:3000/api/library?page=${currentPage}&limit=${booksPerPage}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Client: Received books:', data);

        if (Array.isArray(data.books)) {
          setBooks(data.books);
          setTotalPages(data.totalPages);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Client: Error fetching books:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [currentPage]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Library</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Books</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {loading ? (
            <div className="text-center py-8">Loading books...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <LibraryContent initialBooks={books} initialTotalPages={0} />
              
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
