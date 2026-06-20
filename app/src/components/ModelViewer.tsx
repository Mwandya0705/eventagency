'use client'

import { useEffect, useRef, Component, ReactNode } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Cache the fetched GLB by URL so re-mounts / navigations skip the network.
// (preloadModel in Navbar warms this on hover, so the file is ready on entry.)
THREE.Cache.enabled = true

/* ─── Top-level React Error Boundary ──────────────────────────── */
interface EBState { error: string | null }
class SceneErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(e: Error) {
    return { error: e.message }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-white/30">
          <div className="w-16 h-16 border-2 border-blue-accent/30 rounded-full animate-spin border-t-blue-accent" />
          <span className="text-[10px] font-mono tracking-widest uppercase">3D unavailable</span>
        </div>
      )
    }
    return this.props.children
  }
}

/* ─── Core Three.js canvas using a plain <canvas> element ─────── */
function ThreeCanvas({ modelPath, modelReady }: { modelPath: string; modelReady: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    mount.appendChild(renderer.domElement)

    /* ── Scene ── */
    const scene = new THREE.Scene()

    /* ── Camera — centred on model so full figure shows head to toe ── */
    const FOV = 40
    const camera = new THREE.PerspectiveCamera(FOV, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.set(0, 0.0, 8.0)
    camera.lookAt(0, 0.0, 0)  // look at model centre

    // Frame the camera so the whole model fits the current aspect ratio. On narrow
    // (portrait / small) displays this pulls the camera back so the figure never clips —
    // height-only framing would otherwise cut the model off on tall, narrow screens.
    let modelHeight = 4.6 // scaled target height (set after load)
    let modelWidth = 1.8 // silhouette width incl. rotation (set after load)
    const frameCamera = () => {
      const aspect = mount.clientWidth / Math.max(1, mount.clientHeight)
      const vFov = (FOV * Math.PI) / 180
      const fitHeightDist = modelHeight / 2 / Math.tan(vFov / 2)
      const fitWidthDist = modelWidth / 2 / (Math.tan(vFov / 2) * aspect)
      camera.position.z = Math.max(fitHeightDist, fitWidthDist) * 1.28 // breathing room
      camera.updateProjectionMatrix()
    }
    frameCamera()

    /* ── Lights ── */
    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4)
    dirLight.position.set(4, 8, 4)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    scene.add(dirLight)

    const rimLight = new THREE.PointLight(0x3B5BFF, 1.2, 20)
    rimLight.position.set(-4, 4, -4)
    scene.add(rimLight)

    const fillLight = new THREE.PointLight(0xffffff, 0.4, 20)
    fillLight.position.set(4, -2, 4)
    scene.add(fillLight)

    /* ── Ground shadow disc ── */
    const shadowGeo = new THREE.CircleGeometry(1.8, 32)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.25,
    })
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat)
    shadowDisc.rotation.x = -Math.PI / 2
    shadowDisc.position.y = -1.9
    scene.add(shadowDisc)

    /* ── Pivot for rotation ── */
    const pivot = new THREE.Group()
    scene.add(pivot)

    /* ── Placeholder: spinning icosahedron until model loads ── */
    let placeholder: THREE.Mesh | null = null
    if (!modelReady) {
      const geo = new THREE.IcosahedronGeometry(0.9, 1)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x3B5BFF,
        metalness: 0.8,
        roughness: 0.2,
      })
      placeholder = new THREE.Mesh(geo, mat)
      pivot.add(placeholder)
    }

    /* ── Load the GLB (file cached by THREE.Cache; warmed on nav hover) ── */
    let loadedModel: THREE.Object3D | null = null
    let cancelled = false
    if (modelReady) {
      const loader = new GLTFLoader()
      loader.load(
        modelPath,
        (gltf) => {
          if (cancelled) return
          const model = gltf.scene

          // Auto-centre and scale to fit
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3())
          const centre = box.getCenter(new THREE.Vector3())

          // Scale by HEIGHT (size.y) so the figure fills the frame regardless
          // of arm span / width. ~4.6 fills most of the camera view
          // (~5.8 units tall at this distance) without cutting head or feet.
          const targetHeight = 4.6
          const scale = targetHeight / size.y
          model.scale.setScalar(scale)

          // Align feet to shadow disc at y = -1.9
          model.position.x = -centre.x * scale
          model.position.y = (-box.min.y) * scale - 1.9
          model.position.z = -centre.z * scale

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })

          // Frame to the real model size (use the x/z diagonal so it never clips while spinning)
          modelHeight = size.y * scale
          modelWidth = Math.hypot(size.x, size.z) * scale
          frameCamera()

          if (placeholder) pivot.remove(placeholder)
          pivot.add(model)
          loadedModel = model
        },
        undefined, // progress
        (err) => console.warn('GLB load error (non-fatal):', err)
      )
    }

    /* ── Orbit drag controls (pure pointer events) ── */
    let isDragging = false
    let prevX = 0
    let autoSpin = true
    let autoSpinSpeed = 0.008   // radians per frame when idle

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      autoSpin = false
      prevX = e.clientX
      renderer.domElement.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - prevX
      pivot.rotation.y += dx * 0.012
      prevX = e.clientX
    }
    const onPointerUp = () => {
      isDragging = false
      // Resume auto-spin after 1.5 s of idle
      setTimeout(() => { autoSpin = true }, 1500)
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointerleave', onPointerUp)
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grab'

    /* ── Resize handling (ResizeObserver + window resize fallback) ── */
    const handleResize = () => {
      if (!mount || !mount.clientWidth || !mount.clientHeight) return
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      camera.aspect = mount.clientWidth / mount.clientHeight
      frameCamera() // re-fit so the model stays fully visible at the new size
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(mount)
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    /* ── Render loop ── */
    let rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      if (autoSpin) pivot.rotation.y += autoSpinSpeed
      renderer.render(scene, camera)
    }
    animate()

    /* ── Cleanup ── */
    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('pointerleave', onPointerUp)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      if (loadedModel) {
        pivot.remove(loadedModel)
        loadedModel.traverse((child) => {
          const mesh = child as THREE.Mesh
          if (mesh.isMesh) {
            mesh.geometry?.dispose()
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose())
            } else {
              mesh.material?.dispose()
            }
          }
        })
      }
    }
  }, [modelPath, modelReady])

  return <div ref={mountRef} className="w-full h-full" />
}

/* ─── Public component ─────────────────────────────────────────── */
interface ModelViewerProps {
  modelPath?: string
  /** Number (px) or CSS string like "100%" */
  height?: number | string
  modelReady?: boolean
}

export default function ModelViewer({
  modelPath = '/models/squid_game_-_worker.glb',
  height = 500,
  modelReady = false,
}: ModelViewerProps) {
  return (
    <div
      style={height === '100%'
        ? { position: 'absolute', inset: 0 }
        : { height }}
      className="w-full relative select-none"
    >
      <SceneErrorBoundary>
        <ThreeCanvas modelPath={modelPath} modelReady={modelReady} />
      </SceneErrorBoundary>

      {/* Drag hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-white/35 uppercase">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 11V6a2 2 0 0 0-4 0v0M14 10V4a2 2 0 0 0-4 0v6m0 0V2a2 2 0 0 0-4 0v10" />
          <path d="M6 12v2a6 6 0 0 0 12 0v-3" />
        </svg>
        Drag to spin
      </div>
    </div>
  )
}
