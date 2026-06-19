'use client'

import { Suspense, useRef, Component, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Error boundary: catches missing / broken GLB gracefully ─── */
interface EBState { hasError: boolean }
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

/* ─── Placeholder shape when no model file is present ──────────── */
function PlaceholderShape() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6
      meshRef.current.rotation.x += delta * 0.2
    }
  })
  return (
    <mesh ref={meshRef} castShadow>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#3B5BFF"
        metalness={0.8}
        roughness={0.2}
        wireframe={false}
      />
    </mesh>
  )
}

/* ─── The actual 3-D model ─────────────────────────────────────── */
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    }
  })

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

/* ─── Spinning ring while GLB is downloading ─────────────────── */
function LoadingRing() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z += delta * 2 })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.7, 0.05, 16, 100]} />
      <meshStandardMaterial color="#3B5BFF" />
    </mesh>
  )
}

/* ─── Scene – shared wrapper ────────────────────────────────── */
function Scene({ modelPath, modelReady }: { modelPath: string; modelReady: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3B5BFF" />
      <Environment preset="city" />
      <ContactShadows position={[0, -2.4, 0]} opacity={0.35} scale={8} blur={2} far={5} />

      <Suspense fallback={<LoadingRing />}>
        {modelReady ? (
          <ModelErrorBoundary fallback={<PlaceholderShape />}>
            <Model url={modelPath} />
          </ModelErrorBoundary>
        ) : (
          <PlaceholderShape />
        )}
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.6}
      />
    </>
  )
}

/* ─── Public API ────────────────────────────────────────────────── */
interface ModelViewerProps {
  modelPath?: string
  height?: number | string
  /** Set to true only once the .glb has been uploaded to /public/models/ */
  modelReady?: boolean
}

export default function ModelViewer({
  modelPath = '/models/squid-game-worker.glb',
  height = 440,
  modelReady = false,
}: ModelViewerProps) {
  return (
    <div
      style={{ height }}
      className="w-full relative select-none cursor-grab active:cursor-grabbing"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene modelPath={modelPath} modelReady={modelReady} />
      </Canvas>

      {/* Hint label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-white/35 uppercase">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 11V6a2 2 0 0 0-4 0v0M14 10V4a2 2 0 0 0-4 0v6m0 0V2a2 2 0 0 0-4 0v10" />
          <path d="M6 12v2a6 6 0 0 0 12 0v-3" />
        </svg>
        Drag to rotate
      </div>

      {!modelReady && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none text-[9px] font-mono text-white/25 tracking-widest uppercase">
          3D model pending upload
        </div>
      )}
    </div>
  )
}
