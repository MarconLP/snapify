import { PostHog } from "posthog-node";
import { env } from "~/env.mjs";

export const posthog =
  !!env.NEXT_PUBLIC_POSTHOG_KEY && !!env.NEXT_PUBLIC_POSTHOG_HOST
    ? new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
        host: env.NEXT_PUBLIC_POSTHOG_HOST,
      })
    : null;
