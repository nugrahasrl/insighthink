import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  // Extract token using NextAuth's getToken helper
  const token = await getToken({ req: request, secret });
  
  console.log("Middleware executed for", request.nextUrl.pathname, "Token:", token);
  
  // If no token is found, redirect to sign-in page with callbackUrl
  if (!token) {
    const signInUrl = new URL("/auth/login", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*, /library/:path*"],
};
