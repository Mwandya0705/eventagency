import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Support both key name conventions
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Returns the public CDN URL for a file in a Supabase Storage bucket.
 * e.g. storageUrl('videos', 'mercedes-cover.mp4')
 */
export function storageUrl(bucket: 'videos' | 'images', path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
