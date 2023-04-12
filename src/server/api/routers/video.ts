import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";

export const videoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const videos = await ctx.prisma.video.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return videos;
  }),
  get: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const video = await ctx.prisma.video.findUnique({
        where: {
          id: input.videoId,
        },
      });

      if (video?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return video;
    }),
  getUploadUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const { s3 } = ctx;

      const video = await ctx.prisma.video.create({
        data: {
          userId: ctx.session.user.id,
          title: key,
          video_url: "bla",
        },
      });

      console.log(video.id);

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: ctx.session.user.id + "/" + video.id,
      });

      const signedUrl = await getSignedUrl(s3, putObjectCommand);

      return signedUrl;
    }),
});
