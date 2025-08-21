// next.config.js - FIXED JavaScript Only Version
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'github.com',
      'vercel.app',
      'githubusercontent.com'
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },

  // Rewrites for API routing
  async rewrites() {
    return [
      {
        source: '/api/github/:path*',
        destination: '/api/github/:path*',
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/sippinwindex',
        permanent: false,
      },
    ]
  },

  // Webpack config for better builds
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }

    // Handle font loading
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/',
        },
      },
    })

    return config
  },

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // TypeScript config
  typescript: {
    // Ignore build errors in development
    ignoreBuildErrors: false,
  },

  // ESLint config
  eslint: {
    // Ignore during builds for faster deployment
    ignoreDuringBuilds: true,
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration
  output: 'standalone',

  // Trailing slash preference
  trailingSlash: false,

  // Power optimizations
  poweredByHeader: false,

  // Compression
  compress: true,
}

module.exports = nextConfig