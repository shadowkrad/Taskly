import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Attiva output standalone per container Docker, lasciando a Vercel la gestione serverless nativa
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,
};

export default nextConfig;
