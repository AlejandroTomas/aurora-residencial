import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  turbopack: {},
  images: {
    unoptimized: true,
  },
  env: {
    ENV_NODE: process.env.ENV_NODE,
  },
};

export default nextConfig;
