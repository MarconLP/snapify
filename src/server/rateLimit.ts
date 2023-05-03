import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "~/env.mjs";

export const rateLimit =
  !!env.UPSTASH_REDIS_REST_URL && !!env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(60, "60 s"),
      })
    : null;
