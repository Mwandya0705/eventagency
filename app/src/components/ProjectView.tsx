'use client'

import { useEffect, useRef, useState } from 'react'

export interface Clip {
  src: string
  title: string
}

/**
 * Lazy thumbnail — video src is only assigned once the element enters
 * the viewport, so we don't hammer the network with 6+ parallel video
 * requests when the rail first mounts.
 */
function ClipThumb({ src }: { src: string }) {
  const ref   = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLoad(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={load ? src : undefined}
      muted
      playsInline
      preload={load ? 'metadata' : 'none'}
      onLoadedMetadata={(e) => {
        const v = e.currentTarget
        try { v.currentTime = Math.min(2.5, Math.max(0.5, (v.duration || 5) * 0.15)) }
        catch { /* seeking not ready */ }
      }}
      className="w-full h-full object-cover"
    />
  )
}

export interface Brand {
  name: string
  category: string
  year: string
  cover: string
  video: string
  videos?: Clip[]
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

  useEffect(() => {
    if (index === null) return
    setCurrent(index)
    const b = brands[index]
    setSelectedVideo(b.videos?.[0]?.src ?? b.video)
  }, [index, brands])

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
  const clips: Clip[] = brand.videos?.length
    ? brand.videos
    : [{ src: brand.video, title: brand.name }]
  const hasPrev = current > 0
  const hasNext = current < brands.length - 1

  return (
    <div
      className={`fixed inset-0 z-[45] bg-black transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
      style={{ height: '100dvh' }}
      aria-hidden={!open}
    >
      {/* Main player — object-contain shows full video on all sizes */}
      <video
        ref={videoRef}
        key={selectedVideo || 'none'}
        src={selectedVideo || undefined}
        controls
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-contain object-center bg-black"
      />

      {/* Top gradient */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />

      {/* Top bar: Back · Title · Next */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 md:gap-8 px-3 max-w-[95vw]">
        {/* Back */}
        <button
          onClick={onClose}
          className="flex min-w-[52px] md:min-w-[120px] items-center gap-1 text-white/80 hover:text-white text-[9px] md:text-xs uppercase tracking-[0.2em] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
        >
          <span className="text-lg leading-none">←</span>
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Title */}
        <div className="text-center pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          <h2 className="font-display text-sm sm:text-base md:text-2xl font-bold uppercase text-white tracking-wide leading-none whitespace-nowrap">
            {brand.name}
          </h2>
          <p className="text-white/70 text-[9px] sm:text-[10px] md:text-sm mt-0.5 whitespace-nowrap">
            {brand.category} · {brand.year}
          </p>
        </div>

        {/* Next project */}
        <div className="flex min-w-[52px] md:min-w-[120px] justify-end">
          {hasNext && (
            <button
              onClick={() => onNavigate(current + 1)}
              className="text-right text-white/80 hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
            >
              <div className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-white/50">Next</div>
              <div className="text-[10px] md:text-base whitespace-nowrap">{brands[current + 1].name} →</div>
            </button>
          )}
        </div>
      </div>

      {/* Side arrows */}
      {hasPrev && (
        <button
          onClick={() => onNavigate(current - 1)}
          aria-label="Previous project"
          className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/60 transition-colors flex items-center justify-center text-2xl"
        >
          ‹
        </button>
      )}
      {hasNext && (
        <button
          onClick={() => onNavigate(current + 1)}
          aria-label="Next project"
          className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/60 transition-colors flex items-center justify-center text-2xl"
        >
          ›
        </button>
      )}

      {/* Clip rail — smaller thumbnails on mobile */}
      <div className="group/rail absolute right-3 md:right-6 bottom-16 md:bottom-20 z-20 flex flex-col items-end gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <span className="text-white/50 text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-right pr-1">
          Films
        </span>
        <div
          data-lenis-prevent
          className="flex flex-col items-end gap-2 md:gap-3 max-h-[12rem] md:max-h-[17rem] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_bottom,transparent,black_9%,black_80%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_9%,black_80%,transparent)]"
        >
          {clips.map((clip, i) => (
            <button
              key={clip.src + i}
              onClick={() => setSelectedVideo(clip.src)}
              className="group flex shrink-0 items-center gap-1.5 md:gap-2 text-right"
            >
              <span
                className={`hidden md:block max-w-[130px] truncate text-xs transition-colors ${
                  selectedVideo === clip.src ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                }`}
              >
                {clip.title}
              </span>
              {/* Thumbnail: 80px on mobile, 128px on md+ */}
              <span
                className={`relative w-20 md:w-32 aspect-video rounded-md overflow-hidden border transition-colors ${
                  selectedVideo === clip.src ? 'border-blue-accent' : 'border-white/20 group-hover:border-white/50'
                }`}
              >
                <ClipThumb src={clip.src} />
                <span
                  className={`absolute inset-0 transition-colors ${
                    selectedVideo === clip.src ? 'bg-blue-accent/10' : 'bg-black/30'
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
