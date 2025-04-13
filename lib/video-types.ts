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
}

export interface VideoAPIResponse {
  videos: VideoData[];
  totalPages: number;
}
