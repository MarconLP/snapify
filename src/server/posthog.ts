import { PostHog } from "posthog-node";
import { env } from "~/env.mjs";

export const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: env.NEXT_PUBLIC_POSTHOG_HOST,
});
