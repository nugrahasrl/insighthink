"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Pastikan CSS Quill diimpor hanya di file global (app/globals.css):
// @import "quill/dist/quill.core.css";
// @import "quill/dist/quill.snow.css";

// Import ReactQuill secara dinamis (client-side only)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Definisikan modules secara eksplisit untuk memastikan hanya satu toolbar yang muncul
const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }], // Header dropdown
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
];

export default function AddVideoPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [creatorAvatar, setCreatorAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("embedUrl", embedUrl);
      formData.append("creatorName", creatorName);
      formData.append("summary", summary);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (creatorAvatar) formData.append("creatorAvatar", creatorAvatar);

      const res = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create video");
      }
      router.push("/videos");
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
        <header className="flex h-16 items-center gap-2 border-b px-6 py-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/videos">Videos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Add Video</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Add New Video</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title"
              />
            </div>
            <div>
              <Label htmlFor="embedUrl">Embed URL</Label>
              <Input
                id="embedUrl"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="Video embed URL"
              />
            </div>
            <div>
              <Label htmlFor="creatorName">Creator Name</Label>
              <Input
                id="creatorName"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Name of the creator"
              />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <ReactQuill
                theme="snow"
                modules={quillModules}
                value={summary}
                onChange={setSummary}
                placeholder="Write your summary..."
                className="h-40 border rounded-md overflow-hidden"
              />
            </div>
            <div>
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setThumbnail(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="creatorAvatar">Creator Avatar</Label>
              <Input
                id="creatorAvatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCreatorAvatar(e.target.files[0]);
                  }
                }}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Video"}
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
