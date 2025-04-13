"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, BookmarkPlus, Star } from "lucide-react"
import type { BookData } from "@/lib/book"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LibraryContentProps {
  initialBooks: BookData[]
  initialTotalPages: number
}

export function LibraryContent({ initialBooks }: LibraryContentProps) {
  const [books] = useState<BookData[]>(initialBooks)
  const [view, setView] = useState<string>("grid")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Sort books based on selected option
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "author":
        return a.author.localeCompare(b.author)
      case "newest":
        return new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime()
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted p-6 rounded-lg max-w-md">
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="grid" value={view} onValueChange={setView} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedBooks.map((book) => (
            <Card key={book._id} className="overflow-hidden flex flex-col h-full">
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                {book.coverImageId ? (
                  <img
                    src={book.coverImageId || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                    No Cover
                  </div>
                )}
                {book.rating && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {book.rating.toFixed(1)}
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base line-clamp-1">{book.title}</CardTitle>
                <CardDescription className="line-clamp-1">{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 pb-2 flex-grow">
                <div className="flex flex-wrap gap-1 mt-1">
                  {(Array.isArray(book.genres)
                    ? book.genres
                    : book.genres
                    ? [book.genres]
                    : []
                  )
                    .slice(0, 2)
                    .map((genre: string) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2 flex justify-between">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="secondary" size="sm">
                  <BookmarkPlus className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        <div className="space-y-3">
          {sortedBooks.map((book) => (
            <Card key={book._id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-[120px] aspect-[2/3] sm:aspect-auto overflow-hidden bg-muted">
                  {book.coverImageId ? (
                    <img
                      src={book.coverImageId || "/placeholder.svg"}
                      alt={`Cover of ${book.title}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                      No Cover
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    {book.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {book.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm line-clamp-2 mt-2 text-muted-foreground">
                    {book.description || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(Array.isArray(book.genres)
                      ? book.genres
                      : book.genres
                      ? [book.genres]
                      : []
                    )
                      .slice(0, 3)
                      .map((genre: string) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="secondary" size="sm">
                      <BookmarkPlus className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </div>
  )
}
