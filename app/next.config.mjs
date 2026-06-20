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

  // NOTE: do NOT add a catch-all `Cache-Control` header here. A previous
  // `source: '/(.*)'` rule cached HTML documents and RSC payloads for a year,
  // so after each deploy browsers/CDN served stale HTML that referenced old JS
  // chunk hashes — those 404'd and crashed the app ("client-side exception").
  // Next/Vercel already cache hashed `_next/static` assets as immutable, and
  // Supabase media is served from supabase.co (a different origin), so it was
  // never affected by this rule anyway.
}

export default nextConfig
