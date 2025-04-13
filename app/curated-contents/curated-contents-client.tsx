"use client";

import Link from "next/link";

interface CuratedContentsClientProps {
  item: {
    id: string;
    type: 'articles' | 'videos';
    title: string;
    description: string;
    source: string;
    link: string;
    readTime: string;
    likes: number;
    duration?: string;
    views?: number;
    content: string;
  };
}

export default function CuratedContentsClient({ item }: CuratedContentsClientProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-semibold">{item.title}</h2>
      <p className="text-gray-500 mt-2">{item.description}</p>
      <p className="text-sm text-gray-400 mt-2">Read Time: {item.readTime}</p>
      <div className="mt-4">
        <Link href={`/article/${item.id}`} className="px-4 py-2 rounded">
          Read Article
        </Link>
      </div>
    </div>
  );
}