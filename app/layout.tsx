// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ClientProviders } from "@/components/ClientProviders";
import { SessionProviderWrapper } from "@/components/session-provider-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutWrapper } from "./LayoutWrapper";

export const metadata: Metadata = {
  title: "Insighthink",
  description: "A learning platform for self-taught learners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientProviders>
            <SessionProviderWrapper>
              <LayoutWrapper>{children}</LayoutWrapper>
            </SessionProviderWrapper>
            <Toaster />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
