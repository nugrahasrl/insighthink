"use client";

import type React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClientProviders } from "@/components/ClientProviders";
import { SessionProviderWrapper } from "@/components/session-provider-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Daftar rute yang tidak memerlukan sidebar
  const noSidebarRoutes = ["/", "/login", "/signup"];

  // Cek apakah rute saat ini termasuk dalam daftar rute tanpa sidebar
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <body className="min-h-screen bg-background">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ClientProviders>
          <SessionProviderWrapper>
            {shouldShowSidebar ? (
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-background">
                  {children}
                </SidebarInset>
              </SidebarProvider>
            ) : (
              // Render children tanpa sidebar untuk rute tertentu
              children
            )}
          </SessionProviderWrapper>
          <Toaster />
        </ClientProviders>
      </ThemeProvider>
    </body>
  );
}
