import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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
  get: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { s3 } = ctx;
      const video = await ctx.prisma.video.findUnique({
        where: {
          id: input.videoId,
        },
        include: {
          user: true,
        },
      });
      if (!video) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (video.userId !== ctx?.session?.user.id && !video.sharing) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: video.userId + "/" + video.id,
      });

      const signedUrl = await getSignedUrl(s3, getObjectCommand);

      video.video_url = signedUrl;

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

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: ctx.session.user.id + "/" + video.id,
      });

      const signedUrl = await getSignedUrl(s3, putObjectCommand);

      return {
        success: true,
        id: video.id,
        signedUrl,
      };
    }),
  setSharing: protectedProcedure
    .input(z.object({ videoId: z.string(), sharing: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const updateVideo = await ctx.prisma.video.updateMany({
        where: {
          id: input.videoId,
          userId: ctx.session.user.id,
        },
        data: {
          sharing: input.sharing,
        },
      });

      return {
        success: true,
        updateVideo,
      };
    }),
});
