'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'

interface Brand {
  name: string
  category: string
  year: string
  cover: string
  video: string
}

// Sequence: Mercedes → BMW → Lamborghini → Ferrari → Tesla → Toyota
const brands: Brand[] = [
  { name: 'Mercedes-Benz', category: 'Luxury Sedan', year: '2025', cover: '/images/mercedes-benz-cover.png', video: '/videos/mercedes.mp4' },
  { name: 'BMW', category: 'Sport Series', year: '2025', cover: '/images/bmw-cover.png', video: '/videos/bmw.mp4' },
  { name: 'Lamborghini', category: 'Supercar', year: '2025', cover: '/images/lamborghini-cover.png', video: '/videos/lamborghini.mp4' },
  { name: 'Ferrari', category: 'Grand Tourer', year: '2025', cover: '/images/ferrari-cover.png', video: '/videos/ferari.mp4' },
  { name: 'Tesla', category: 'Electric', year: '2025', cover: '/images/tesla-cover.png', video: '/videos/tesla.mp4' },
  { name: 'Toyota', category: 'Everyday', year: '2025', cover: '/images/toyota-cover.png', video: '/videos/toyota.mp4' },
]

const N = brands.length
// Fraction of each brand's scroll segment spent on the cover before the video.
const COVER_HOLD = 0.16
const COVER_FADE_END = 0.34

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)
  const [active, setActive] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const coverRefs = useRef<(HTMLDivElement | null)[]>([])
  const fillRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeRef = useRef(0)

  // Preload cover images so the splash hands off cleanly.
  useEffect(() => {
    const promises = brands.map(
      (b) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = b.cover
        })
    )
    Promise.all(promises).then(() => setImagesReady(true))
  }, [])

  // Scroll drives the pinned stage: fill strips, fade cover, scrub the video.
  useEffect(() => {
    if (!loaded) return
    const el = containerRef.current
    if (!el) return

    let raf = 0

    const update = () => {
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? el.scrollTop / max : 0
      const seg = 1 / N
      const idx = Math.max(0, Math.min(N - 1, Math.floor(p / seg)))
      const lp = Math.max(0, Math.min(1, (p - idx * seg) / seg))

      // Segmented progress strips.
      fillRefs.current.forEach((f, j) => {
        if (!f) return
        const fill = j < idx ? 1 : j === idx ? lp : 0
        f.style.transform = `scaleX(${fill})`
      })

      // Cover sits on top of the video and fades out to reveal it.
      coverRefs.current.forEach((c, j) => {
        if (!c) return
        if (j !== idx) {
          c.style.opacity = '1'
          return
        }
        const o =
          lp <= COVER_HOLD
            ? 1
            : lp >= COVER_FADE_END
              ? 0
              : 1 - (lp - COVER_HOLD) / (COVER_FADE_END - COVER_HOLD)
        c.style.opacity = String(o)
      })

      // Scrub the active brand's video with the remaining scroll.
      const v = videoRefs.current[idx]
      if (v && v.duration) {
        const vp = lp <= COVER_HOLD ? 0 : (lp - COVER_HOLD) / (1 - COVER_HOLD)
        const t = Math.min(v.duration - 0.05, vp * v.duration)
        if (Math.abs(v.currentTime - t) > 0.03) {
          try {
            v.currentTime = t
          } catch {
            /* seeking before metadata is ready – ignore */
          }
        }
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx
        setActive(idx)
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [loaded])

  return (
    <>
      {!loaded && (
        <LoadingScreen ready={imagesReady} onComplete={() => setLoaded(true)} />
      )}

      <Navbar />

      <div
        ref={containerRef}
        data-lenis-prevent
        className="h-screen w-screen overflow-y-scroll bg-black [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Tall track gives scroll distance; the stage stays pinned. */}
        <div className="relative" style={{ height: `${N * 100}vh` }}>
          <div className="sticky top-0 h-screen w-screen overflow-hidden">
            {/* Brand layers: video with the cover photo stacked on top */}
            {brands.map((b, i) => (
              <div
                key={b.name}
                className="absolute inset-0 transition-opacity duration-700 ease-out"
                style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 10 : 0 }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                  src={b.video}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  ref={(el) => {
                    coverRefs.current[i] = el
                  }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${b.cover})` }}
                />
              </div>
            ))}

            {/* Foreground overlay (title / meta / hint) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6">
                <h1 className="font-display text-[16vw] md:text-[9vw] font-bold uppercase text-white leading-[0.85] drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
                  {brands[active].name}
                </h1>
                <div className="mt-4 flex items-center justify-center gap-2 text-white/70 text-[10px] md:text-xs uppercase tracking-[0.35em]">
                  <span className="text-base leading-none">⇅</span> Scroll
                </div>
              </div>

              <span className="absolute bottom-24 left-6 md:left-12 text-white/80 text-sm md:text-base">
                {brands[active].category}
              </span>
              <span className="absolute bottom-24 right-6 md:right-12 text-white/80 text-sm md:text-base tabular-nums">
                {brands[active].year}
              </span>
            </div>

            {/* Segmented progress strips */}
            <div className="absolute bottom-14 left-6 right-6 md:left-12 md:right-12 z-30 flex gap-2">
              {brands.map((b, j) => (
                <div
                  key={b.name}
                  className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
                >
                  <div
                    ref={(el) => {
                      fillRefs.current[j] = el
                    }}
                    className="absolute inset-0 origin-left bg-blue-accent"
                    style={{ transform: 'scaleX(0)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
