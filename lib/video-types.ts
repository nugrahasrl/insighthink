// video-types.ts

export interface VideoData {
  id: string;
  title: string | string[];
  embedUrl: string | string[];
  publishedAt?: string; // ISO date string; used for sorting by "newest"
  viewCount?: number;
  duration?: number; // in seconds, used for formatting duration
  isNew?: boolean;   // optional flag for new videos
  creatorId?: string;
  creatorName: string | string[];
  creatorAvatarUrl?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  summary: string | string[];
  views?: number; // Added views property
  likes?: number; // Added likes property
}

export interface VideoAPIResponse {
  videos: VideoData[];
  totalPages: number;
  total: number; // Added total property
  page: number; // Added page property
  perPage: number; // Added perPage property
}
