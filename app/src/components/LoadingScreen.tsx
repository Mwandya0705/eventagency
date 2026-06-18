'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
  ready?: boolean
}

const SPLASH_VIDEO =
  'https://ggdflkchtogsssnakxsh.supabase.co/storage/v1/object/public/videos/splashscreenvideo.mp4'
const SPLASH_DURATION_MS = 8000

export default function LoadingScreen({ onComplete, ready = true }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const readyRef     = useRef(ready)
  readyRef.current   = ready
  const doneRef      = useRef(false)
  const startedRef   = useRef(false)

  const [progress,    setProgress]    = useState(0)
  const [started,     setStarted]     = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

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

  useEffect(() => {
    // Try to play; always start the progress bar after 1s regardless
    const v = videoRef.current
    if (v) {
      v.play().catch(() => {})
    }
    const t = setTimeout(beginProgress, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // Hard safety net
  useEffect(() => {
    const t = setTimeout(() => finish(), SPLASH_DURATION_MS + 5000)
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
      {/* === VIDEO LAYER === */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-[1]"
        src={SPLASH_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => { videoRef.current?.play().catch(() => {}); setVideoLoaded(true); beginProgress() }}
        onPlaying={() => { setVideoLoaded(true); beginProgress() }}
        onError={beginProgress}
      />

      {/* === PROGRESS BAR === */}
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
