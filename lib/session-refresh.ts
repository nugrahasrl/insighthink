"use client"

import { useSession } from "next-auth/react"

export function useSessionRefresh() {
  const { data: session, update } = useSession()

  // Function to refresh the session data
  const refreshSession = async () => {
    try {
      await update()
      console.log("Session refreshed")
    } catch (error) {
      console.error("Failed to refresh session:", error)
    }
  }

  return { session, refreshSession }
}

