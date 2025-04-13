"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface UserData {
  _id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string;
  passwordHash?: string;
}

export default function UserAccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch("/api/user", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Handle changes for input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (currentPassword || newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError("New passwords don't match");
        setSaving(false);
        return;
      }
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long");
        setSaving(false);
        return;
      }
      // Append password fields to payload if filled.
      (userData as any).currentPassword = currentPassword;
      (userData as any).newPassword = newPassword;
    }

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Failed to update user data");
      const updatedUser = await res.json();
      setUserData(updatedUser);
      setSuccess("User data updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error && !userData) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Breadcrumb Navigation */}
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Account</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="p-6">
          <Card className="rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle>User Account</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <CardContent>
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={userData?.avatarUrl || "https://github.com/shadcn.png"}
                      alt={userData?.username}
                    />
                    <AvatarFallback>
  {userData?.username ? userData.username.slice(0, 2).toUpperCase() : "??"}
</AvatarFallback>

                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      value={userData?.avatarUrl || ""}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* User Info Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input
                      name="username"
                      value={userData?.username || ""}
                      onChange={handleInputChange}
                      required
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" value={userData?.email || ""} readOnly />
                  </div>
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      value={userData?.firstName || ""}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      value={userData?.lastName || ""}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Password Change Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>
              </CardContent>

              {/* Error & Success Alerts */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
