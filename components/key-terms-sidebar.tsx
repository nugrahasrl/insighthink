"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KeyTerm {
  id: string;
  term: string;
  definition: string;
}

interface KeyTermsSidebarProps {
  keyTerms: KeyTerm[];
}

export function KeyTermsSidebar({ keyTerms }: KeyTermsSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      {/* Toggle button with smooth transition */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute right-4 top-4 z-10 transition-transform duration-300 hover:scale-105"
        aria-label={isOpen ? "Close key terms" : "Open key terms"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>

      {/* Animated container */}
      <div
        className={`transition-all duration-300 ease-in-out bg-background shadow-sm rounded-sm ${
          isOpen ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <Card className="h-full">
          <div className="flex h-16 items-center justify-between border-b px-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold">Key Terms</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="p-6 space-y-4">
              {keyTerms.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No key terms available for this section.
                </p>
              ) : (
                keyTerms.map((term) => (
                  <div key={term.id} className="space-y-1 border-b pb-2 last:border-0 last:pb-0">
                    <h3 className="text-base font-medium">{term.term}</h3>
                    <p className="text-sm text-muted-foreground">{term.definition}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
