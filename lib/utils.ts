import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

export function convertGoogleDriveLink(fileId: string): string {
  if (!fileId) return "";
  // Check if the fileId is already a full URL
  if (fileId.startsWith('http')) {
    return fileId;
  }
  // If it's just the file ID, construct the direct download URL
  const googleDriveUrl = `https://drive.google.com/uc?export=view&id=${fileId}&authuser=0`;
  // Use a CORS proxy
  return `https://cors-anywhere.herokuapp.com/${googleDriveUrl}`;
}