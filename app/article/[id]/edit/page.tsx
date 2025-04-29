"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import type EditorJS from "@editorjs/editorjs";

// Import editor secara dinamis (client-side only)
const EditorJSRenderer = dynamic(() => import("@/components/editor-js-renderer"), { 
  ssr: false,
  loading: () => <div className="h-64 border rounded-md p-3 bg-muted">Loading editor...</div>
});

interface ArticleData {
  _id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  excerpt: string;
  references: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Local state for form data.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    source: "",
    excerpt: "",
    // We'll store references as a newline-separated string.
    references: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk update content dari EditorJS
  const handleEditorChange = (newContent: string) => {
    setFormData((prev) => ({
      ...prev,
      content: newContent,
    }));
  };

  // Fetch the article on mount.
  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch article data");
        }
        const data: ArticleData = await res.json();
        setArticle(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          author: data.author || "",
          source: data.source || "",
          excerpt: data.excerpt || "",
          references: Array.isArray(data.references)
            ? data.references.join("\n")
            : "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const refs =
        formData.references && formData.references.trim().length > 0
          ? formData.references.split(/\r?\n/).map((r) => r.trim()).filter((r) => r.length > 0)
          : [];

      const payload = { ...formData, references: refs };

      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update article");
      }

      const result = await res.json();
      if (result.success) {
        setSuccess("Article updated successfully!");
        router.push(`/article/${id}`);
      } else {
        throw new Error(result.error || "Failed to update article");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  if (error && !article) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/article">Articles</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Article</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Button asChild variant="outline" className="w-fit">
            <Link href={`/article/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Article
            </Link>
          </Button>
          <h1 className="text-2xl font-bold mt-3">Edit Article</h1>
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
                placeholder="Article Title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="block text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Article Description"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="content" className="block text-sm font-medium">
                Content
              </Label>
              <div className="mt-1 border rounded-md">
                <EditorJSRenderer
                  data={formData.content}
                />
              </div>
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
                placeholder="Author Name"
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
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Short Excerpt"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="references" className="block text-sm font-medium">
                References (one per line)
              </Label>
              <Textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleChange}
                placeholder="Enter one reference per line"
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}