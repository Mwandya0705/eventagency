/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow <Image> to load from Supabase Storage in future
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ggdflkchtogsssnakxsh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Tell Vercel's edge to cache Supabase video/image responses for 1 year
  async headers() {
    return [
      {
        // Proxy-style: cache everything from Supabase storage on the CDN
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

export default nextConfig
