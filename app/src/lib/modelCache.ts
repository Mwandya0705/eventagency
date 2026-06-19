import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Keep fetched GLB buffers in memory so re-mounts don't re-download.
THREE.Cache.enabled = true

// One in-flight/resolved promise per model path, shared across the app.
const cache = new Map<string, Promise<GLTF>>()

/**
 * Begin (or reuse) loading a GLB. Calling this early — e.g. when the user
 * hovers the nav link — warms the cache so the model is already parsed by the
 * time the page mounts, instead of popping in after navigation.
 */
export function preloadModel(path: string): Promise<GLTF> {
  let promise = cache.get(path)
  if (!promise) {
    promise = new GLTFLoader().loadAsync(path)
    // On failure, drop it so a later attempt can retry.
    promise.catch(() => cache.delete(path))
    cache.set(path, promise)
  }
  return promise
}
