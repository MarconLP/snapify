import { S3 } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

export const s3 = new S3({
  endpoint: env.AWS_ENDPOINT,
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
