"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ArrowUp, Calendar, Clock, FileText, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ArticleData {
  _id: string
  title: string
  description: string
  content: string
  author: string
  source: string
  excerpt: string
  references: string[]
  createdAt?: string
  updatedAt?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function TableOfContents({
  chapters,
}: {
  chapters: { level: number; text: string; id: string }[]
}) {
  const [activeHeading, setActiveHeading] = useState<string>("")

  useEffect(() => {
    const headingElements = chapters.map((chapter) => document.getElementById(chapter.id)).filter(Boolean)

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i]
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(element.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [chapters])

  return (
    <div className="hidden lg:block sticky top-4 self-start p-4 mb-4 w-64">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="font-semibold text-sm uppercase tracking-wide mb-3 text-muted-foreground">Table of Contents</h3>
        <nav>
          <ul className="space-y-1 text-sm">
            {chapters.map((heading) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 hover:text-primary transition-colors ${
                    activeHeading === heading.id ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 500)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible) return null

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
      aria-label="Back to Top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

function ArticleMetadata({ article }: { article: ArticleData }) {
  // Calculate estimated reading time (average reading speed: 200 words per minute)
  const wordCount = article.content.replace(/<[^>]*>/g, "").split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6 text-sm">
      {article.author && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{article.author}</span>
        </div>
      )}

      {article.source && (
        <Badge variant="outline" className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>{article.source}</span>
        </Badge>
      )}

      {article.createdAt && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(article.createdAt)}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  )
}

function ArticleContent({
  content,
  chapters,
}: { content: string; chapters: { level: number; text: string; id: string }[] }) {
  // Process content to add IDs to headings for TOC linking
  let processedContent = content

  chapters.forEach((chapter, index) => {
    const regex = new RegExp(`<h${chapter.level}>(${chapter.text})<\/h${chapter.level}>`, "i")
    processedContent = processedContent.replace(
      regex,
      `<h${chapter.level} id="${chapter.id}" class="scroll-mt-16">${chapter.text}</h${chapter.level}>`,
    )
  })

  return (
    <div
      className="prose prose-slate max-w-none dark:prose-invert
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-md
                prose-pre:bg-muted prose-pre:shadow-sm
                prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-0.5
                prose-strong:text-foreground
                prose-code:text-muted-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-li:marker:text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}

function References({ references }: { references: string[] }) {
  if (!references || references.length === 0) return null

  return (
    <Card className="mt-10 p-6">
      <h3 className="text-lg font-semibold mb-4">References</h3>
      <ol className="space-y-3 text-sm text-muted-foreground">
        {references.map((ref, idx) => (
          <li key={idx} className="pl-2">
            <span className="block">{ref}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      <div className="hidden lg:block w-64">
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
      <div className="flex-1 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>
        <div className="space-y-3 pt-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="rounded-full bg-destructive/10 p-3 text-destructive mb-4">
        <FileText className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Failed to load article</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't load the article you requested. This might be due to a network issue or the article may no longer
        exist.
      </p>
      <Button asChild>
        <Link href="/article">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Link>
      </Button>
    </div>
  )
}

export default function ArticlePage() {
  const { id: articleIdParam } = useParams<{ id: string }>()

  const { data: article, error } = useSWR<ArticleData>(
    articleIdParam ? `/api/articles/${articleIdParam}` : null,
    fetcher,
  )

  const [chapters, setChapters] = useState<{ level: number; text: string; id: string }[]>([])

  useEffect(() => {
    if (article && article.content) {
      const regex = /<h([1-6])>(.*?)<\/h\1>/gi
      const headings: { level: number; text: string; id: string }[] = []
      let match
      while ((match = regex.exec(article.content)) !== null) {
        const cleanText = match[2].replace(/<[^>]+>/g, "").trim()
        const id = `heading-${headings.length}`
        headings.push({ level: Number(match[1]), text: cleanText, id })
      }
      setChapters(headings)
    }
  }, [article])

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
                  <BreadcrumbPage>{article?.title || "Loading..."}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {error ? (
          <ErrorState />
        ) : !article ? (
          <LoadingState />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8 p-6">
              <TableOfContents chapters={chapters} />

              <main className="flex-1 max-w-3xl mx-auto lg:mx-0">
                <div className="flex justify-between items-center mb-6">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/article">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Articles
                    </Link>
                  </Button>
                </div>

                <h1 className="text-3xl font-bold tracking-tight mb-4">{article.title}</h1>

                {article.description && (
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{article.description}</p>
                )}

                <ArticleMetadata article={article} />

                <Separator className="my-6" />

                <ArticleContent content={article.content} chapters={chapters} />

                <References references={article.references} />
              </main>
            </div>

            <BackToTopButton />
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

