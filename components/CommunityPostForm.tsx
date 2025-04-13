"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ImageIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CommunityPostFormProps {
  onPostCreated?: () => void;
}

export function CommunityPostForm({ onPostCreated }: CommunityPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, imageUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      // Clear the form on success
      setTitle("");
      setContent("");
      setImageUrl("");
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-6">
      <CardHeader className="border-b border-gray-200 px-4 py-3 bg-gray-50">
        <CardTitle className="text-lg font-semibold">Share Your Thoughts</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="What's the headline?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="content" className="text-sm font-medium">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL (optional)</Label>
            <div className="relative">
              <Input
                id="imageUrl"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
              <ImageIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Image Preview"
                className="w-full max-h-60 object-cover rounded-md border"
              />
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <CardFooter className="px-0">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
