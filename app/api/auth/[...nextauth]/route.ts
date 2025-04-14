import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import { compare } from "bcryptjs"
import type { JWT } from "next-auth/jwt";

type MyUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  role?: string | null;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("insighthink");
        // Look up the user by email
        const mongoUser = await db.collection("Users").findOne({ email: credentials.email });
        // Validate password using bcrypt comparison
        if (
          !mongoUser ||
          !mongoUser.passwordHash ||
          !(await compare(credentials.password, mongoUser.passwordHash))
        ) {
          throw new Error("Invalid email or password");
        }
        // Construct and return a user object
        const user: MyUser = {
          id: mongoUser._id.toString(),
          name:
            mongoUser.name ||
            `${mongoUser.firstName || ""} ${mongoUser.lastName || ""}`.trim(),
          email: mongoUser.email,
          image: mongoUser.avatarUrl || null,
          username: mongoUser.username || null,
          role: mongoUser.role || null,
        };
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: MyUser }) {
      if (user) {
        token.sub = user.id;
        token.username = user.username || null;
        token.role = user.role || null;
        console.log("JWT token after user login:", JSON.stringify(token, null, 2));
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        
        // Explicitly add these properties from the token
        session.user.username = token.username || null;
        session.user.role = token.role || null;
        
        console.log("Session after modification:", JSON.stringify(session, null, 2));
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "default_secret_which_is_long_enough",
  pages: {
    signIn: "/auth/signin", // Ensure this matches your sign in page route.
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/", // Allow the session cookie across the app.
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

