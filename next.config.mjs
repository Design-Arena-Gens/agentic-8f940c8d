/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb"
    }
  }
};

export default nextConfig;
