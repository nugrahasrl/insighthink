"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

import type { VideoData } from "@/lib/video-types";

// Import ReactQuill dynamically (client-side only)
// Note: CSS for Quill is imported in app/globals.css
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Define modules and formats for Quill to ensure a single toolbar
const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }], // Header dropdown (H1, H2, Normal)
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

export default function EditVideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [creatorAvatar, setCreatorAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Current thumbnail and avatar URLs for preview
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("");

  // Fetch existing video data on mount and prefill form
  useEffect(() => {
    async function fetchVideo() {
      try {
        setLoading(true);
        const res = await fetch(`/api/videos/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true);
          } else {
            const errText = await res.text();
            throw new Error(`Failed to fetch video data: ${errText}`);
          }
          return;
        }

        const data: VideoData = await res.json();

        setTitle(Array.isArray(data.title) ? data.title[0] : data.title || "");
        setEmbedUrl(data.embedUrl || "");
        setCreatorName(data.creatorName || "");
        setSummary(data.summary || "");

        if (data.thumbnailUrl) {
          setCurrentThumbnailUrl(data.thumbnailUrl);
        }

        if (data.creatorAvatarUrl) {
          setCurrentAvatarUrl(data.creatorAvatarUrl);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchVideo();
    }
  }, [id]);

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

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      if (creatorAvatar) {
        formData.append("creatorAvatar", creatorAvatar);
      }

      // Optionally, add flags if your API needs to know whether files changed.
      formData.append("thumbnailChanged", thumbnail ? "true" : "false");
      formData.append("avatarChanged", creatorAvatar ? "true" : "false");

      const res = await fetch(`/api/videos/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update video");
      }

      toast({
        title: "Video updated",
        description: "The video has been successfully updated.",
      });

      router.push(`/videos/${id}`);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to update video",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
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
                  <BreadcrumbPage>Not Found</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="container mx-auto max-w-3xl px-4 py-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                The video you're trying to edit doesn't exist or has been removed.
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/videos")}>Back to Videos</Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                <BreadcrumbLink href={`/videos/${id}`}>
                  {loading ? <Skeleton className="h-4 w-20" /> : title || "Video"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Edit Video</h1>
            <Button variant="outline" onClick={() => router.push(`/videos/${id}`)}>
              Cancel
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
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
                  formats={quillFormats}
                  value={summary}
                  onChange={setSummary}
                  placeholder="Write your summary..."
                  className="h-40 border rounded-md overflow-hidden"
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                {currentThumbnailUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-2">Current thumbnail:</p>
                    <img
                      src={currentThumbnailUrl || "/placeholder.svg"}
                      alt="Current thumbnail"
                      className="h-24 object-cover rounded-md mb-2"
                    />
                  </div>
                )}
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
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to keep the current thumbnail
                </p>
              </div>
              <div>
                <Label htmlFor="creatorAvatar">Creator Avatar</Label>
                {currentAvatarUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-2">Current avatar:</p>
                    <img
                      src={currentAvatarUrl || "/placeholder.svg"}
                      alt="Current avatar"
                      className="h-16 w-16 object-cover rounded-full mb-2"
                    />
                  </div>
                )}
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
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to keep the current avatar
                </p>
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => router.push(`/videos/${id}`)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
