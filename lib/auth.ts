import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        const client = await clientPromise;
        const db = client.db("insighthink");
        const user = await db
          .collection("Users")
          .findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }
        if (!user.passwordHash) {
          throw new Error("No password set for this user");
        }
        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }
        return {
          id: user._id.toString(),
          name:
            user.username ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          image: user.avatarUrl || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);