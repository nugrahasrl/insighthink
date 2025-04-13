// app/upload/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadPageProps {
  bookId: string; // ID of the book you want to update
}

export default function UploadPage({ bookId }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Update the book document with the cover image ID.
        // This is where your pseudo-code goes:
        // For example, you might call your update endpoint:
        await fetch(`/api/books/${bookId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coverImageId: data.fileId }),
        });
        setUploadMessage("Upload successful: " + data.fileId);
        // Redirect to the book editing page (or elsewhere) if needed.
        router.push(`/library/${bookId}`);
      } else {
        setUploadMessage("Upload failed: " + data.error);
      }
    } catch (error: any) {
      setUploadMessage("Upload error: " + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Book Cover</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <Input type="file" name="file" onChange={handleFileChange} />
        <Button type="submit">Upload</Button>
      </form>
      {uploadMessage && <p className="mt-4">{uploadMessage}</p>}
    </div>
  );
}
