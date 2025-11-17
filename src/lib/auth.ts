// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismadb from "@/lib/prismadb";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prismadb),

  session: { strategy: "jwt" },

  // ⬅️ IMPORTANT: your file is app/(auth)/auth/sign-in/page.tsx
  // So the URL is /auth/sign-in (the (auth) group does NOT appear in the URL)
  pages: {
    signIn: "/auth/sign-in",
    // you can later add:
    // error: "/auth/sign-in",
  },

  providers: [
    // --- Google OAuth ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // --- Credentials (email/password) ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const existingUser = await prismadb.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser || !existingUser.password) return null;

        const isValid = await compare(credentials.password, existingUser.password);

        if (!isValid) return null;

        return {
          id: String(existingUser.id),
          email: existingUser.email ?? "",
          // 👇 ensure it's never null
          username: existingUser.username ?? "",
          role: existingUser.role,
        } as any; // <-- let NextAuth accept it without type whining
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username as string | undefined,
          role: token.role as string | undefined,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};
