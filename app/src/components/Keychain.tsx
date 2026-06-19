'use client'

import { useEffect, useRef, useState } from 'react'

export default function Keychain() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const pointerX = useRef(0)
  const isPointerDown = useRef(false)

  // Physics state
  const angle = useRef(0)
  const angularVelocity = useRef(0)
  const lastPointerX = useRef(0)
  const releaseVelocity = useRef(0)
  const lastTime = useRef(0)

  // Secondary item angles (lagged for organic feel)
  const astroAngle = useRef(0)
  const ballAngle = useRef(0)
  const discAngle = useRef(0)
  const tagAngle = useRef(0)

  useEffect(() => {
    let rafId: number

    const updatePhysics = (timestamp: number) => {
      if (lastTime.current === 0) lastTime.current = timestamp
      const dt = Math.min((timestamp - lastTime.current) / 1000, 0.1) // limit dt to 100ms
      lastTime.current = timestamp

      if (isPointerDown.current) {
        // Dragging physics: map pointer X to a target angle
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const dx = pointerX.current - centerX
          // Target angle proportional to drag offset (max 60 degrees / ~1.05 rad)
          const maxDrag = Math.min(rect.width * 0.4, 250)
          const targetAngle = (dx / maxDrag) * (Math.PI / 3)
          
          // Smoothly interpolate to target angle
          angle.current += (targetAngle - angle.current) * 0.15
          
          // Calculate drag velocity for release inertia
          const dragSpeed = (pointerX.current - lastPointerX.current) / dt
          lastPointerX.current = pointerX.current
          // Damped velocity track
          releaseVelocity.current = releaseVelocity.current * 0.7 + (dragSpeed / 600) * 0.3
        }
      } else {
        // Pendulum physics: acceleration = -gravity * sin(angle)
        const gravity = 8.0 // gravity strength
        const damping = 0.982 // friction/resistance
        const angularAcceleration = -gravity * Math.sin(angle.current)

        angularVelocity.current += angularAcceleration * dt
        angularVelocity.current *= damping
        angle.current += angularVelocity.current * dt

        // Decay release velocity
        releaseVelocity.current *= 0.95
      }

      // Update secondary items with spring lag (organic look)
      astroAngle.current += (angle.current * 1.25 - astroAngle.current) * 12 * dt
      ballAngle.current  += (angle.current * 0.85 - ballAngle.current)  * 9 * dt
      discAngle.current  += (angle.current * 1.05 - discAngle.current)  * 15 * dt
      tagAngle.current   += (angle.current * 1.45 - tagAngle.current)   * 7 * dt

      // Apply transforms
      const mainEl = containerRef.current?.querySelector('.keychain-body') as HTMLElement
      const astroEl = containerRef.current?.querySelector('.item-astro') as HTMLElement
      const ballEl = containerRef.current?.querySelector('.item-ball') as HTMLElement
      const discEl = containerRef.current?.querySelector('.item-disc') as HTMLElement
      const tagEl = containerRef.current?.querySelector('.item-tag') as HTMLElement

      if (mainEl) {
        const aDeg = angle.current * (180 / Math.PI)
        mainEl.style.transform = `rotateZ(${aDeg}deg) rotateY(${aDeg * 0.4}deg) translateZ(0)`
      }
      if (astroEl) {
        const diff = (astroAngle.current - angle.current) * (180 / Math.PI)
        astroEl.style.transform = `rotateZ(${diff}deg) translateZ(10px)`
      }
      if (ballEl) {
        const diff = (ballAngle.current - angle.current) * (180 / Math.PI)
        ballEl.style.transform = `rotateZ(${diff}deg) translateZ(15px)`
      }
      if (discEl) {
        const diff = (discAngle.current - angle.current) * (180 / Math.PI)
        discEl.style.transform = `rotateZ(${diff}deg) translateZ(5px)`
      }
      if (tagEl) {
        const diff = (tagAngle.current - angle.current) * (180 / Math.PI)
        tagEl.style.transform = `rotateZ(${diff}deg) translateZ(20px)`
      }

      rafId = requestAnimationFrame(updatePhysics)
    }

    rafId = requestAnimationFrame(updatePhysics)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    isPointerDown.current = true
    pointerX.current = e.clientX
    lastPointerX.current = e.clientX
    releaseVelocity.current = 0
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return
    pointerX.current = e.clientX
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    isPointerDown.current = false
    angularVelocity.current = releaseVelocity.current
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-80 h-[380px] mx-auto select-none cursor-grab active:cursor-grabbing z-30"
      style={{ perspective: '800px', touchAction: 'none' }}
    >
      {/* Anchor point at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>

      {/* Main swinging body */}
      <div
        className="keychain-body absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center origin-[top_center] transition-transform duration-75 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Blue Metallic Carabiner Clip */}
        <svg
          width="48"
          height="80"
          viewBox="0 0 48 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
        >
          <path
            d="M32 4C24 4 14 6 10 14C6 22 6 36 6 44C6 52 8 64 16 72C24 80 34 76 38 72C42 68 44 58 44 44C44 30 42 16 38 10C36 7 34.5 4 32 4Z"
            stroke="#3B5BFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M8 32V42"
            stroke="#D1D5DB"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Lock screw */}
          <rect x="5" y="28" width="8" height="12" rx="2" fill="#4B5563" />
        </svg>

        {/* Steel Ring */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="-mt-3 z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          <circle cx="16" cy="16" r="13" stroke="#9CA3AF" strokeWidth="4" />
          <circle cx="16" cy="16" r="13" stroke="#374151" strokeWidth="1" />
        </svg>

        {/* Chain Links */}
        <div className="flex flex-col items-center -mt-1 z-0">
          <div className="w-1.5 h-3 border border-white/40 rounded-full bg-gray-500" />
          <div className="w-1.5 h-3 border border-white/40 rounded-full bg-gray-600 -mt-1" />
          <div className="w-1.5 h-3 border border-white/40 rounded-full bg-gray-500 -mt-1" />
        </div>

        {/* Relative position container for hanging items */}
        <div className="relative w-12 h-12 -mt-1 z-20" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* 1. LEGO ASTRONAUT (Hanging left) */}
          <div
            className="item-astro absolute top-2 right-12 w-16 h-24 origin-[top_right] pointer-events-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Thread connection */}
            <div className="absolute top-0 right-0 w-8 h-[2px] bg-gray-500 origin-[top_right] rotate-[30deg]" />
            {/* Lego figure SVG */}
            <svg
              width="48"
              height="80"
              viewBox="0 0 48 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-2 left-0"
            >
              {/* Helmet */}
              <rect x="14" y="6" width="20" height="18" rx="8" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
              <rect x="16" y="9" width="16" height="9" rx="4" fill="#1F2937" />
              {/* Head inside */}
              <circle cx="24" cy="14" r="5" fill="#FBBF24" />
              {/* Torso */}
              <path d="M12 26H36L33 54H15L12 26Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
              {/* Space agency logo on torso */}
              <circle cx="24" cy="38" r="4" fill="#3B5BFF" />
              <path d="M22 38H26" stroke="white" strokeWidth="1" />
              {/* Left arm */}
              <rect x="6" y="27" width="7" height="20" rx="3" transform="rotate(15 6 27)" fill="#E5E7EB" />
              {/* Right arm */}
              <rect x="35" y="27" width="7" height="20" rx="3" transform="rotate(-15 35 27)" fill="#E5E7EB" />
              {/* Hips & Legs */}
              <rect x="15" y="55" width="18" height="6" fill="#D1D5DB" />
              <rect x="15" y="62" width="8" height="14" rx="2" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
              <rect x="25" y="62" width="8" height="14" rx="2" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
            </svg>
          </div>

          {/* 2. BLUE TRANSPARENT DISC (Center piece) */}
          <div
            className="item-disc absolute top-1 left-1/2 -translate-x-1/2 w-32 h-32 origin-[top_center] pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Connection ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-4 border border-white/20 rounded-full bg-gray-500" />
            {/* Disc body */}
            <div className="absolute top-3 inset-0 rounded-full bg-blue-accent/30 backdrop-blur-md border border-white/30 flex items-center justify-center">
              {/* Inner glowing accent */}
              <div className="absolute inset-2 rounded-full border border-white/10 bg-radial-gradient from-blue-glow/20 to-transparent" />
              {/* Custom Overlapping Chevrons logo (PAMEDIA arrow logo) */}
              <div className="relative flex flex-col items-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  <path
                    d="M10 8L20 18L10 28"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 8L28 18L18 28"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. BASKETBALL (Hanging bottom) */}
          <div
            className="item-ball absolute top-28 left-6 w-16 h-16 origin-[top_center] pointer-events-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Thread connection */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-gray-500" />
            {/* Ball body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-300 flex items-center justify-center overflow-hidden">
              {/* Basketball seams */}
              <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" className="text-gray-600 opacity-60">
                <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 32H62M32 2V62" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 12C20 22 20 42 12 52" stroke="currentColor" strokeWidth="1.5" />
                <path d="M52 12C44 22 44 42 52 52" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* 4. WHITE RECTANGULAR TAG (Hanging right) */}
          <div
            className="item-tag absolute top-6 left-28 w-20 h-10 origin-[top_left] pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Thread connection */}
            <div className="absolute top-0 left-0 w-8 h-[2px] bg-gray-500 origin-[top_left] rotate-[-40deg]" />
            {/* Tag body */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-accent animate-ping" />
              <span className="font-mono text-[9px] font-bold tracking-wider uppercase whitespace-nowrap">
                Drag Me
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
