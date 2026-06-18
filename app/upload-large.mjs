#!/usr/bin/env node
/**
 * Upload large files (>50MB) to Supabase Storage using TUS resumable upload protocol.
 * This bypasses the 50MB POST limit on the free tier.
 *
 * Usage:  node upload-large.mjs
 */

import { readFile, stat } from 'fs/promises'
import { join } from 'path'

const SUPABASE_URL = 'https://ggdflkchtogsssnakxsh.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Files that exceeded the 50MB standard upload limit
const LARGE_FILES = [
  { bucket: 'videos', file: 'public/videos/lambo-gallardo-lp560.mp4' },
  { bucket: 'videos', file: 'public/videos/mercedes-s-class-2021.mp4' },
  { bucket: 'videos', file: 'public/videos/toyota-gr-supra.mp4' },
]

// Chunk size: 6MB (Supabase TUS minimum is 5MB+)
const CHUNK_SIZE = 6 * 1024 * 1024

async function tusUpload(bucket, filePath) {
  const fileName = filePath.split('/').pop()
  const s = await stat(filePath)
  const fileSize = s.size
  const buf = await readFile(filePath)

  const tusEndpoint = `${SUPABASE_URL}/storage/v1/upload/resumable`

  // Step 1: Create upload session
  const createRes = await fetch(tusEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/offset+octet-stream',
      'Content-Length': '0',
      'Upload-Length': String(fileSize),
      'Upload-Metadata': `bucketName ${btoa(bucket)},objectName ${btoa(fileName)},contentType ${btoa('video/mp4')},cacheControl ${btoa('3600')}`,
      'Tus-Resumable': '1.0.0',
      'x-upsert': 'true',
    },
  })

  if (!createRes.ok) {
    const t = await createRes.text()
    throw new Error(`Create session failed ${createRes.status}: ${t}`)
  }

  const uploadUrl = createRes.headers.get('Location')
  if (!uploadUrl) throw new Error('No Location header in TUS response')

  // Step 2: Upload in chunks
  let offset = 0
  let chunk = 1
  const totalChunks = Math.ceil(fileSize / CHUNK_SIZE)

  while (offset < fileSize) {
    const end = Math.min(offset + CHUNK_SIZE, fileSize)
    const chunkBuf = buf.slice(offset, end)

    process.stdout.write(`    chunk ${chunk}/${totalChunks} (${(chunkBuf.length / 1e6).toFixed(1)} MB) … `)

    const patchRes = await fetch(uploadUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/offset+octet-stream',
        'Content-Length': String(chunkBuf.length),
        'Upload-Offset': String(offset),
        'Tus-Resumable': '1.0.0',
      },
      body: chunkBuf,
    })

    if (!patchRes.ok) {
      const t = await patchRes.text()
      throw new Error(`Chunk ${chunk} failed ${patchRes.status}: ${t}`)
    }

    console.log('✅')
    offset = end
    chunk++
  }
}

const ROOT = new URL('.', import.meta.url).pathname

for (const { bucket, file } of LARGE_FILES) {
  const fullPath = join(ROOT, file)
  const name = file.split('/').pop()
  const s = await stat(fullPath)
  console.log(`\n📦  Uploading ${name} (${(s.size / 1e6).toFixed(1)} MB) → ${bucket} via TUS`)
  try {
    await tusUpload(bucket, fullPath)
    console.log(`✅  ${name} uploaded successfully!`)
  } catch (e) {
    console.error(`❌  ${name} failed: ${e.message}`)
  }
}

console.log('\n🎉  Large file uploads complete!')
