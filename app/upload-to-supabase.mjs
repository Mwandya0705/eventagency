#!/usr/bin/env node
/**
 * Bulk-upload all files from public/videos/ and public/images/
 * to Supabase Storage using the Storage REST API.
 *
 * Usage:  node upload-to-supabase.mjs
 */

import { readdir, readFile, stat } from 'fs/promises'
import { join, extname } from 'path'
import { createReadStream } from 'fs'
import { Readable } from 'stream'

const SUPABASE_URL   = 'https://ggdflkchtogsssnakxsh.supabase.co'
const SERVICE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''

if (!SERVICE_KEY) {
  console.error('❌  Set SUPABASE_SERVICE_ROLE_KEY env var before running.')
  console.error('    e.g.  SUPABASE_SERVICE_ROLE_KEY=your_key node upload-to-supabase.mjs')
  process.exit(1)
}

const MIME = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
}

async function upload(bucket, filePath, remoteName) {
  const ext  = extname(filePath).toLowerCase()
  const mime = MIME[ext] || 'application/octet-stream'
  const url  = `${SUPABASE_URL}/storage/v1/object/${bucket}/${remoteName}`

  // Read file as Buffer
  const buf = await readFile(filePath)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': mime,
      'x-upsert': 'true',      // overwrite if already exists
    },
    body: buf,
    duplex: 'half',
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`HTTP ${res.status}: ${txt}`)
  }
  return res
}

async function uploadDir(bucket, dir) {
  const entries = await readdir(dir)
  let done = 0
  const total = entries.length
  console.log(`\n📦  Uploading ${total} files → bucket "${bucket}"`)

  for (const name of entries) {
    const fp = join(dir, name)
    const s  = await stat(fp)
    if (!s.isFile()) continue

    process.stdout.write(`  [${done + 1}/${total}] ${name} (${(s.size / 1e6).toFixed(1)} MB) … `)
    try {
      await upload(bucket, fp, name)
      console.log('✅')
    } catch (e) {
      console.log(`❌  ${e.message}`)
    }
    done++
  }
  console.log(`✅  Done: ${done}/${total} uploaded to "${bucket}"`)
}

const ROOT = new URL('.', import.meta.url).pathname

await uploadDir('images', join(ROOT, 'public/images'))
await uploadDir('videos', join(ROOT, 'public/videos'))

console.log('\n🎉  All assets uploaded to Supabase Storage!')
