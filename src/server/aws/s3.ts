import { S3 } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

// Isn't it better code? where is the right place to write?
function toBoolean(booleanStr: string): boolean {
    return booleanStr.toLowerCase() === "true";
}

export const s3 = new S3({
  endpoint: env.AWS_ENDPOINT,
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  // A necessary option when using Minio. false is the default behavior.
  // If false, the domain will be changed to [bucket name].example.com. 
  // If true, appends the bucket to the path, like example.com/[bucket name].
  "forcePathStyle": toBoolean(env.AWS_FORCE_PATH_STYLE),
});
