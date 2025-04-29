import type React from "react";
import type { Metadata } from "next";
import ClientRootLayout from "./ClientRootLayout";

export const metadata: Metadata = {
  title: "Insighthink",
  description: "A learning platform for self taught learners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientRootLayout>{children}</ClientRootLayout>
    </html>
  );
}
