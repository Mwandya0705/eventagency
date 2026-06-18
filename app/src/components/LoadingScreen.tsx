'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { storageUrl } from '@/lib/supabase'

interface LoadingScreenProps {
  onComplete: () => void
  ready?: boolean
}

const SPLASH_DURATION_MS = 8000
const SPLASH_VIDEO = storageUrl('videos', 'splashscreenvideo.mp4')

export default function LoadingScreen({ onComplete, ready = true }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready
  const doneRef = useRef(false)
  const startedRef = useRef(false)

  const [progress, setProgress] = useState(0)
  const [started, setStarted] = useState(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setProgress(100)
    // Bar is full → trigger the slide-up instantly (no delay); the motion itself stays smooth.
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

  // The bar begins exactly when the splash video starts displaying, so they're in sync.
  const beginProgress = () => {
    if (startedRef.current) return
    startedRef.current = true
    setStarted(true)
  }

  // Play the video as early as possible; if autoplay is blocked/slow, start the bar anyway.
  useEffect(() => {
    const v = videoRef.current
    if (v) v.play().catch(() => {})
    const fallbackStart = setTimeout(beginProgress, 1200)
    return () => clearTimeout(fallbackStart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fill the bar from 0 → 100% over the splash duration, then finish.
  useEffect(() => {
    if (!started) return
    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(100, (elapsed / SPLASH_DURATION_MS) * 100)
      setProgress(readyRef.current ? p : Math.min(p, 99))

      if (elapsed >= SPLASH_DURATION_MS && readyRef.current) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  // Safety net — never trap the user.
  useEffect(() => {
    const fallback = setTimeout(() => finish(), SPLASH_DURATION_MS + 5000)
    return () => clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pct = Math.round(progress)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      {/* Splash video from Supabase Storage */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={SPLASH_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlaying={beginProgress}
        onCanPlay={() => videoRef.current?.play().catch(() => {})}
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full">
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
