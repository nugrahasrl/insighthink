import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";

type MyUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }
          const client = await clientPromise;
          const db = client.db("insighthink");
          const mongoUser = await db.collection("Users").findOne({ email: credentials.email });
          if (
            !mongoUser ||
            !mongoUser.passwordHash ||
            !(await compare(credentials.password, mongoUser.passwordHash))
          ) {
            throw new Error("Invalid email or password");
          }
          const user: MyUser = {
            id: mongoUser._id.toString(),
            name:
              mongoUser.username ||
              `${mongoUser.firstName || ""} ${mongoUser.lastName || ""}`.trim(),
            email: mongoUser.email,
            image: mongoUser.avatarUrl || null,
          };
          return user;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  // Disable encryption for JWTs in development
  // jwt: { encryption: false } as any,
  // callbacks: {
  //   async jwt({ token, user }: { token: JWT; user?: MyUser }) {
  //     if (user) {
  //       token.sub = user.id;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }: { session: any; token: JWT }) {
  //     if (session.user && token.sub) {
  //       session.user.id = token.sub;
  //     }
  //     return session;
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET || "default_secret_which_is_long_enough",
  pages: {
    // Update this path to match an existing sign-in page route.
    signIn: "/dashboard", 
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
