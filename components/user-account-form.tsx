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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UserData {
  _id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string;
  passwordHash?: string;
}

export function UserAccountForm() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password update state:
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch user data on mount.
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch("/api/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return;
    const { name, value } = e.target;
    setUserData((prevData) => (prevData ? { ...prevData, [name]: value } : prevData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    // If any password field is filled, validate password update.
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
      // Append new password update data.
      (userData as any).currentPassword = currentPassword;
      (userData as any).newPassword = newPassword;
    }

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        throw new Error("Failed to update user data");
      }
      const updatedUser = await res.json();
      setUserData(updatedUser);
      setSuccess("User data updated successfully");
      // Clear password fields after successful update.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error && !userData) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent>
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userData?.avatarUrl || "https://github.com/shadcn.png"}
                  alt={userData?.username}
                />
                <AvatarFallback>
                  {userData?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatarUrl" className="block text-sm font-medium text-muted-foreground">
                  Avatar URL
                </Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  value={userData?.avatarUrl || ""}
                  onChange={handleInputChange}
                  className="mt-1 w-full sm:w-80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-muted-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={userData?.username || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData?.email || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={userData?.firstName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={userData?.lastName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                  Password
                </Label>
                {/* Displaying the existing password hash is not secure. Instead, we handle password changes in a separate section. */}
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userData?.passwordHash || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                  readOnly
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold">Update Password</h2>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="currentPassword" className="block text-sm font-medium">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="block text-sm font-medium">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-3">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    className="mb-4"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            {error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
