/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import { env } from "./src/env.mjs";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [],
  },

  async rewrites() {
    return [
      ...(!!env.POSTHOG_PROXY_PATH && !!env.NEXT_PUBLIC_POSTHOG_HOST ? [{
        source: "/" + env.POSTHOG_PROXY_PATH +  "/:path*",
        destination: env.NEXT_PUBLIC_POSTHOG_HOST + "/:path*",
      }]: []),
    ];
  },

  output: "standalone",
};
export default config;
