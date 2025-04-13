'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 px-4 py-3 bg-background">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="transition-transform hover:scale-105"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <span className="text-sm text-muted-foreground">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="transition-transform hover:scale-105"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
