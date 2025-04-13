import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { BookCover } from "@/components/BookCover" // A client component that handles image onError
import type { BookData } from "@/lib/book"
import { getBook } from "@/lib/books.server" // Server-side function to fetch a book
import { formatDate } from "@/lib/utils"
import { BookOpen, Calendar, Clock, Heart, Share2, ArrowLeft, BookX } from "lucide-react"

export default async function ReadBookPage({ params }: { params: { id: string } }) {
  // Fetch the book data server-side.
  const book: BookData | null = await getBook(params.id)

  if (!book) {
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
                    <BreadcrumbLink href="/library">Library</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Not Found</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto">
            <div className="bg-muted/30 rounded-full p-8 mb-6">
              <BookX className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Book Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the book you're looking for. It may have been removed or the link might be incorrect.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/library">
                <ArrowLeft className="h-4 w-4" />
                Back to Library
              </Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Use coverImageId if available; otherwise fallback to placeholder.
  const coverId = book.coverImageId || ""
  const imageUrl = coverId ? `/api/book-cover/${coverId}` : "/placeholder.svg?height=600&width=400"

  // Extract genres if available
  const genres = book.genres || [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4 z-10 bg">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/library" className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    Library
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{book.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book Cover Section */}
            <div className="lg:w-1/3 flex flex-col gap-4">
              <div className="bg-gradient-to-b from-muted/10 to-muted/30 rounded-2xl overflow-hidden shadow-lg p-4 lg:sticky lg:top-24">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md mx-auto max-w-xs">
                  <BookCover imageUrl={imageUrl} title={book.title} />
                </div>

                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  {genres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                  {genres.length === 0 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No genres specified
                    </Badge>
                  )}
                </div>


                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <Heart className="h-4 w-4" />
                    Favorite
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Book Details Section */}
            <div className="flex-1">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 leading-tight">{book.title}</h1>
                  <p className="text-xl text-muted-foreground">{book.author}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {book.createdAt && (
                    <Card className="bg-muted/20 border-none">
                      <CardContent className="p-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Added: {formatDate(book.createdAt)}</span>
                      </CardContent>
                    </Card>
                  )}

                  {book.pageCount && (
                    <Card className="bg-muted/20 border-none">
                      <CardContent className="p-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{book.pageCount} pages</span>
                      </CardContent>
                    </Card>
                  )}

                  {book.readingTime && (
                    <Card className="bg-muted/20 border-none">
                      <CardContent className="p-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{book.readingTime} min read</span>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">About this book</h2>
                  <div
                    className="prose dark:prose-invert prose-img:rounded-xl prose-headings:font-semibold prose-a:text-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: book.description }}
                  />
                </div>

                <Separator />

                <div className="pt-4">
                  <Button asChild size="lg" className="gap-2 shadow-sm">
                    <Link href={`/library/${book._id}/read`}>
                      <BookOpen className="h-5 w-5" />
                      Start Reading
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="ml-4 gap-2">
                    <Link href="/library">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Library
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

