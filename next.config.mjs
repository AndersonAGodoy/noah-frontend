/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        search: "",
      },
    ],
  },
  // Configuração para ISR (Incremental Static Regeneration)
  async headers() {
    return [
      {
        source: "/sermons/sermon/:id*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800", // 7 dias cache + 7 dias revalidação em background
          },
        ],
      },
      {
        source: "/((?!sermons/sermon).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400", // 1 hora + 1 dia para outras páginas
          },
        ],
      },
    ];
  },
  // Configurações de build para otimização
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
