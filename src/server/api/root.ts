import { createTRPCRouter } from "~/server/api/trpc";
import { videoRouter } from "~/server/api/routers/video";
import { stripeRouter } from "~/server/api/routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  video: videoRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
