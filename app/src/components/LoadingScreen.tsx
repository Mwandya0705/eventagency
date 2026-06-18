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
  const readyRef = useRef(ready)
  readyRef.current = ready
  const doneRef = useRef(false)

  const [progress, setProgress] = useState(0)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setProgress(100)
    // Slide the whole splash UP out of view, revealing the landing beneath.
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      delay: 0.1,
      onComplete,
    })
  }

  // Animate progress bar over SPLASH_DURATION_MS; finish when time is up AND assets ready.
  useEffect(() => {
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
  }, [])

  // Safety net — never trap the user
  useEffect(() => {
    const fallback = setTimeout(() => finish(), SPLASH_DURATION_MS + 4000)
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
        className="absolute inset-0 w-full h-full object-cover"
        src={SPLASH_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
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
