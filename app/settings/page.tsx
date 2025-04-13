"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AppSidebar } from "../../components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CreditCard, Globe, Lock, Mail, Shield, User, Wallet } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { data: session, status, update } = useSession()

  // Inisialisasi formData dengan nilai default kosong
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    role: "Administrator",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  // Update state formData ketika session tersedia
  useEffect(() => {
    if (session?.user) {
      console.log("Session user data:", JSON.stringify(session.user, null, 2))
      setFormData({
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        username: session.user.username || "",
        role: session.user.role || "Administrator",
      })
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        // Force a session refresh to get the updated data
        const result = await res.json()
        console.log("Update successful:", result)

        // Force a complete session refresh
        window.location.reload()

        toast({
          title: "Good!",
          description: "You've successfully updated your profile.",
        })
        setOpen(false)
      } else {
        const error = await res.json()
        console.error("Update error:", error)
        toast({
          title: "Failed to update.",
          description: error.message || "Please try again.",
        })
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast({
        title: "Update failed.",
        description: "An error occurred while updating your profile.",
      })
    }
    setIsSubmitting(false)
  }

  // Jika session belum tersedia, tampilkan loading
  if (status === "loading") {
    return <div>Loading...</div>
  }

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
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-4 max-w-6xl mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                  <CardDescription>Update your personal details and profile information.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="font-medium">Name</div>
                    <div className="text-sm text-muted-foreground">{session.user.name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{session.user.email}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Username</div>
                    <div className="text-sm text-muted-foreground">{session.user.username || "No username set"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Role</div>
                    <div className="text-sm text-muted-foreground">{session.user.role || "Administrator"}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button>Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Edit your personal information below.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Username</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Role</label>
                          <input
                            type="text"
                            name="role"
                            value={formData.role || "Administrator"}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border p-2"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle>Email Preferences</CardTitle>
                  </div>
                  <CardDescription>Manage how we contact you via email.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="font-medium">Marketing emails</div>
                      <div className="text-sm text-muted-foreground">
                        Receive emails about new products, features, and more.
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">Security emails</div>
                      <div className="text-sm text-muted-foreground">Receive emails about your account security.</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle>Notification Preferences</CardTitle>
                  </div>
                  <CardDescription>Choose what notifications you receive and how.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive notifications on your device.</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive notifications via email.</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive notifications via SMS.</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">Browser Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive notifications in your browser.</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <CardTitle>Password</CardTitle>
                  </div>
                  <CardDescription>Update your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Current Status</div>
                    <div className="text-sm text-muted-foreground">Your password was last updated 3 months ago.</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Change Password</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </div>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Status</div>
                    <div className="text-sm text-muted-foreground">
                      Two-factor authentication is currently disabled.
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Enable 2FA</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle>Payment Methods</CardTitle>
                  </div>
                  <CardDescription>Manage your payment methods and billing information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-muted p-2">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">•••• •••• •••• 4242</div>
                          <div className="text-xs text-muted-foreground">Expires 12/24</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium">Default</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-0">
                  <Button>Add Payment Method</Button>
                  <Button variant="outline">View Billing History</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <CardTitle>Subscription</CardTitle>
                  </div>
                  <CardDescription>Manage your subscription plan and billing cycle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Pro Plan</div>
                        <div className="font-medium text-primary">$29/month</div>
                      </div>
                      <div className="text-sm text-muted-foreground">Your next billing date is April 1, 2025.</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Manage Subscription</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>Appearance</CardTitle>
                  </div>
                  <CardDescription>Customize how the application looks and feels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Theme</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-8 w-8 rounded-full bg-background border"></div>
                        <span className="text-xs">Light</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-8 w-8 rounded-full bg-zinc-950"></div>
                        <span className="text-xs">Dark</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-b from-background to-zinc-950"></div>
                        <span className="text-xs">System</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced settings for your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="font-medium">API Access</div>
                      <div className="text-sm text-muted-foreground">Manage your API keys and access tokens.</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">Data Export</div>
                      <div className="text-sm text-muted-foreground">Export all your data in various formats.</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-0">
                  <Button>Manage API Keys</Button>
                  <Button variant="outline">Export Data</Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader className="text-destructive">
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Delete Account</div>
                    <div className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data.
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure want delete your account?</DialogTitle>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="destructive">Yes</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="outline">No</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

