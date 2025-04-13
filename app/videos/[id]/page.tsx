"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
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
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft,
  ThumbsUp,
  Share2,
  Bookmark,
  Eye,
  Calendar,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

import type { VideoData } from "@/lib/video-types"

// Sample related videos
const relatedVideos = [
  {
    id: "rel1",
    title: "Getting Started with React Hooks",
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
    creatorName: "React Masters",
    creatorAvatarUrl: "/placeholder.svg?height=32&width=32",
    viewCount: 45000,
    duration: 720,
  },
  {
    id: "rel2",
    title: "Building a Full-Stack App with Next.js 14",
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
    creatorName: "Next.js Official",
    creatorAvatarUrl: "/placeholder.svg?height=32&width=32",
    viewCount: 32000,
    duration: 1500,
  },
  {
    id: "rel3",
    title: "Mastering Tailwind CSS: Advanced Techniques",
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
    creatorName: "CSS Wizards",
    creatorAvatarUrl: "/placeholder.svg?height=32&width=32",
    viewCount: 28500,
    duration: 900,
  },
]

// Sample comments
const sampleComments = [
  {
    id: "c1",
    author: "Jane Cooper",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    content:
      "This video was incredibly helpful! I've been struggling with this concept for weeks and you explained it so clearly.",
    timestamp: "2 days ago",
    likes: 24,
  },
  {
    id: "c2",
    author: "Alex Morgan",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    content: "Great content as always. Would love to see a follow-up video on advanced techniques!",
    timestamp: "1 week ago",
    likes: 18,
  },
  {
    id: "c3",
    author: "Sam Wilson",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    content: "I have a question about the implementation at 12:45. Would this work with TypeScript as well?",
    timestamp: "3 days ago",
    likes: 7,
  },
]

