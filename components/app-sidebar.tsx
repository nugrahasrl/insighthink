"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  UsersRound,
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Custom hook to load user data from localStorage
function useUser() {
  const [user, setUser] = useState({
    name: "", // default fallback name
    email: "",
    avatar: "/avatar/shadcn.jpg",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Merge the parsed user data with defaults for any missing properties
          setUser({
            name: parsedUser.name || "User",
            email: parsedUser.email || "",
            avatar: parsedUser.avatar || "/avatar/shadcn.jpg",
          });
          console.log("Loaded user:", parsedUser); // For debugging
        } catch (err) {
          console.error("Failed to parse stored user:", err);
        }
      }
    }
  }, []);

  return user;
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  // Static navigation data remains unchanged.
  const navMain = [
    {
      title: "Menu",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Library", url: "/library" },
        { title: "Articles", url: "/article" },
        { title: "Videos", url: "/videos" },
      ],
    },
    {
      title: "Community",
      url: "/community",
      icon: UsersRound,
      items: [
        { title: "Create Grup", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [{ title: "General", url: "/settings" }],
    },
  ];

  const navSecondary = [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
                  <div className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Insighthink</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-4" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
