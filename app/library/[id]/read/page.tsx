"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ReadingProgress } from "@/components/reading-progress";
import { FontControls } from "@/components/font-controls";
import { BookContent } from "@/components/book-content";
import { KeyTermsSidebar } from "@/components/key-terms-sidebar";
import type { BookData } from "@/lib/book";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCover } from "@/components/BookCover";
import { Button } from "@/components/ui/button";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  console.log("GET response status:", res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error fetching data:", errorText);
    throw new Error("Failed to fetch book data");
  }
  return res.json();
};

const isValidId = (id: string): boolean => /^[a-fA-F0-9]{24}$/.test(id);

export default function ReadBookPage() {
  const { id } = useParams<{ id: string }>();
  console.log("Using book id:", id);
  
  // Responsive typography settings
  const [fontSize, setFontSize] = useState(18);
  const [fontStyle, setFontStyle] = useState("serif"); // serif fonts are known for better readability in long texts
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode on the root element
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  if (!id || !isValidId(id)) {
    return <div className="p-4 text-red-500">Invalid book ID</div>;
  }

  const { data: bookData, error, isLoading } = useSWR<BookData>(
    `/api/library/${id}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleFontSizeChange = (delta: number) => {
    setFontSize((prev) => Math.max(14, Math.min(28, prev + delta)));
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    console.error("API Error:", error);
    return (
      <div className="p-4 text-red-500">
        Error: {error.message}
        <br />
        Please check if the book ID is valid and try again.
      </div>
    );
  }

  if (!bookData) {
    return <div className="p-4 text-red-500">No book data available</div>;
  }

  // Build the cover image URL (assuming your cover images are in /uploads/books/)
  const coverId = bookData.coverImageId || "";
  const imageUrl = coverId ? `/uploads/books/${coverId}` : "/placeholder.svg";
  console.log("Image URL:", imageUrl);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className={`flex flex-col h-full ${isDarkMode ? "dark" : ""}`}>
          <ReadingProgress />
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/library">Library</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium truncate max-w-[200px] md:max-w-[400px]">
                      {bookData.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <span className="text-yellow-400">☀️</span>
                ) : (
                  <span className="text-gray-800">🌙</span>
                )}
              </Button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col flex-1 overflow-auto p-6">
              <FontControls
                fontSize={fontSize}
                fontStyle={fontStyle}
                onFontSizeChange={handleFontSizeChange}
                onFontStyleChange={setFontStyle}
              />
              <BookContent
                bookData={bookData}
                fontSize={fontSize}
                fontStyle={fontStyle}
              />
            </div>
            <div className="w-80 p-4 overflow-auto bg-muted/20">
              <KeyTermsSidebar keyTerms={bookData.keyTerms ?? []} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <Skeleton className="h-8 w-32" />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-auto p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="w-80 p-4 overflow-auto">
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
