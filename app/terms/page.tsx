import type { Metadata } from "next"
import TermsClientPage from "./TermsClientPage"

export const metadata: Metadata = {
  title: "Terms and Conditions | InsightThink Learning",
  description: "Terms and conditions for using InsightThink Learning platform.",
}

export default function TermsPage() {
  return <TermsClientPage />
}

