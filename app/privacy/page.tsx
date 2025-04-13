import type { Metadata } from "next"
import PrivacyClientPage from "./PrivacyClientPage"

export const metadata: Metadata = {
  title: "Privacy Policy | InsightThink Learning",
  description: "Learn how Insighthink collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return <PrivacyClientPage />
}

