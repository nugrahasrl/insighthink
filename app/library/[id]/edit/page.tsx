"use client"

import { useRouter, useParams } from "next/navigation"
import useSWR from "swr"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EditBookForm, type BookFormValues } from "@/components/edit-book-form"
import type { BookData } from "@/lib/book"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch book data")
    return res.json()
  })

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: bookData, error, isLoading, mutate } = useSWR<BookData>(id ? `/api/library/${id}` : null, fetcher)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) return <div>Loading...</div>
  if (error || !bookData) return <div>Error loading book data. Please check if the book ID is valid and try again.</div>

  // Map the fetched data to default values for the edit form.
  const defaultValues: BookFormValues = {
    title: bookData.title,
    author: bookData.author,
    description: bookData.description,
    content: bookData.content || "",
    chapters: bookData.chapters && bookData.chapters.length > 0 ? bookData.chapters : [{ title: "", content: "" }],
    keyTerms: bookData.keyTerms || [],
    coverImage: bookData.coverImageId, // Pass the image ID
    coverImageUrl: bookData.coverImageUrl || null, // Also pass the image URL for display
  }

  const handleSubmit = async (data: BookFormValues) => {
    setIsSubmitting(true)
    try {
      const updatedData = { ...data }
      if (data.coverImageFile) {
        const formData = new FormData()
        formData.append("file", data.coverImageFile)
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!uploadRes.ok) throw new Error("Failed to upload cover image")
        const uploadResult = await uploadRes.json()
        updatedData.coverImage = uploadResult.id
        updatedData.coverImageUrl = uploadResult.url // Pastikan URL juga diperbarui
      }
      delete updatedData.coverImageFile
  
      const res = await fetch(`/api/library/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      const result = await res.json()
  
      if (res.ok && result.success) {
        await mutate() // Refresh data
        router.push(`/library/${id}`) // Redirect ke halaman detail
      } else {
        throw new Error(result.message || "Failed to update book")
      }
    } catch (error) {
      console.error("Error updating book:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/library">Library</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Book</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4 pt-0">
          <Button asChild variant="ghost" className="w-fit mt-4">
            <Link href={`/library/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Book Detail
            </Link>
          </Button>
          <h1 className="text-2xl font-bold mt-3">Edit Book</h1>
          <EditBookForm onSubmit={handleSubmit} isSubmitting={isSubmitting} defaultValues={defaultValues} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

