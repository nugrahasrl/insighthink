'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ArticleContent } from "./article-content";
import type { ArticleData } from '@/lib/article';

export default function ArticlePage() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        console.log('Fetching articles...');
        const response = await fetch('http://localhost:3000/api/articles');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Client: Received articles:', data);
        
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Client: Error fetching articles:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    }
    
    loadArticles();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Articles</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>All Articles</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {loading ? (
            <div className="text-center py-8">Loading articles...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <ArticleContent initialArticles={articles} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
