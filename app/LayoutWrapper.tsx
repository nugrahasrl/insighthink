// app/LayoutWrapper.tsx
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageContainer } from "@/components/ui/PageContainer";

interface Props {
  children: ReactNode;
}

export function LayoutWrapper({ children }: Props) {
  const pathname = usePathname();
  const noSidebar = ["/", "/login", "/signup"];
  const showSidebar = !noSidebar.includes(pathname);

  return (
    <SidebarProvider>
      {showSidebar ? (
        <div className="flex min-h-screen bg-background text-foreground">
          <AppSidebar className="w-[240px] border-r" />
          <main className="flex-1 overflow-auto">
            {/* you can also wrap dashboard content in PageContainer if you like */}
            {children}
          </main>
        </div>
      ) : (
        // full-width pages (Hero / Auth)
        <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
          {/* PageContainer constrains width & centers horizontally, plus we center vertically via flex */}
          <PageContainer className="flex flex-col items-center justify-center min-h-screen">
            {children}
          </PageContainer>
        </main>
      )}
    </SidebarProvider>
  );
}
