"use client";

import { useState } from "react";

export function ImageUploader({ onImageChange }: { onImageChange: (file: File | null) => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClearFile = () => {
    onImageChange(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover" />
          <button onClick={handleClearFile} className="text-white bg-red-500 p-2 rounded mt-2">
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}
