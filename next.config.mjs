/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
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
};

export default nextConfig;
