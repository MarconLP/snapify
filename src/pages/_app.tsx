import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import CrispChat from "~/components/CrispChat";
import posthog from "posthog-js";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import { env } from "~/env.mjs";
import { type ReactNode, useEffect } from "react";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (
  typeof window !== "undefined" &&
  !!env.NEXT_PUBLIC_POSTHOG_KEY &&
  !!env.NEXT_PUBLIC_POSTHOG_PROXY_HOST
) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_PROXY_HOST,
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <PostHogProvider client={posthog}>
        <PostHogIdentificationWrapper>
          <Component {...pageProps} />
        </PostHogIdentificationWrapper>
        <CrispChat />
      </PostHogProvider>
    </SessionProvider>
  );
};

const PostHogIdentificationWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session, status } = useSession();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog?.__loaded) return;
    if (status === "authenticated") {
      const { id, name, email, stripeSubscriptionStatus } = session?.user;
      posthog?.identify(id, {
        name,
        email,
        stripeSubscriptionStatus,
      });
    }
  }, [posthog, session, status]);

  return <div>{children}</div>;
};

export default api.withTRPC(MyApp);
