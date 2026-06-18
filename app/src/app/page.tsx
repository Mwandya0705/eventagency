'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import ProjectView, { type Brand } from '@/components/ProjectView'

// Sequence: Mercedes → BMW → Lamborghini → Ferrari → Tesla → Toyota
const brands: Brand[] = [
  {
    name: 'Mercedes-Benz',
    category: 'Luxury Sedan',
    year: '2025',
    cover: '/images/mercedes-benz-cover.png',
    video: '/videos/mercedes-cover.mp4',
    videos: [
      { src: '/videos/mercedes-amg-gt-2024.mp4', title: '2024 AMG GT Commercial' },
      { src: '/videos/mercedes-amg-drift.mp4', title: 'The Drift of a Lifetime' },
      { src: '/videos/mercedes-s-class-2021.mp4', title: 'The 2021 S-Class' },
      { src: '/videos/mercedes-g-class.mp4', title: 'The G-Class Experience' },
      { src: '/videos/mercedes-cls-trailer.mp4', title: 'CLS 2018 Premiere Trailer' },
    ],
  },
  {
    name: 'BMW',
    category: 'Sport Series',
    year: '2025',
    cover: '/images/bmw-cover.png',
    video: '/videos/bmw-cover.mp4',
    videos: [
      { src: '/videos/bmw-m4.mp4', title: 'The New BMW M4' },
      { src: '/videos/bmw-x5.mp4', title: 'BMW X5' },
      { src: '/videos/bmw-i7.mp4', title: 'The BMW i7' },
      { src: '/videos/bmw-5-series.mp4', title: 'The BMW 5 Series' },
      { src: '/videos/bmw-3-series.mp4', title: 'BMW 3 Series' },
    ],
  },
  {
    name: 'Lamborghini',
    category: 'Supercar',
    year: '2025',
    cover: '/images/lamborghini-cover.png',
    video: '/videos/lamborghini-cover.mp4',
    videos: [
      { src: '/videos/lambo-revuelto.mp4', title: 'Lamborghini Revuelto' },
      { src: '/videos/lambo-aventador-s.mp4', title: 'Aventador S' },
      { src: '/videos/lambo-huracan.mp4', title: 'Huracán' },
      { src: '/videos/lambo-huracan-2.mp4', title: 'The Huracán' },
      { src: '/videos/lambo-urus.mp4', title: 'Urus' },
      { src: '/videos/lambo-gallardo-lp560.mp4', title: 'Gallardo LP560-4' },
    ],
  },
  {
    name: 'Ferrari',
    category: 'Grand Tourer',
    year: '2025',
    cover: '/images/ferrari-cover.png',
    video: '/videos/ferrari-cover.mp4',
    videos: [
      { src: '/videos/ferrari-purosangue.mp4', title: 'Ferrari Purosangue' },
      { src: '/videos/ferrari-sf90.mp4', title: 'SF90 Stradale' },
      { src: '/videos/ferrari-296-gtb.mp4', title: 'Ferrari 296 GTB' },
      { src: '/videos/ferrari-roma.mp4', title: 'The New Ferrari Roma' },
    ],
  },
  {
    name: 'Tesla',
    category: 'Electric',
    year: '2025',
    cover: '/images/tesla-cover.png',
    video: '/videos/tesla-cover.mp4',
    videos: [
      { src: '/videos/tesla-roadster.mp4', title: 'Tesla Roadster' },
      { src: '/videos/tesla-cybertruck.mp4', title: 'Cybertruck' },
      { src: '/videos/tesla-model-y.mp4', title: 'The New Model Y' },
      { src: '/videos/tesla-semi.mp4', title: 'Tesla Semi' },
    ],
  },
  {
    name: 'Toyota',
    category: 'Everyday',
    year: '2025',
    cover: '/images/toyota-cover.png',
    video: '/videos/toyota-cover.mp4',
    videos: [
      { src: '/videos/toyota-gr-supra.mp4', title: 'Toyota GR Supra' },
      { src: '/videos/toyota-land-cruiser.mp4', title: 'Land Cruiser' },
      { src: '/videos/toyota-crown.mp4', title: 'Toyota Crown' },
      { src: '/videos/toyota-tacoma.mp4', title: 'Toyota Tacoma' },
    ],
  },
]

