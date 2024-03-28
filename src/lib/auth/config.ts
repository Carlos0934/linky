import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import db from "../db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Adapter } from "next-auth/adapters";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.AUTH_SECRET!,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session.user.email) return session;

      const results = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(eq(users.email, session.user.email));

      if (results.length === 0) return session;

      session.user.id = results[0].id;

      return session;
    },
  },
};
