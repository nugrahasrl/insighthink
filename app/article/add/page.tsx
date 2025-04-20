"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";


// Load ReactQuill secara dinamis (client-side only)
const TextEditor = dynamic(() => import("@/components/editor-js"), { ssr: false })

export default function AddArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    source: "",
    excerpt: "",
    references: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Parse references dari comma-separated string ke array
      const refs = formData.references.split(",").map((r) => r.trim()).filter((r) => r);
      const payload = { ...formData, references: refs };

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      if (result.success) {
        setSuccess("Article added successfully!");
        router.push("/article");
      } else {
        throw new Error(result.message || "Failed to add article");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Article</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Button asChild variant="outline" className="w-fit">
            <Link href="/article">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
          <h1 className="text-2xl font-bold mt-3">Add New Article</h1>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="block text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="block text-sm font-medium">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description"
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div>
              <Label htmlFor="content" className="block text-sm font-medium">
                Content
              </Label>
              {/* Use TextEditor for content input */}
              <TextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                placeholder="Article content (HTML allowed)"
                className="mt-1 rounded-sm"
              />
            </div>
            <div>
              <Label htmlFor="author" className="block text-sm font-medium">
                Author
              </Label>
              <Input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="source" className="block text-sm font-medium">
                Source
              </Label>
              <Input
                id="source"
                name="source"
                type="text"
                value={formData.source}
                onChange={handleChange}
                placeholder="Source URL"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="excerpt" className="block text-sm font-medium">
                Excerpt
              </Label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Short excerpt"
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div>
              <Label htmlFor="references" className="block text-sm font-medium">
                References (comma-separated)
              </Label>
              <textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleChange}
                placeholder="Reference 1, Reference 2, Reference 3"
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Article"}
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