const N = brands.length
// How long the cover photo is shown before the video autoplays.
const COVER_HOLD_MS = 1100
// Top/bottom bands of the screen read as "Scroll"; the middle reads as "View Project".
const SCROLL_BAND = 0.3

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)
  const [active, setActive] = useState(0)
  const [coverVisible, setCoverVisible] = useState(true)
  const [project, setProject] = useState<number | null>(null)
  const [cursorActive, setCursorActive] = useState(false)
  const [cursorMode, setCursorMode] = useState<'view' | 'scroll'>('view')

  const scrollRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const activeRef = useRef(0)
  const projectRef = useRef<number | null>(null)
  projectRef.current = project
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorModeRef = useRef<'view' | 'scroll'>('view')
  const cursorActiveRef = useRef(false)

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
      if (projectRef.current !== null) return
      const v = videoRefs.current[active]
      if (v) {
        v.currentTime = 0
        v.play().catch(() => {})
      }
    }, COVER_HOLD_MS)
    return () => clearTimeout(timer)
  }, [active, loaded])

  // Pause the landing video while a project is open; resume on return.
  useEffect(() => {
    const v = videoRefs.current[active]
    if (!v) return
    if (project !== null) {
      v.pause()
    } else if (!coverVisible) {
      v.play().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  // Custom cursor: "View Project" in the middle, "Scroll" near top/bottom.
  const handleStageMouseMove = (e: React.MouseEvent) => {
    const yr = e.clientY / window.innerHeight
    const mode: 'view' | 'scroll' = yr < SCROLL_BAND || yr > 1 - SCROLL_BAND ? 'scroll' : 'view'
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    if (cursorModeRef.current !== mode) {
      cursorModeRef.current = mode
      setCursorMode(mode)
    }
    if (!cursorActiveRef.current) {
      cursorActiveRef.current = true
      setCursorActive(true)
    }
  }

  const hideCursor = () => {
    cursorActiveRef.current = false
    setCursorActive(false)
  }

  const handleStageClick = () => {
    if (cursorModeRef.current === 'view') {
      setProject(activeRef.current)
    }
  }

  // Tap a strip segment to jump to that brand (used on phones where scrolling is awkward).
  const goToBrand = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: i * el.clientHeight, behavior: 'smooth' })
  }

  return (
    <>
      {!loaded && (
        <LoadingScreen ready={imagesReady} onComplete={() => setLoaded(true)} />
      )}

      {/* Landing — slides left when a project opens */}
      <div
        className="transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: project !== null ? 'translateX(-100%)' : 'translateX(0)' }}
      >
        <div
          className={`transition-opacity duration-300 ${
            project !== null ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Navbar />
        </div>

        <div
          ref={scrollRef}
          data-lenis-prevent
          onMouseMove={loaded && project === null ? handleStageMouseMove : undefined}
          onMouseLeave={hideCursor}
          onClick={handleStageClick}
          className="relative h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black cursor-none [&::-webkit-scrollbar]:hidden"
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
                  className="absolute inset-0 w-full h-full object-cover object-center"
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

              {/* Center brand label: only while the cover photo shows */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6 transition-opacity duration-500 ease-out"
                style={{ opacity: coverVisible ? 1 : 0 }}
              >
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

            {/* Brand strip: top + tappable on phones (no scrolling), bottom on large screens.
                Each segment is clickable to jump straight to that brand. */}
            <div className="absolute z-30 left-6 right-6 md:left-12 md:right-12 top-20 bottom-auto lg:top-auto lg:bottom-14">
              {/* Which brand is playing (small screens only) */}
              <div className="lg:hidden mb-2 text-center text-white/80 text-[11px] uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {brands[active].name}
              </div>
              <div className="flex items-center gap-2">
                {brands.map((b, j) => (
                  <button
                    key={b.name}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToBrand(j)
                    }}
                    aria-label={`Show ${b.name}`}
                    className="group flex-1 py-2.5 lg:py-1"
                  >
                    <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/25 group-hover:bg-white/40 transition-colors">
                      <div
                        className="absolute inset-0 origin-left bg-blue-accent transition-transform duration-500 ease-out"
                        style={{ transform: j === active ? 'scaleX(1)' : 'scaleX(0)' }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Invisible snap anchors: one viewport of scroll per brand */}
          {brands.map((b) => (
            <div key={b.name} className="h-screen w-full snap-start snap-always" />
          ))}
        </div>

        <div
          className={`transition-opacity duration-300 ${
            project !== null ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Footer />
        </div>
      </div>

      {/* Custom cursor label */}
      {loaded && project === null && (
        <div
          ref={cursorRef}
          className={`fixed left-0 top-0 z-[60] pointer-events-none transition-opacity duration-200 ${
            cursorActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
            {cursorMode === 'view' ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                View Project
              </>
            ) : (
              <>
                <svg width="14" height="18" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="2" width="10" height="20" rx="5" />
                  <line x1="8" y1="6" x2="8" y2="10" />
                </svg>
                Scroll
              </>
            )}
          </div>
        </div>
      )}

      {/* Project view — slides in from the right */}
      <ProjectView
        brands={brands}
        index={project}
        onClose={() => setProject(null)}
        onNavigate={(i) => setProject(i)}
      />
    </>
  )
}
