/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove the experimental.appDir option
  experimental: {
    // Keep only current experimental features you need
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['github.com', 'raw.githubusercontent.com', 'avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig