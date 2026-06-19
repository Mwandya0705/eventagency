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
      {/* Main player — covers the screen (full-bleed) like the reference */}
      <video
        ref={videoRef}
        key={selectedVideo || 'none'}
        src={selectedVideo || undefined}
        controls
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center bg-black"
      />

      {/* Top gradient */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />

      {/* Bottom gradient for legibility over the controls/title */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/75 to-transparent pointer-events-none z-10" />

      {/* Back (top-left) */}
      <button
        onClick={onClose}
        className="absolute top-3 left-3 md:top-5 md:left-6 z-20 flex items-center gap-1.5 text-white/80 hover:text-white text-[10px] md:text-xs uppercase tracking-[0.2em] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
      >
        <span className="text-xl leading-none">←</span>
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Title · arrows · meta — lower-center, like the reference */}
      <div className="absolute bottom-20 md:bottom-24 inset-x-0 z-20 flex flex-col items-center gap-3 px-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-center gap-5 md:gap-8 w-full">
          <button
            onClick={() => hasPrev && onNavigate(current - 1)}
            aria-label="Previous project"
            disabled={!hasPrev}
            className={`text-3xl md:text-4xl leading-none transition-colors ${
              hasPrev ? 'text-white/80 hover:text-white' : 'text-white/0 pointer-events-none'
            }`}
          >
            ‹
          </button>
          <h2 className="font-display text-[12vw] md:text-5xl font-bold uppercase text-white tracking-wide leading-none text-center whitespace-nowrap">
            {brand.name}
          </h2>
          <button
            onClick={() => hasNext && onNavigate(current + 1)}
            aria-label="Next project"
            disabled={!hasNext}
            className={`text-3xl md:text-4xl leading-none transition-colors ${
              hasNext ? 'text-white/80 hover:text-white' : 'text-white/0 pointer-events-none'
            }`}
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-3 text-white/80 text-[11px] md:text-sm uppercase tracking-[0.25em]">
          <span>{brand.category}</span>
          <span className="w-10 md:w-20 h-px bg-white/40" />
          <span className="tabular-nums">{brand.year}</span>
        </div>
      </div>

      {/* Clip rail — vertical-center right so it stays clear of the title & controls */}
      <div className="group/rail absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
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
