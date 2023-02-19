import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed

import {prisma} from "../../../../server/config/prisma";
import {env} from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      console.log("new user!", user.id);
    },
    updateUser(message) {
      console.log("user updated!", message);
    },
    session(message) {
      console.log("session!", message);
    },
    linkAccount(message) {
      console.log("accounted linked! ", message);
    },
    signIn(message) {
      console.log("new user! ", message);
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
