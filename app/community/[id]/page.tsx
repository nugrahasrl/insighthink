"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type CommunityPost = {
  _id: string;
  title?: string;
  content: string;
  authorName: string;
  imageUrl?: string;
  createdAt: string;
};

export default function CommunityPostPage() {
  const params = useParams();
  const router = useRouter();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Post ID is missing");
      setLoading(false);
      return;
    }

    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/community/${id}`, { cache: "no-store" });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch post: ${errorText}`);
        }

        // Mengambil data dari response sesuai dengan struktur { success: true, data: CommunityPost }
        const json = await res.json();
        if (!json.success) {
          throw new Error("Response tidak sukses");
        }
        setPost(json.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading)
    return <div className="p-4 text-center text-gray-600">Loading post...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!post)
    return <div className="p-4 text-center text-gray-500">Post not found</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex items-center gap-4 border-b px-6 py-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/community">Community</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title || "Untitled Post"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="container mx-auto max-w-3xl px-4 py-6">
          <Button asChild variant="outline" className="w-fit mb-4">
            <Link href="/community">← Back to Community</Link>
          </Button>

          <article className="border rounded-md p-6 shadow-sm bg-white">
            <h1 className="text-3xl font-bold mb-3">{post.title || "Untitled Post"}</h1>
            <p className="text-sm text-gray-500 mb-4">
              By <span className="font-medium">{post.authorName}</span> on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

            {post.imageUrl && (
              <div className="relative h-64 w-full mb-4">
                <img
                  src={post.imageUrl}
                  alt={post.title || "Post Image"}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            )}

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
