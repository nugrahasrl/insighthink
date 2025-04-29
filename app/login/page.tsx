"use client";
import { Suspense } from "react"; // 👈️ 1. Import Suspense
import { LoginForm } from "../../components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {/* 👇️ 2. Tambahkan Suspense boundary */}
        <Suspense fallback={<div>Loading authentication...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
