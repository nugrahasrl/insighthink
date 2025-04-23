import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ClientProviders } from "@/components/ClientProviders";
import { SessionProviderWrapper } from "@/components/session-provider-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
      <body className="min-h-screen bg-background">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <ClientProviders>
              <SessionProviderWrapper>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                >
                  {children}
                </ThemeProvider>
              </SessionProviderWrapper>
              <Toaster />
            </ClientProviders>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
