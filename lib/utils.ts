import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Fungsi untuk mengubah HTML ke teks biasa
export function htmlToPlainText(html: string): string {
  if (!html) return ""
  // Hapus tag HTML
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

// Fungsi untuk mengubah objek EditorJS ke teks biasa
export function editorJsToPlainText(editorData: any): string {
  if (!editorData) return ""

  try {
    // Jika sudah string, kembalikan langsung
    if (typeof editorData === "string") {
      return htmlToPlainText(editorData)
    }

    // Jika objek EditorJS, ekstrak teks dari blok
    if (typeof editorData === "object") {
      // Jika ada blocks, proses setiap blok
      if (editorData.blocks && Array.isArray(editorData.blocks)) {
        return editorData.blocks
          .map((block: any) => {
            switch (block.type) {
              case "paragraph":
                return htmlToPlainText(block.data.text || "")
              case "header":
                return htmlToPlainText(block.data.text || "")
              case "list":
                return (block.data.items || []).map((item: string) => htmlToPlainText(item)).join("\n")
              case "quote":
                return htmlToPlainText(block.data.text || "")
              default:
                return ""
            }
          })
          .filter(Boolean)
          .join("\n\n")
      }

      // Jika format lain, coba JSON.stringify
      return JSON.stringify(editorData)
    }

    return ""
  } catch (e) {
    console.error("Error converting EditorJS to plain text:", e)
    return ""
  }
}
