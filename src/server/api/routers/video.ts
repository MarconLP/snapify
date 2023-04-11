import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const videoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.video.findMany();
  }),

  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.video.findFirst();
  }),
});