export default function VideoDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) {
      setError("Video ID is missing")
      setLoading(false)
      return
    }

    async function fetchVideo() {
      try {
        setLoading(true)
        // Force fresh fetch to get latest data
        const res = await fetch(`/api/videos/${id}`, { cache: "no-store" })
        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`Failed to fetch video data: ${errText}`)
        }
        const data: VideoData = await res.json()
        setVideoData(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [id])

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

  // Format time for video player
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle video playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle video mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle share functionality
  const handleShare = () => {
    setIsShareDialogOpen(true)
  }

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Video link copied to clipboard",
        })
        setIsShareDialogOpen(false)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Failed to copy",
          description: "Could not copy link to clipboard",
          variant: "destructive",
        })
      })
  }

  // Handle save functionality
  const handleSave = () => {
    // In a real app, this would save to user's playlists or favorites
    const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]")

    // Check if already saved
    const isAlreadySaved = savedVideos.some((v: any) => v.id === id)

    if (!isAlreadySaved) {
      savedVideos.push({
        id: id,
        title: videoTitle,
        thumbnailUrl: videoData.thumbnailUrl,
        savedAt: new Date().toISOString(),
      })
      localStorage.setItem("savedVideos", JSON.stringify(savedVideos))
      toast({
        title: "Video saved",
        description: "Video added to your collection",
      })
    } else {
      toast({
        title: "Already saved",
        description: "This video is already in your collection",
        variant: "destructive",
      })
    }
  }

  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 items-center gap-2 border-b px-4 py-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/videos">Videos</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <Skeleton className="h-4 w-32" />
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Loading Skeleton */}
          <div className="container mx-auto max-w-6xl p-4">
            <Skeleton className="mb-4 h-9 w-24" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="mt-4 h-8 w-3/4" />
                <div className="mt-4 flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="mt-6 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-20 w-36 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 border-b px-4 py-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/videos">Videos</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Error</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="container mx-auto flex max-w-6xl flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Error Loading Video</h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button asChild>
              <Link href="/videos">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Videos
              </Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!videoData) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 border-b px-4 py-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/videos">Videos</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Not Found</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="container mx-auto flex max-w-6xl flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Video Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              The video you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/videos">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Browse Videos
              </Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const videoTitle = Array.isArray(videoData.title) ? videoData.title[0] : videoData.title

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center gap-2 border-b px-4 py-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/videos">Videos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[500px]">
                    {videoTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto max-w-6xl p-4">
          <Button asChild variant="ghost" className="mb-4 w-fit">
            <Link href="/videos">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Videos
            </Link>
          </Button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="relative mb-4 overflow-hidden rounded-lg bg-black">
                {videoData.embedUrl ? (
                  <iframe className="aspect-video w-full" src={videoData.embedUrl} title={videoTitle} allowFullScreen />
                ) : (
                  <div className="relative aspect-video w-full">
                    <video
                      ref={videoRef}
                      className="h-full w-full"
                      poster={videoData.thumbnailUrl || "/placeholder.svg?height=480&width=854"}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onClick={togglePlay}
                    >
                      <source
                        src={
                          videoData.videoUrl ||
                          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        }
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>

                    {/* Custom Video Controls */}
                    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 transition-opacity hover:opacity-100">
                      {/* Video Title Overlay */}
                      <div className="p-4">
                        <h2 className="text-lg font-medium text-white">{videoTitle}</h2>
                      </div>

                      {/* Play/Pause Button Overlay */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-16 w-16 rounded-full bg-black/30 text-white hover:bg-black/50"
                          onClick={togglePlay}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                      </div>

                      {/* Video Controls */}
                      <div className="flex flex-col gap-2 p-4">
                        {/* Progress Bar */}
                        <div className="flex w-full items-center gap-2">
                          <span className="text-xs font-medium text-white">{formatTime(currentTime)}</span>
                          <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                          />
                          <span className="text-xs font-medium text-white">{formatTime(duration)}</span>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/20"
                              onClick={togglePlay}
                            >
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                              <SkipForward className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/20"
                              onClick={toggleMute}
                            >
                              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                              <Maximize className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="mb-6">
                <h1 className="mb-2 text-2xl font-bold">{videoTitle}</h1>

                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {videoData.viewCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{formatViewCount(videoData.viewCount)}</span>
                    </div>
                  )}

                  {videoData.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(videoData.publishedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {videoData.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(videoData.duration)}</span>
                    </div>
                  )}

                  {videoData.category && (
                    <Badge variant="secondary" className="ml-auto">
                      {videoData.category}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{videoData.likes || 0}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Like this video</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share this video</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1" onClick={handleSave}>
                          <Bookmark className="h-4 w-4" />
                          <span>Save</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save to playlist</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Creator Info */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage
                        src={videoData.creatorAvatarUrl || "/placeholder-avatar.jpg"}
                        alt={videoData.creatorName || "Creator"}
                      />
                      <AvatarFallback>{(videoData.creatorName || "C").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{videoData.creatorName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {videoData.creatorSubscribers
                          ? formatViewCount(videoData.creatorSubscribers) + " subscribers"
                          : "Creator"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Description */}
                <div className="mb-6 rounded-lg border p-4">
                  <Tabs defaultValue="description">
                    <TabsList className="mb-4 grid w-full grid-cols-2">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="comments">
                        Comments
                        <Badge variant="secondary" className="ml-2">
                          {sampleComments.length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="space-y-4">
                      {videoData.summary ? (
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html:
                              typeof videoData.summary === "string" && videoData.summary !== ""
                                ? videoData.summary
                                : "<p>No description available.</p>",
                          }}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">No description available.</p>
                      )}

                      {videoData.tags && videoData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                          {videoData.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="comments">
                      <div className="space-y-4">
                        {sampleComments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={comment.avatarUrl} alt={comment.author} />
                              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{comment.author}</h4>
                                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                              </div>
                              <p className="mt-1 text-sm">{comment.content}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-7 gap-1 px-2">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span className="text-xs">{comment.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button variant="outline" className="mt-2 w-full">
                          Show More Comments
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Related Videos</h3>

              <div className="space-y-4">
                {relatedVideos.map((video) => (
                  <Link href={`/videos/${video.id}`} key={video.id}>
                    <Card className="overflow-hidden transition-all hover:bg-muted/50">
                      <CardContent className="flex gap-3 p-3">
                        <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={video.thumbnailUrl || "/placeholder.svg"}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-xs font-medium text-white">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="line-clamp-2 text-sm font-medium">{video.title}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">{video.creatorName}</p>
                          <p className="mt-auto text-xs text-muted-foreground">{formatViewCount(video.viewCount)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                Show More
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Share Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Video</DialogTitle>
              <DialogDescription>Share this video with your friends and colleagues</DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 py-4">
              <div className="grid flex-1 gap-2">
                <Input
                  id="link"
                  defaultValue={typeof window !== "undefined" ? window.location.href : ""}
                  readOnly
                  className="w-full"
                />
              </div>
              <Button size="sm" onClick={handleCopyLink}>
                Copy
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
                Facebook
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
                Twitter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-.1.248-.015-.709-.52-1.248-1.342-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
                LinkedIn
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                WhatsApp
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogDescription>
                Social sharing links would connect to actual services in a production environment
              </DialogDescription>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}

