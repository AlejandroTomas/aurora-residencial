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
  experimental: {
    // Subida de archivos por Server Action (adjuntos de comunicados, logo). El límite
    // de tamaño real se valida además en `core/storage` antes de subir.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
