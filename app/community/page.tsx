"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import Link from "next/link"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MessageSquare, Search, Plus, Calendar, TrendingUp, Clock, Heart } from "lucide-react"
import { useSession } from "next-auth/react"

export type CommunityPost = {
  _id: string
  title?: string
  content: string
  authorName: string
  imageUrl?: string
  createdAt: string
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = 10
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/community?page=${currentPage}&limit=${postsPerPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data.posts)) {
        setPosts(data.posts)
        setTotalPages(data.totalPages)
      } else {
        throw new Error("Invalid data format received")
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts, currentPage])

  // Filter posts based on searchTerm
  const filteredPosts = posts.filter((post) => {
    const postTitle = Array.isArray(post.title) ? post.title[0] : post.title || ""
    return postTitle.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center gap-4 border-b px-6 py-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Community</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Feed</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="bg-background p-6 shadow-sm mb-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Community Feed</h1>
              <p className="text-muted-foreground">Connect, share, and learn with fellow community members</p>
            </div>

            {/* Search & Create Post */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full max-w-sm">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="Search your knowledge..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
              <CommunityPostForm onPostCreated={fetchPosts} />
            </div>

            {/* Tabs for filtering */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto mb-6">
                <TabsTrigger value="all" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                  All
                </TabsTrigger>
                <TabsTrigger value="trending" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                  <TrendingUp className="mr-2 h-4 w-4 inline-block align-text-bottom" />
                  <span className="inline-block">Trending</span>
                </TabsTrigger>
                <TabsTrigger value="latest" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                  <Clock className="mr-2 h-4 w-4 inline-block align-text-bottom" />
                  <span className="inline-block">Latest</span>
                </TabsTrigger>
                <TabsTrigger value="popular" className="rounded-sm px-3 py-1.5 text-sm font-medium">
                  <Heart className="mr-2 h-4 w-4 inline-block align-text-bottom" />
                  <span className="inline-block">Popular</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading community posts...</p>
              </div>
            ) : error ? (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
                <CardContent className="py-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                      <svg
                        className="h-6 w-6 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-red-800 dark:text-red-300">Error Loading Posts</h3>
                    <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchPosts}>
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : filteredPosts.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <MessageSquare className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No posts found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "Be the first to create a post!"}
                </p>
                {searchTerm && (
                  <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredPosts.map((post) => {
                  const postTitle = Array.isArray(post.title) ? post.title[0] : post.title || "Untitled Post"
                  return (
                    <Card
                      key={post._id}
                      className="overflow-hidden transition-all duration-200 hover:shadow-md rounded-xl border"
                    >
                      {post.imageUrl && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={postTitle}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className={post.imageUrl ? "pt-4" : ""}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs font-normal">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(post.createdAt)}
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2">{postTitle}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{getInitials(post.authorName)}</AvatarFallback>
                          </Avatar>
                          <span>{post.authorName}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button asChild variant="ghost" size="sm" className="gap-1 -ml-2 text-primary">
                          <Link href={`/community/${post._id}`}>
                            Read More
                            <svg
                              className="h-4 w-4 transition-transform group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {posts.length > 0 && (
            <div className="mt-8">
              <div className="bg-background rounded-xl border p-4 shadow-sm inline-block">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={i + 1 === currentPage}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Enhanced CommunityPostForm component
function CommunityPostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [formError, setFormError] = useState("")
  const [charCount, setCharCount] = useState(0)
  const maxChars = 500
  
  // Get current user's session
  const { data: session } = useSession()

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setPostContent(content)
    setCharCount(content.length)
  }

  const handleCreatePost = async () => {
    if (!postTitle.trim()) {
      setFormError("Please enter a post title")
      return
    }

    if (!postContent.trim()) {
      setFormError("Please enter post content")
      return
    }

    if (!session?.user) {
      setFormError("You must be logged in to create a post")
      return
    }

    try {
      setIsSubmitting(true)
      setFormError("")

      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          imageUrl: imageUrl || undefined,
          // Don't send authorId from client side since we'll get it from the session on server side
          authorName: session.user.name || "Anonymous User",
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      onPostCreated()
      setPostTitle("")
      setPostContent("")
      setImageUrl("")
      setCharCount(0)
    } catch (error) {
      console.error(error)
      setFormError("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 h-11 px-4 font-medium">
          <Plus className="w-5 h-5" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Post</DialogTitle>
          <DialogDescription>Share your thoughts, questions, or updates with the community.</DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-md text-sm mb-4 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50">
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {formError}
            </div>
          </div>
        )}

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="postTitle" className="text-sm font-medium">
              Post Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="postTitle"
              placeholder="e.g. My Community Update"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL (optional)
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="h-10"
            />
            {imageUrl && (
              <div className="mt-2 rounded-md overflow-hidden border h-32">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=256"
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="postContent" className="text-sm font-medium">
                Post Content <span className="text-red-500">*</span>
              </Label>
              <span className={`text-xs ${charCount > maxChars ? "text-red-500" : "text-muted-foreground"}`}>
                {charCount}/{maxChars}
              </span>
            </div>
            <textarea
              id="postContent"
              placeholder="Write your post here..."
              value={postContent}
              onChange={handleContentChange}
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              maxLength={maxChars}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={handleCreatePost}
            disabled={isSubmitting || charCount > maxChars || !postTitle.trim() || !postContent.trim() || !session?.user}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

