/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Força output estático para SSG
  output: "export" === process.env.BUILD_STANDALONE ? "standalone" : undefined,
  
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "@tabler/icons-react"],
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
    // Otimizações de imagem
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
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
      // Security headers
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  
  // Configurações de build para otimização
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  
  // Otimizações de bundle
  modularizeImports: {
    "@tabler/icons-react": {
      transform: "@tabler/icons-react/dist/esm/icons/{{member}}",
    },
  },
  
  // Configurações de produção
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
