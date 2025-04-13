"use client"

import * as React from "react"
import { BookOpen, Filter, Grid3X3, List, Search, Video } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for collections
const collections = {
  videos: [
    {
      id: 1,
      title: "Introduction to React Hooks",
      description: "Learn the basics of React Hooks and how to use them in your projects",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "15:24",
      source: "YouTube",
      savedAt: "2023-12-10",
    },
    {
      id: 2,
      title: "Advanced CSS Techniques",
      description: "Master advanced CSS techniques for modern web development",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "22:15",
      source: "Vimeo",
      savedAt: "2023-11-28",
    },
    {
      id: 3,
      title: "Building a Full-Stack App with Next.js",
      description: "Step-by-step guide to building a full-stack application with Next.js",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "45:30",
      source: "Udemy",
      savedAt: "2023-12-05",
    },
    {
      id: 4,
      title: "TypeScript for JavaScript Developers",
      description: "Learn how to leverage TypeScript in your JavaScript projects",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "32:18",
      source: "YouTube",
      savedAt: "2023-12-01",
    },
  ],
  books: [
    {
      id: 1,
      title: "Eloquent JavaScript",
      author: "Marijn Haverbeke",
      cover: "/placeholder.svg?height=240&width=160",
      pages: 472,
      category: "Programming",
      savedAt: "2023-11-15",
    },
    {
      id: 2,
      title: "Clean Code",
      author: "Robert C. Martin",
      cover: "/placeholder.svg?height=240&width=160",
      pages: 464,
      category: "Software Engineering",
      savedAt: "2023-10-22",
    },
    {
      id: 3,
      title: "Design Patterns",
      author: "Erich Gamma et al.",
      cover: "/placeholder.svg?height=240&width=160",
      pages: 416,
      category: "Software Design",
      savedAt: "2023-09-30",
    },
  ],
  articles: [
    {
      id: 1,
      title: "The Future of Web Development",
      source: "Medium",
      author: "Sarah Johnson",
      excerpt: "Exploring upcoming trends and technologies in web development for the next decade",
      readTime: "8 min read",
      savedAt: "2023-12-08",
    },
    {
      id: 2,
      title: "Understanding React Server Components",
      source: "Dev.to",
      author: "Michael Chen",
      excerpt: "A deep dive into React Server Components and how they change the way we build React applications",
      readTime: "12 min read",
      savedAt: "2023-11-25",
    },
    {
      id: 3,
      title: "Optimizing Performance in Next.js Applications",
      source: "Vercel Blog",
      author: "Emma Rodriguez",
      excerpt: "Learn how to improve the performance of your Next.js applications with these proven techniques",
      readTime: "10 min read",
      savedAt: "2023-12-03",
    },
    {
      id: 4,
      title: "The Complete Guide to CSS Grid",
      source: "CSS-Tricks",
      author: "Chris Coyier",
      excerpt: "Everything you need to know about CSS Grid Layout and how to use it effectively",
      readTime: "15 min read",
      savedAt: "2023-11-18",
    },
    {
      id: 5,
      title: "Accessibility Best Practices for Web Developers",
      source: "A11Y Project",
      author: "David Thompson",
      excerpt: "Essential accessibility practices every web developer should implement in their projects",
      readTime: "9 min read",
      savedAt: "2023-12-07",
    },
  ],
}

