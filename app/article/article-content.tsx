import Link from "next/link"
import type { ArticleData } from "@/lib/article"
import { Card, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ArticleContentProps {
  initialArticles: ArticleData[]
}

export function ArticleContent({ initialArticles }: ArticleContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialArticles.map((article) => (
        <Card
          key={article._id}
          className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20"
        >
          <CardContent className="flex-grow p-6 pt-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-semibold leading-tight">{article.title}</CardTitle>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs font-normal">
                {article.source}
              </Badge>
              {article.author && (
                <p className="text-xs text-muted-foreground">
                  by <span className="font-medium">{article.author}</span>
                </p>
              )}
            </div>

            {article.excerpt && (
              <CardDescription className="line-clamp-3 text-sm text-muted-foreground mb-4">
                {article.excerpt}
              </CardDescription>
            )}
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-0">
            <Button asChild className="w-full gap-2 group">
              <Link href={`/article/${article._id}`}>
                <BookOpen className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                Read Article
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}

      {initialArticles.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No articles found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            There are currently no articles available. Please check back later or try a different search.
          </p>
        </div>
      )}
    </div>
  )
}

