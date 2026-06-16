'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
  /** When false, the bar holds near the end until assets are ready. */
  ready?: boolean
}

export default function LoadingScreen({ onComplete, ready = true }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready
  const doneRef = useRef(false)

  const [progress, setProgress] = useState(0)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setProgress(100)
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      delay: 0.2,
      onComplete,
    })
  }

  // Percentage tracks the splash video's playback.
  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const p = (v.currentTime / v.duration) * 100
    // Hold just shy of 100 until the page's assets are ready.
    setProgress(readyRef.current ? p : Math.min(p, 99))
  }

  const handleEnded = () => {
    if (readyRef.current) finish()
  }

  // If the video finished before the images were ready, complete once they are.
  useEffect(() => {
    if (ready && videoRef.current?.ended) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // Safety net: never trap the user if the splash video stalls or fails.
  useEffect(() => {
    const fallback = setTimeout(() => finish(), 14000)
    return () => clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pct = Math.round(progress)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
    >
      {/* Splash video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/eventssplash.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Loading strip */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="relative h-8 md:h-10 w-full bg-gray-200 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-blue-accent"
            style={{ width: `${pct}%`, transition: 'width 150ms ease-out' }}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-900 text-sm font-semibold tabular-nums">
            {pct} %
          </span>
        </div>
      </div>
    </div>
  )
}
