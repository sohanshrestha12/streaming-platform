import NextAuth, { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from 'next-auth/providers/google';
import client from './mongodb';


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
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.idToken = account.id_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions)