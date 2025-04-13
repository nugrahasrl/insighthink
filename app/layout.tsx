import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClientProviders } from "@/components/ClientProviders";
import { SessionProviderWrapper } from "@/components/session-provider-wrapper";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Insighthink",
  description: "Created with v0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <SessionProviderWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </SessionProviderWrapper>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
