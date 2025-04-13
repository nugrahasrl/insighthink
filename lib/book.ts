export interface BookData {
  _id: string
  title: string
  description: string
  author: string
  content: string
  createdAt: string
  updatedAt?: string
  readingTime: number
  coverImageUrl?: string // URL to the cover image

  // Basic metadata
  rating?: number
  genres?: string[]
  publishedDate?: string
  language?: string
  isbn?: string
  pageCount?: number

  // Reading experience
  readingProgress?: {
    currentPage: number
    totalPages: number
    lastReadAt: string
    completionPercentage: number
  }

  bookmarks?: {
    id: string
    page: number
    position: number
    createdAt: string
    note?: string
  }[]

  // Content structure
  chapters: {
    id: string
    title: string
    content: string
    order: number
    sections?: {
      id: string
      title: string
      content: string
      order: number
    }[]
  }[]

  // Educational content
  keyTerms: {
    id: string
    term: string
    definition: string
    chapter?: string // Reference to chapter ID where term appears
    importance?: "low" | "medium" | "high"
  }[]

  // User interaction
  notes?: {
    id: string
    content: string
    page: number
    position: number
    createdAt: string
    updatedAt?: string
    color?: string
  }[]

  highlights?: {
    id: string
    text: string
    page: number
    position: number
    color: string
    createdAt: string
  }[]

  // Media
  coverImageId?: string // Stores the GridFS file ID for the cover image
  audioVersion?: {
    id: string
    duration: number
    format: string
  }

  // Additional metadata
  publisher?: string
  series?: {
    name: string
    position: number
  }

  // Reading settings (user preferences could be stored separately)
  defaultSettings?: {
    fontSize: number
    fontFamily: string
    lineSpacing: number
    theme: "light" | "dark" | "sepia"
  }
}

// Reading position interface for more precise tracking
export interface ReadingPosition {
  bookId: string
  chapterId: string
  page: number
  scroll: number
  timestamp: string
}

// User reading statistics
export interface ReadingStats {
  bookId: string
  timeSpent: number // in seconds
  pagesRead: number
  sessionsCount: number
  lastSession: string
  averageReadingSpeed: number // words per minute
  completionPercentage: number
}

