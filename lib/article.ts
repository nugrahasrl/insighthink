// lib/article.ts
export interface ArticleData {
  _id: string;
  title: string;
  description: string;
  content: string;
  author?: string;
  source: string;
  excerpt?: string; // Optional excerpt field
  references?: string[];
}
