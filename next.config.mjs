import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // next-pwa@5 expects workbox/GenerateSW options at the top level
  cleanupOutdatedCaches: true,
  ignoreURLParametersMatching: [/.*/],
  runtimeCaching: [
    {
      urlPattern: /^\/_next\/static\//,
      handler: 'NetworkOnly',
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'Accept',
            value: 'text/html',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default withPWA(nextConfig)
