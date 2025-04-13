"use client"

import { SessionProvider } from "next-auth/react"

export function SessionProviderWrapper({ children }) {
  return <SessionProvider refetchInterval={5}>{children}</SessionProvider>
}

