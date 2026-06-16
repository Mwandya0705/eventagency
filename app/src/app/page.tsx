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
// How long the cover photo is shown before the video autoplays.
const COVER_HOLD_MS = 1100

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)
  const [active, setActive] = useState(0)
  const [coverVisible, setCoverVisible] = useState(true)

  const scrollRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
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

  // A scroll moves to the next brand "at once" (snap by viewport).
  useEffect(() => {
    if (!loaded) return
    const el = scrollRef.current
    if (!el) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const idx = Math.max(0, Math.min(N - 1, Math.round(el.scrollTop / el.clientHeight)))
        if (idx !== activeRef.current) {
          activeRef.current = idx
          // Show the new brand's cover immediately (before its video autoplays).
          setCoverVisible(true)
          setActive(idx)
        }
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [loaded])

  // On each brand: show the cover, then autoplay its video from the start.
  useEffect(() => {
    if (!loaded) return
    videoRefs.current.forEach((v) => {
      if (v) {
        v.pause()
        v.currentTime = 0
      }
    })
    setCoverVisible(true)
    const timer = setTimeout(() => {
      setCoverVisible(false)
      const v = videoRefs.current[active]
      if (v) {
        v.currentTime = 0
        v.play().catch(() => {})
      }
    }, COVER_HOLD_MS)
    return () => clearTimeout(timer)
  }, [active, loaded])

  return (
    <>
      {!loaded && (
        <LoadingScreen ready={imagesReady} onComplete={() => setLoaded(true)} />
      )}

      <Navbar />

      <div
        ref={scrollRef}
        data-lenis-prevent
        className="relative h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Pinned stage — stays in place while the brand swaps */}
        <div className="fixed inset-0 z-10 overflow-hidden">
          {brands.map((b, i) => (
            <div
              key={b.name}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 2 : 1 }}
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
              {/* Cover photo shown first, then fades to reveal the video */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out"
                style={{
                  backgroundImage: `url(${b.cover})`,
                  opacity: i === active && coverVisible ? 1 : 0,
                }}
              />
            </div>
          ))}

          {/* Foreground overlay */}
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
                  className="absolute inset-0 origin-left bg-blue-accent transition-transform duration-500 ease-out"
                  style={{ transform: j === active ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Invisible snap anchors: one viewport of scroll per brand */}
        {brands.map((b) => (
          <div key={b.name} className="h-screen w-full snap-start snap-always" />
        ))}
      </div>

      <Footer />
    </>
  )
}
