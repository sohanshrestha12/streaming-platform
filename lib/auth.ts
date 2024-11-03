import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.username =
        typeof token.username === "string" ? token.username : null;

      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: AdapterUser | User }) {
      const email = user?.email || token.email;

      if (email) {
        const userFromDb = await prisma.user.findUnique({where:{email}});
        token.username = userFromDb ? userFromDb.username : null;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
