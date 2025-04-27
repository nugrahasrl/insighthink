"use client";

import { useState, useEffect } from "react";
import type { BookData } from "@/lib/book";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NavigationControls } from "@/components/navigation-controls";
import dynamic from "next/dynamic";

// Dynamically import our static renderer component
const EditorJsRenderer = dynamic(
  () => import("@/components/editor-js-renderer"),
  { ssr: false }
);

// Helper functions to get the appropriate class or inline style for the selected font style.
const getFontClass = (fontStyle: string) => {
  switch (fontStyle) {
    case "serif":
      return "font-serif";
    case "sans-serif":
      return "font-sans";
    case "monospace":
      return "font-mono";
    default:
      return ""; // For cursive and fantasy, we will apply an inline style.
  }
};

const getInlineFontStyle = (fontStyle: string) => {
  if (fontStyle === "cursive" || fontStyle === "fantasy") {
    return { fontFamily: fontStyle };
  }
  return {};
};

interface BookContentProps {
  bookData?: BookData;
  fontSize: number;
  fontStyle: string;
}

export function BookContent({
  bookData,
  fontSize,
  fontStyle,
}: BookContentProps) {
  // State for client-side rendering
  const [mounted, setMounted] = useState(false);
  // We'll use the chapter index as our page state.
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  if (!bookData.chapters?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No chapters available</p>
      </div>
    );
  }

  // Get the chapter to display based on the current chapter index.
  const currentChapter = bookData.chapters[currentChapterIndex];

  // Handlers for pagination navigation.
  const goToPrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentChapterIndex < bookData.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6">
        <div
          className={cn(
            "py-6 max-w-2xl mx-auto",
            "selection:bg-primary/20",
            getFontClass(fontStyle) // Tailwind class for serif, sans-serif, or monospace.
          )}
          style={{
            fontSize: `${fontSize}px`,
            ...getInlineFontStyle(fontStyle), // Inline style for cursive or fantasy.
          }}
        >
          <div
            key={currentChapterIndex}
            data-chapter={currentChapterIndex}
            className={cn(
              "mb-8",
              "transition-opacity duration-300",
              "opacity-100",
              "text-justify"
            )}
          >
            <h2
              className={cn(
                "text-2xl font-semibold mb-4",
                "scroll-mt-20",
                "tracking-tight"
              )}
              id={`chapter-${currentChapterIndex}`}
            >
              {currentChapter.title}
            </h2>

            {/* Render chapter content using our static renderer */}
            <div
              className={cn(
                "prose dark:prose-invert max-w-none",
                "prose-headings:scroll-mt-20",
                "prose-p:leading-7",
                "prose-li:leading-7",
                "prose-code:rounded-md",
                "prose-code:bg-muted",
                "prose-code:p-1",
                "prose-blockquote:border-l-primary",
                "prose-blockquote:text-muted-foreground",
                "prose-img:rounded-md"
              )}
            >
              {typeof currentChapter.content === "object" ? (
                <EditorJsRenderer data={currentChapter.content} />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentChapter.content as string,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Use the NavigationControls component for pagination */}
      <NavigationControls
        currentPage={currentChapterIndex + 1} // chapters are one-indexed for display
        totalPages={bookData.chapters.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </div>
  );
}
