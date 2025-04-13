"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Share2, Bookmark, Clock, Eye, Search, X, SortAsc, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import type { VideoData, VideoAPIResponse } from "@/lib/video-types"

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<"newest" | "popular">("newest")

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        const res = await fetch("/api/videos")
        if (!res.ok) {
          throw new Error("Failed to fetch videos")
        }
        const data: VideoAPIResponse = await res.json()
        setVideos(data.videos)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Filter videos based on search term (case-insensitive)
  const filteredVideos = videos.filter((video) => {
    const videoTitle = Array.isArray(video.title) ? video.title[0] : video.title
    return videoTitle.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Sort videos based on selected option
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.publishedAt || Date.now()).getTime() - new Date(a.publishedAt || Date.now()).getTime()
    } else {
      return (b.viewCount || 0) - (a.viewCount || 0)
    }
  })

  // Format view count with K, M suffixes
  const formatViewCount = (count = 0): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    } else {
      return `${count} views`
    }
  }

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds = 0): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

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
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Videos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="container mx-auto p-4 max-w-7xl">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <SortAsc className="h-4 w-4" />
                    <span className="hidden sm:inline">Sort by:</span>
                    <span>{sortOption === "newest" ? "Newest" : "Popular"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("popular")}>Most Popular</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {searchTerm ? `${sortedVideos.length} results for "${searchTerm}"` : `${sortedVideos.length} videos`}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && sortedVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No videos found</h3>
              <p className="mb-6 text-muted-foreground">We couldn't find any videos matching "{searchTerm}"</p>
              <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
            </div>
          )}

          {/* Video Grid */}
          {!loading && sortedVideos.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sortedVideos.map((video) => {
                const videoTitle = Array.isArray(video.title) ? video.title[0] : video.title
                return (
                  <Card key={video.id} className="group overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="p-0">
                      <Link href={`/videos/${video.id}`} className="block">
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                          {video.thumbnailUrl ? (
                            <>
                              <Image
                                src={video.thumbnailUrl || "/placeholder.svg"}
                                alt={videoTitle}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {video.duration && (
                                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                                  {formatDuration(video.duration)}
                                </div>
                              )}
                              {video.isNew && (
                                <Badge variant="secondary" className="absolute left-2 top-2">
                                  NEW
                                </Badge>
                              )}
                            </>
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                              No thumbnail
                            </div>
                          )}
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-3">
                      <Link href={`/videos/${video.id}`} className="block">
                        <CardTitle className="line-clamp-2 text-base font-medium leading-tight hover:text-primary">
                          {videoTitle}
                        </CardTitle>
                      </Link>
                      <div className="mt-2 flex items-start gap-2">
                        <Link href={`/creator/${video.creatorId || "unknown"}`}>
                          <Avatar className="h-8 w-8 border">
                          <AvatarImage
  src={video.creatorAvatarUrl || "/placeholder-avatar.jpg"}
  alt={Array.isArray(video.creatorName) ? video.creatorName[0] : video.creatorName || "Creator"} 
/>

<AvatarFallback>
  {typeof video.creatorName === "string" ? video.creatorName.charAt(0) : "C"}
</AvatarFallback>

                          </Avatar>
                        </Link>
                        <div className="flex flex-col">
                          <Link
                            href={`/creator/${video.creatorId || "unknown"}`}
                            className="text-sm font-medium hover:text-primary hover:underline"
                          >
                            {video.creatorName || "Unknown creator"}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {video.viewCount !== undefined && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatViewCount(video.viewCount)}
                              </span>
                            )}
                            {video.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(video.publishedAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-end border-t p-2">
                      <Button variant="ghost" size="sm" className="mr-auto h-8 px-2 text-xs text-primary" asChild>
                        <Link href={`/videos/${video.id}`}>Watch now</Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Bookmark className="h-4 w-4" />
                            <span>Save</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Load More Button */}
          {!loading && sortedVideos.length > 12 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

