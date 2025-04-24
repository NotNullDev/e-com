import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  account,
  session,
  user,
  verificationToken,
} from "../../../../common/db/schema";
import { db } from "../../../db/db";
// Prisma adapter for NextAuth, optional and can be removed

// @ts-ignore
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
      // console.log("new user!", user.id);
    },
    updateUser(message) {
      // console.log("user updated!", message);
    },
    session(message) {
      // console.log("session!", message);
    },
    linkAccount(message) {
      // console.log("accounted linked! ", message);
    },
    signIn(message) {
      // console.log("new user! ", message);
    },
  },
  // Configure one or more authentication providers
  // @ts-ignore
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
