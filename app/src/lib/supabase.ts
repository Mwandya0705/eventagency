import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Support both key name conventions
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Returns the public CDN URL for a stored media file.
 * Videos are served from Cloudflare R2 (zero egress fees — Supabase egress was
 * blowing the org quota); images remain on Supabase Storage.
 * e.g. storageUrl('videos', 'mercedes-cover.mp4')
 */
const R2_VIDEOS_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-acd016d5e1604b5d9d0e4e79bfd00449.r2.dev'

export function storageUrl(bucket: 'videos' | 'images', path: string): string {
  if (bucket === 'videos') return `${R2_VIDEOS_URL}/${path}`
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
