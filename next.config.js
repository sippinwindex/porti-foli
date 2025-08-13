/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force all pages to be dynamic to avoid build-time API calls
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  
  // Skip static optimization for pages that need runtime data
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
  
  // Configure which pages should be dynamically rendered
  async rewrites() {
    return []
  },
  
  // Skip static generation for specific pages
  trailingSlash: false,
  
  // Environment variables that should be available at build time
  env: {
    SKIP_BUILD_STATIC_GENERATION: 'true'
  }
}

module.exports = nextConfig