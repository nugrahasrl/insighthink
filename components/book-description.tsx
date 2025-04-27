"use client";

import dynamic from "next/dynamic";

// Dynamically import our static renderer component
const EditorJsRenderer = dynamic(
  () => import("@/components/editor-js-renderer"),
  { ssr: false }
);

interface BookDescriptionProps {
  description: any;
}

export function BookDescription({ description }: BookDescriptionProps) {
  // If description is an object (EditorJS data), use the renderer
  if (typeof description === "object" && description !== null) {
    return <EditorJsRenderer data={description} />;
  }

  // If description is a string, render it as HTML
  if (typeof description === "string") {
    return <div dangerouslySetInnerHTML={{ __html: description }} />;
  }

  // Fallback for empty or invalid description
  return <p className="text-muted-foreground">No description available</p>;
}