export default function CollectionsPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Collections</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Your Collections</h1>
              <p className="text-muted-foreground">Browse and manage your saved videos, books, and articles</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64 md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search collections..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setViewMode("grid")}>
                <Grid3X3 className={viewMode === "grid" ? "text-primary" : ""} />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode("list")}>
                <List className={viewMode === "list" ? "text-primary" : ""} />
                <span className="sr-only">List view</span>
              </Button>
              <Button variant="outline" size="icon">
                <Filter />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Videos
                <Badge variant="secondary" className="ml-1">
                  {collections.videos.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="books" className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Books
                <Badge variant="secondary" className="ml-1">
                  {collections.books.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
                Articles
                <Badge variant="secondary" className="ml-1">
                  {collections.articles.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Videos Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Video className="h-5 w-5" /> Videos
                  </h2>
                  <Button variant="link" size="sm">
                    View all videos
                  </Button>
                </div>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "space-y-4"
                  }
                >
                  {collections.videos.slice(0, 4).map((video) => (
                    <VideoCard key={video.id} video={video} viewMode={viewMode} />
                  ))}
                </div>
              </div>

              {/* Books Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> Books
                  </h2>
                  <Button variant="link" size="sm">
                    View all books
                  </Button>
                </div>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "space-y-4"
                  }
                >
                  {collections.books.slice(0, 3).map((book) => (
                    <BookCard key={book.id} book={book} viewMode={viewMode} />
                  ))}
                </div>
              </div>

              {/* Articles Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                      <path d="M18 14h-8" />
                      <path d="M15 18h-5" />
                      <path d="M10 6h8v4h-8V6Z" />
                    </svg>{" "}
                    Articles
                  </h2>
                  <Button variant="link" size="sm">
                    View all articles
                  </Button>
                </div>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "space-y-4"
                  }
                >
                  {collections.articles.slice(0, 4).map((article) => (
                    <ArticleCard key={article.id} article={article} viewMode={viewMode} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-4"
                }
              >
                {collections.videos.map((video) => (
                  <VideoCard key={video.id} video={video} viewMode={viewMode} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="books">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-4"
                }
              >
                {collections.books.map((book) => (
                  <BookCard key={book.id} book={book} viewMode={viewMode} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="articles">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-4"
                }
              >
                {collections.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} viewMode={viewMode} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

interface VideoCardProps {
  video: {
    id: number
    title: string
    description: string
    thumbnail: string
    duration: string
    source: string
    savedAt: string
  }
  viewMode: "grid" | "list"
}

function VideoCard({ video, viewMode }: VideoCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 w-full sm:h-auto sm:w-48">
            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="h-full w-full object-cover" />
            <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
              {video.duration}
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1">{video.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Badge variant="outline">{video.source}</Badge>
                <span>•</span>
                <span>Saved on {video.savedAt}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Watch
              </Button>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="h-48 w-full object-cover" />
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {video.duration}
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-base">{video.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Badge variant="outline">{video.source}</Badge>
          <span>•</span>
          <span>Saved on {video.savedAt}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm">
          Watch
        </Button>
        <Button variant="ghost" size="sm">
          Remove
        </Button>
      </CardFooter>
    </Card>
  )
}

interface BookCardProps {
  book: {
    id: number
    title: string
    author: string
    cover: string
    pages: number
    category: string
    savedAt: string
  }
  viewMode: "grid" | "list"
}

function BookCard({ book, viewMode }: BookCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="h-48 w-full sm:h-auto sm:w-32">
            <img src={book.cover || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1">{book.title}</CardTitle>
              <CardDescription>by {book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{book.category}</Badge>
                  <span>•</span>
                  <span>{book.pages} pages</span>
                </div>
                <p className="text-xs text-muted-foreground">Saved on {book.savedAt}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Read
              </Button>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-center p-4">
        <img src={book.cover || "/placeholder.svg"} alt={book.title} className="h-48 object-cover" />
      </div>
      <CardHeader className="p-4 pt-0">
        <CardTitle className="line-clamp-1 text-base">{book.title}</CardTitle>
        <CardDescription>by {book.author}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{book.category}</Badge>
            <span>•</span>
            <span>{book.pages} pages</span>
          </div>
          <p className="text-xs text-muted-foreground">Saved on {book.savedAt}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm">
          Read
        </Button>
        <Button variant="ghost" size="sm">
          Remove
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ArticleCardProps {
  article: {
    id: number
    title: string
    source: string
    author: string
    excerpt: string
    readTime: string
    savedAt: string
  }
  viewMode: "grid" | "list"
}

function ArticleCard({ article, viewMode }: ArticleCardProps) {
  if (viewMode === "list") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="line-clamp-1">{article.title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs">
            <Badge variant="outline">{article.source}</Badge>
            <span>•</span>
            <span>by {article.author}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            Read
          </Button>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Saved on {article.savedAt}</p>
            <Button variant="ghost" size="sm">
              Remove
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{article.source}</Badge>
          <span className="text-xs text-muted-foreground">{article.readTime}</span>
        </div>
        <CardTitle className="line-clamp-2 mt-2 text-base">{article.title}</CardTitle>
        <CardDescription className="text-xs">by {article.author}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm">
          Read
        </Button>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">Saved on {article.savedAt}</p>
          <Button variant="ghost" size="icon" size-sm>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

