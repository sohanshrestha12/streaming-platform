import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import client from "./mongodb";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
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
      if (!session.user.email) {
        session.user.username = null;
        return session;
      }
      session.user.username =
        typeof token.username === "string" ? token.username : null;

      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: AdapterUser | User }) {
      const email = user?.email || token.email;

      if (email) {
        const userFromDb = await client
          .db("Streaming")
          .collection("users")
          .findOne({ email });
        token.username = userFromDb ? userFromDb.username : null;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
