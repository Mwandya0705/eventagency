'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
  ready?: boolean
}

// Hardcoded URL — never breaks even if env var is missing at build time
const SPLASH_VIDEO =
  'https://ggdflkchtogsssnakxsh.supabase.co/storage/v1/object/public/videos/splashscreenvideo.mp4'
const SPLASH_DURATION_MS = 8000 // 8 seconds

export default function LoadingScreen({ onComplete, ready = true }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const readyRef     = useRef(ready)
  readyRef.current   = ready
  const doneRef      = useRef(false)
  const startedRef   = useRef(false)

  const [progress, setProgress] = useState(0)
  const [started,  setStarted]  = useState(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setProgress(100)
    const el = containerRef.current
    if (el) el.style.willChange = 'transform'
    gsap.to(el, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        if (el) el.style.willChange = 'auto'
        onComplete()
      },
    })
  }

  const beginProgress = () => {
    if (startedRef.current) return
    startedRef.current = true
    setStarted(true)
  }

  // Try to play immediately; start bar after 1 s regardless (slow networks / mobile)
  useEffect(() => {
    videoRef.current?.play().catch(() => {})
    const t = setTimeout(beginProgress, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Animate progress bar over SPLASH_DURATION_MS then finish
  useEffect(() => {
    if (!started) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const elapsed = now - t0
      const p = Math.min(100, (elapsed / SPLASH_DURATION_MS) * 100)
      setProgress(readyRef.current ? p : Math.min(p, 99))
      if (elapsed >= SPLASH_DURATION_MS && readyRef.current) { finish(); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  // Absolute safety net — never trap user beyond 14 s
  useEffect(() => {
    const t = setTimeout(() => finish(), SPLASH_DURATION_MS + 6000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pct = Math.round(progress)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black"
      style={{ height: '100dvh' }}
    >
      {/* Splash video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={SPLASH_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => { videoRef.current?.play().catch(() => {}); beginProgress() }}
        onPlaying={beginProgress}
        onError={beginProgress}
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <div className="relative h-7 md:h-9 w-full bg-gray-200 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-blue-accent"
            style={{ width: `${pct}%`, transition: 'width 120ms ease-out' }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 text-xs font-semibold tabular-nums">
            {pct} %
          </span>
        </div>
      </div>
    </div>
  )
}
