import { AppSidebar } from "../../../components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function AccountSettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Account Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          <form className="max-w-2xl space-y-6 bg-white p-6 shadow rounded-lg">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            {/* Email Address Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="w-full"
              />
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/settings">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
