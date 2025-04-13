"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define the structure of a community post.
export interface CommunityPost {
  _id: string;
  title?: string;
  content: string;
  authorName: string;
  imageUrl?: string;
  createdAt: string;
}

interface CommunityFeedProps {
  posts: CommunityPost[];
}

export function CommunityFeed({ posts }: CommunityFeedProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <img
          src="/Empty-cuate.png"
          alt="No posts"
          className="w-24 h-24 mb-4"
        />
        <p className="text-center text-gray-500 text-2xl">
          No posts available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <Card
          key={post._id}
          className="shadow rounded-lg border border-gray-200 overflow-hidden"
        >
          <CardHeader className="bg-gray-50 p-4">
            <CardTitle className="text-lg font-semibold">
              {post.title || "Untitled Post"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Posted by {post.authorName} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-800">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post image"
                className="mt-4 w-full h-auto rounded-md object-cover"
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
