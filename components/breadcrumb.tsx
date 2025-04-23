import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
    active?: boolean;
    icon?: LucideIcon;
  }[];
  rightContent?: React.ReactNode;
}

export function Breadcrumb({ items, rightContent }: BreadcrumbProps) {
  return (
    <header className="flex h-16 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <UIBreadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
                <BreadcrumbItem
                  className={
                    index === 0 && !item.active ? "hidden md:block" : ""
                  }
                >
                  {item.href && !item.active ? (
                    <BreadcrumbLink
                      href={item.href}
                      className="flex items-center gap-1"
                    >
                      {item.icon && <item.icon className="h-3.5 w-3.5" />}
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="flex items-center gap-1 font-medium truncate max-w-[200px] md:max-w-[400px]">
                      {item.icon && <item.icon className="h-3.5 w-3.5" />}
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </UIBreadcrumb>
      </div>
      {rightContent && (
        <div className="flex items-center gap-2">{rightContent}</div>
      )}
    </header>
  );
}
