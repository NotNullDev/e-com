// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "source.unsplash.com",
      "loremflickr.com",
      "storage.cloud.google.com",
    ],
    unoptimized: true,
  },
};
export default config;
