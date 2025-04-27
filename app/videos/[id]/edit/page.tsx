"use client";

import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { EditBookForm, type BookFormValues } from "@/components/edit-book-form";
import type { BookData } from "@/lib/book";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch book data");
    return res.json();
  });

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    data: bookData,
    error,
    isLoading,
    mutate,
  } = useSWR<BookData>(id ? `/api/library/${id}` : null, fetcher);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Library", href: "/library" },
            { label: "Book", href: `/library/${id}` },
            { label: "Edit", active: true },
          ]}
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (error || !bookData) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Library", href: "/library" },
            { label: "Error", active: true },
          ]}
        />
        <div className="p-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Error Loading Book</h2>
            <p>
              Could not load book data. Please check if the book ID is valid and
              try again.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/library">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Map the fetched data to default values for the edit form.
  const defaultValues: BookFormValues = {
    title: bookData.title,
    author: bookData.author,
    description:
      typeof bookData.description === "string"
        ? bookData.description
        : JSON.stringify(bookData.description),
    chapters:
      bookData.chapters && bookData.chapters.length > 0
        ? bookData.chapters.map((chapter) => ({
            title: chapter.title,
            content:
              typeof chapter.content === "string"
                ? chapter.content
                : JSON.stringify(chapter.content),
          }))
        : [{ title: "Chapter 1", content: "" }],
    keyTerms: bookData.keyTerms || [{ term: "", definition: "" }],
    pageCount: bookData.pageCount?.toString() || "",
    readingTime: bookData.readingTime?.toString() || "",
    genres: bookData.genres?.join(", ") || "",
    coverImageUrl: bookData.coverImageUrl,
  };

  const handleSubmit = async (data: BookFormValues) => {
    setIsSubmitting(true);
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();

      // Add basic text fields
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("description", data.description || "");

      // Add numeric fields - ensure they're sent as strings
      if (data.pageCount) formData.append("pageCount", data.pageCount);
      if (data.readingTime) formData.append("readingTime", data.readingTime);

      console.log("Sending form data with:", {
        pageCount: data.pageCount,
        readingTime: data.readingTime,
      });

      // Add genres
      if (data.genres) formData.append("genres", data.genres);

      // Add chapters as JSON string
      if (data.chapters && data.chapters.length > 0) {
        formData.append("chapters", JSON.stringify(data.chapters));
      }

      // Add key terms as JSON string
      if (data.keyTerms && data.keyTerms.length > 0) {
        formData.append("keyTerms", JSON.stringify(data.keyTerms));
      }

      // Add cover image if it's a File object (new upload)
      if (data.coverImage instanceof File) {
        formData.append("coverImage", data.coverImage);
      }

      console.log("Submitting form data...");

      const res = await fetch(`/api/library/${id}`, {
        method: "PATCH",
        body: formData, // Send as FormData, not JSON
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update book");
      }

      console.log("Book updated successfully:", result);

      // Redirect to the book detail page after successful update
      router.push(`/library/${id}`);
    } catch (error) {
      console.error("Error updating book:", error);
      // Here you would typically show an error message to the user
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Library", href: "/library" },
          { label: bookData.title, href: `/library/${id}` },
          { label: "Edit", active: true },
        ]}
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Book
          </h1>
          <Button asChild variant="outline">
            <Link href={`/library/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Book
            </Link>
          </Button>
        </div>
        <EditBookForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          defaultValues={defaultValues}
        />
      </div>
    </>
  );
}
