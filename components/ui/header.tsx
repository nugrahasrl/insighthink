import React from "react"

interface HeaderProps {
  bookId: string
  title?: string
  author?: string
}

export function Header({ bookId, title, author }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">{title || "Book Title"}</h1>
        {author && <p className="text-sm text-gray-500">{author}</p>}
      </div>
      {/* Add any other header content here */}
    </header>
  )
}

