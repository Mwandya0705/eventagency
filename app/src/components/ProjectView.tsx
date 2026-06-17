'use client'

import { useEffect, useRef, useState } from 'react'

export interface Brand {
  name: string
  category: string
  year: string
  cover: string
  video: string
  videos?: string[]
}

interface ProjectViewProps {
  brands: Brand[]
  index: number | null
  onClose: () => void
  onNavigate: (i: number) => void
}

export default function ProjectView({ brands, index, onClose, onNavigate }: ProjectViewProps) {
  const open = index !== null
  const [current, setCurrent] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Sync the displayed brand + default clip whenever a project is opened/navigated.
  useEffect(() => {
    if (index === null) return
    setCurrent(index)
    const b = brands[index]
    setSelectedVideo(b.videos?.[0] ?? b.video)
  }, [index, brands])

  // Play the selected clip with sound while open; pause when closed.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (open && selectedVideo) {
      v.muted = false
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [open, selectedVideo])

  const brand = brands[current]
  const clips = brand.videos?.length ? brand.videos : [brand.video]
  const hasPrev = current > 0
  const hasNext = current < brands.length - 1

  return (
    <div
      className={`fixed inset-0 z-[45] bg-black transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      {/* Main player */}
      <video
        ref={videoRef}
        key={selectedVideo || 'none'}
        src={selectedVideo || undefined}
        poster={brand.cover}
        controls
        playsInline
        className="absolute inset-0 w-full h-full object-contain bg-black"
      />

      {/* Top gradient for legibility */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />

      {/* Back to landing */}
      <button
        onClick={onClose}
        className="absolute top-5 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white text-xs uppercase tracking-[0.25em] transition-colors"
      >
        <span className="text-2xl leading-none">←</span> Back
      </button>

      {/* Project title */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <h2 className="font-display text-lg md:text-2xl font-bold uppercase text-white tracking-wide leading-none">
          {brand.name}
        </h2>
        <p className="text-white/60 text-[11px] md:text-sm mt-1">
          {brand.category} · {brand.year}
        </p>
      </div>

      {/* Next project (top-right) */}
      {hasNext && (
        <button
          onClick={() => onNavigate(current + 1)}
          className="absolute top-5 right-6 z-20 text-right text-white/80 hover:text-white transition-colors"
        >
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Next Project</div>
          <div className="text-sm md:text-base">{brands[current + 1].name} →</div>
        </button>
      )}

      {/* Previous / Next side arrows */}
      {hasPrev && (
        <button
          onClick={() => onNavigate(current - 1)}
          aria-label="Previous project"
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/60 transition-colors flex items-center justify-center text-2xl"
        >
          ‹
        </button>
      )}
      {hasNext && (
        <button
          onClick={() => onNavigate(current + 1)}
          aria-label="Next project"
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/60 transition-colors flex items-center justify-center text-2xl"
        >
          ›
        </button>
      )}

      {/* Clip playlist (bottom-right) */}
      <div className="absolute right-5 md:right-6 bottom-24 z-20 flex flex-col gap-3 max-h-[55vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <span className="text-white/50 text-[10px] uppercase tracking-[0.25em] text-right">Films</span>
        {clips.map((clip, i) => (
          <button
            key={clip + i}
            onClick={() => setSelectedVideo(clip)}
            className={`relative w-24 md:w-32 aspect-video rounded-md overflow-hidden border transition-colors ${
              selectedVideo === clip ? 'border-blue-accent' : 'border-white/20 hover:border-white/50'
            }`}
          >
            <video src={clip} muted playsInline preload="metadata" className="w-full h-full object-cover" />
            <span
              className={`absolute inset-0 transition-colors ${
                selectedVideo === clip ? 'bg-blue-accent/10' : 'bg-black/30'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
