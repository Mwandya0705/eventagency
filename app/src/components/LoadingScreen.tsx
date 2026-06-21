'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
  ready?: boolean
}

const SPLASH_VIDEO =
  'https://ggdflkchtogsssnakxsh.supabase.co/storage/v1/object/public/videos/splashscreenvideo.mp4'
const SPLASH_DURATION_DESKTOP = 8000
const SPLASH_DURATION_MOBILE  = 4000

export default function LoadingScreen({ onComplete, ready = true }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const readyRef     = useRef(ready)
  readyRef.current   = ready
  const doneRef      = useRef(false)
  const startedRef   = useRef(false)

  // Keep track of mobile in a ref so effects can read the correct value
  // without depending on state (avoids stale-closure problems).
  const isMobileRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  const [progress, setProgress] = useState(0)
  const [started,  setStarted]  = useState(false)

  // Detect mobile on mount
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches
    isMobileRef.current = mobile
    setIsMobile(mobile)
  }, [])

  const getSplashDuration = () =>
    isMobileRef.current ? SPLASH_DURATION_MOBILE : SPLASH_DURATION_DESKTOP

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

  // Kick off video + start progress bar within 1 s no matter what
  useEffect(() => {
    const v = videoRef.current
    if (v) { v.play().catch(() => {}) }
    const t = setTimeout(beginProgress, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Animate the progress bar once started
  useEffect(() => {
    if (!started) return
    const duration = getSplashDuration()
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const elapsed = now - t0
      const p = Math.min(100, (elapsed / duration) * 100)
      setProgress(readyRef.current ? p : Math.min(p, 99))
      if (elapsed >= duration && readyRef.current) { finish(); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  // Hard safety net — always exits by desktop max + 5 s
  useEffect(() => {
    const t = setTimeout(() => finish(), SPLASH_DURATION_DESKTOP + 5000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pct = Math.round(progress)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* VIDEO LAYER
          Desktop: preload="auto" for instant playback.
          Mobile:  preload="metadata" to avoid burning mobile data — progress bar
          still starts because beginProgress fires after 1 s anyway. */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-[1]"
        src={SPLASH_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => { videoRef.current?.play().catch(() => {}); beginProgress() }}
        onPlaying={beginProgress}
        onError={beginProgress}
      />

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full z-[10]">
        <div className="relative h-7 md:h-9 w-full bg-gray-900 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-blue-accent transition-all duration-150 ease-out"
            style={{ width: `${pct}%` }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-xs font-semibold tabular-nums">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  )
}
