'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* ─── The actual 3-D model ─────────────────────────────────────── */
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  // Gentle auto-rotation when the user isn't dragging
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  // Make sure every mesh casts & receives shadows
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.6} position={[0, -1.5, 0]} />
    </group>
  )
}

/* ─── Loading ring shown while the GLB is fetching ─────────────── */
function Loader() {
  return (
    <mesh>
      <torusGeometry args={[0.6, 0.05, 16, 100]} />
      <meshStandardMaterial color="#3B5BFF" />
    </mesh>
  )
}

/* ─── Public API ────────────────────────────────────────────────── */
interface ModelViewerProps {
  /** Path to the .glb file served from /public, e.g. "/models/squid-game-worker.glb" */
  modelPath?: string
  /** Height of the canvas – defaults to 420px */
  height?: number | string
}

export default function ModelViewer({
  modelPath = '/models/squid-game-worker.glb',
  height = 420,
}: ModelViewerProps) {
  return (
    <div
      style={{ height, cursor: 'grab' }}
      className="w-full relative select-none"
      title="Drag to rotate"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3B5BFF" />

        {/* HDR environment for reflections */}
        <Environment preset="city" />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.4}
          scale={8}
          blur={2.5}
          far={5}
        />

        {/* Model */}
        <Suspense fallback={<Loader />}>
          <Model url={modelPath} />
        </Suspense>

        {/* Mouse drag = orbit; scroll = zoom; right-drag = pan */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.6}
        />
      </Canvas>

      {/* "Drag" hint overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-white/40 uppercase animate-pulse">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0m0 0V2a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0v10" />
          <path d="M6 12v2a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-3" />
        </svg>
        Drag to rotate
      </div>
    </div>
  )
}
