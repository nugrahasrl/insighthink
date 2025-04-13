import type { Metadata } from "next"
import SupportPage from "@/components/support-page"

export const metadata: Metadata = {
  title: "Support | Help Center",
  description: "Get help with our application and find answers to your questions",
}

export default function Support() {
  return <SupportPage />
}

