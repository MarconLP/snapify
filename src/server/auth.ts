import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { PostHog } from "posthog-node";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      stripeSubscriptionStatus: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    stripeSubscriptionStatus: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        stripeSubscriptionStatus: user.stripeSubscriptionStatus,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(!!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  events: {
    async signIn(message) {
      if (!!env.NEXT_PUBLIC_POSTHOG_KEY && !!env.NEXT_PUBLIC_POSTHOG_HOST) {
        const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
          host: env.NEXT_PUBLIC_POSTHOG_HOST,
        });

        client.capture({
          distinctId: message.user.id,
          event: "user logged in",
          properties: {
            provider: message.account?.provider,
            isNewUser: message.isNewUser,
          },
        });

        await client.shutdownAsync();
      }
    },
    async signOut(message) {
      if (!!env.NEXT_PUBLIC_POSTHOG_KEY && !!env.NEXT_PUBLIC_POSTHOG_HOST) {
        const session = message.session as unknown as {
          id: string;
          sessionToken: string;
          userId: string;
          expires: Date;
        };
        if (!session?.userId) return;

        const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
          host: env.NEXT_PUBLIC_POSTHOG_HOST,
        });

        client.capture({
          distinctId: session.userId,
          event: "user logged out",
        });

        await client.shutdownAsync();
      }
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
