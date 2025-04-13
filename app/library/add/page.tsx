"use client"

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
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BookPlus, Library } from "lucide-react"
import { AddBookForm, type BookFormValues } from "@/components/add-book-form"
import { useToast } from "@/hooks/use-toast"

export default function AddBookPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: BookFormValues) => {
    setIsSubmitting(true)
    try {
      // Create a FormData object.
      const formData = new FormData()

      // For each key in data, append it to formData.
      // For fields that are arrays (chapters, keyTerms), JSON.stringify them.
      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof BookFormValues // Explicitly type the key

        if (typedKey === "chapters" || typedKey === "keyTerms") {
          formData.append(typedKey, JSON.stringify(data[typedKey]))
        } else if (typedKey === "coverImage" && data[typedKey]) {
          formData.append(typedKey, data[typedKey] as File)
        } else {
          formData.append(typedKey, String(data[typedKey]))
        }
      })

      // Send the POST request to add the book.
      const response = await fetch("/api/library/add", {
        method: "POST",
        body: formData,
      })

      // Check for HTTP errors.
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("POST /api/library/add response:", result)

      if (result.success) {
        toast({
          title: "Success!",
          description: "Your book has been added to the library.",
          variant: "default",
        })
        // On success, redirect to the library page.
        window.location.href = "/library"
      } else {
        throw new Error(result.message || "Failed to add book")
      }
    } catch (error: any) {
      console.error("Error adding book:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  <BreadcrumbLink href="/library" className="flex items-center gap-1">
                    <Library className="h-3.5 w-3.5" />
                    Library
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1">
                    <BookPlus className="h-3.5 w-3.5" />
                    Add New Book
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button asChild variant="ghost" size="sm" className="mb-2">
                <Link
                  href="/library"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Library
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Add New Book</h1>
              <p className="text-muted-foreground mt-1">Fill in the details below to add a new book to your library</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-muted/30 p-3 rounded-full">
                <BookPlus className="h-8 w-8 text-primary/70" />
              </div>
            </div>
          </div>

          <Card className="border border-muted/60 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 bg-muted/20 rounded-lg p-4 border border-muted/40 mb-2">
                  <h2 className="font-medium flex items-center gap-2 text-muted-foreground mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    Important
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    All fields marked with an asterisk (*) are required. Book cover images should be in JPG, PNG, or
                    WebP format.
                  </p>
                </div>

                <div className="md:col-span-3">
                  <AddBookForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

