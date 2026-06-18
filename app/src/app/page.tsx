'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import ProjectView, { type Brand } from '@/components/ProjectView'
import { storageUrl } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// All video / image paths point to Supabase Storage (CDN, no Vercel size cap)
// ---------------------------------------------------------------------------
const brands: Brand[] = [
  {
    name: 'Mercedes-Benz',
    category: 'Luxury Sedan',
    year: '2025',
    cover: storageUrl('images', 'mercedes-coverphoto.png'),
    video: storageUrl('videos', 'mercedes-cover.mp4'),
    videos: [
      { src: storageUrl('videos', 'mercedes-amg-gt-2024.mp4'), title: '2024 AMG GT Commercial' },
      { src: storageUrl('videos', 'mercedes-amg-drift.mp4'),   title: 'The Drift of a Lifetime' },
      { src: storageUrl('videos', 'mercedes-s-class-2021-compressed.mp4'), title: 'The 2021 S-Class' },
      { src: storageUrl('videos', 'mercedes-g-class.mp4'),     title: 'The G-Class Experience' },
      { src: storageUrl('videos', 'mercedes-cls-trailer.mp4'), title: 'CLS 2018 Premiere Trailer' },
    ],
  },
  {
    name: 'BMW',
    category: 'Sport Series',
    year: '2025',
    cover: storageUrl('images', 'bmw-coverphoto.png'),
    video: storageUrl('videos', 'bmw-cover.mp4'),
    videos: [
      { src: storageUrl('videos', 'bmw-m4.mp4'),        title: 'The New BMW M4' },
      { src: storageUrl('videos', 'bmw-x5.mp4'),        title: 'BMW X5' },
      { src: storageUrl('videos', 'bmw-i7.mp4'),        title: 'The BMW i7' },
      { src: storageUrl('videos', 'bmw-5-series.mp4'),  title: 'The BMW 5 Series' },
      { src: storageUrl('videos', 'bmw-3-series.mp4'),  title: 'BMW 3 Series' },
    ],
  },
  {
    name: 'Lamborghini',
    category: 'Supercar',
    year: '2025',
    cover: storageUrl('images', 'lamborghini-coverphoto.png'),
    video: storageUrl('videos', 'lamborghini-cover.mp4'),
    videos: [
      { src: storageUrl('videos', 'lambo-revuelto.mp4'),      title: 'Lamborghini Revuelto' },
      { src: storageUrl('videos', 'lambo-aventador-s.mp4'),   title: 'Aventador S' },
      { src: storageUrl('videos', 'lambo-huracan.mp4'),       title: 'Huracán' },
      { src: storageUrl('videos', 'lambo-huracan-2.mp4'),     title: 'The Huracán' },
      { src: storageUrl('videos', 'lambo-urus.mp4'),          title: 'Urus' },
      { src: storageUrl('videos', 'lambo-gallardo-lp560-compressed.mp4'), title: 'Gallardo LP560-4' },
    ],
  },
  {
    name: 'Ferrari',
    category: 'Grand Tourer',
    year: '2025',
    cover: storageUrl('images', 'ferrari-coverphoto.png'),
    video: storageUrl('videos', 'ferrari-cover.mp4'),
    videos: [
      { src: storageUrl('videos', 'ferrari-purosangue.mp4'), title: 'Ferrari Purosangue' },
      { src: storageUrl('videos', 'ferrari-sf90.mp4'),       title: 'SF90 Stradale' },
      { src: storageUrl('videos', 'ferrari-296-gtb.mp4'),    title: 'Ferrari 296 GTB' },
      { src: storageUrl('videos', 'ferrari-roma.mp4'),       title: 'The New Ferrari Roma' },
    ],
  },
  {
    name: 'Tesla',
    category: 'Electric',
    year: '2025',
    cover: storageUrl('images', 'tesla-coverphoto.png'),
    video: storageUrl('videos', 'tesla-cover.mp4'),
    videos: [
      { src: storageUrl('videos', 'tesla-roadster.mp4'),   title: 'Tesla Roadster' },
      { src: storageUrl('videos', 'tesla-cybertruck.mp4'), title: 'Cybertruck' },
      { src: storageUrl('videos', 'tesla-model-y.mp4'),    title: 'The New Model Y' },
      { src: storageUrl('videos', 'tesla-semi.mp4'),        title: 'Tesla Semi' },
    ],
  },
  {
    name: 'Toyota',
    category: 'Everyday',
    year: '2025',
    cover: storageUrl('images', 'toyota-coverphoto.png'),
    video: storageUrl('videos', 'toyota-cover.mp4'),
    videos: [
      { src: storageUrl('videos', 'toyota-gr-supra-compressed.mp4'), title: 'Toyota GR Supra' },
      { src: storageUrl('videos', 'toyota-land-cruiser.mp4'), title: 'Land Cruiser' },
      { src: storageUrl('videos', 'toyota-crown.mp4'),        title: 'Toyota Crown' },
      { src: storageUrl('videos', 'toyota-tacoma.mp4'),       title: 'Toyota Tacoma' },
    ],
  },
]

const N = brands.length
const COVER_HOLD_MS = 1100
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

  // Scroll snaps to the next brand
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

  // On each brand: show cover, then autoplay video
  useEffect(() => {
    if (!loaded) return
    videoRefs.current.forEach((v) => {
      if (v) { v.pause(); v.currentTime = 0 }
    })
    setCoverVisible(true)
    const timer = setTimeout(() => {
      setCoverVisible(false)
      if (projectRef.current !== null) return
      const v = videoRefs.current[active]
      if (v) { v.currentTime = 0; v.play().catch(() => {}) }
    }, COVER_HOLD_MS)
    return () => clearTimeout(timer)
  }, [active, loaded])

  // Pause landing video when project opens; resume on return
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

  // Custom cursor
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
    if (cursorModeRef.current === 'view') setProject(activeRef.current)
  }

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
          /* Use 100dvh so mobile browser chrome is excluded */
          className="relative h-[100dvh] w-screen overflow-y-scroll snap-y snap-mandatory bg-black cursor-none [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Pinned stage */}
          <div className="fixed inset-0 z-10 overflow-hidden" style={{ height: '100dvh' }}>
            {brands.map((b, i) => (
              <div
                key={b.name}
                className="absolute inset-0 transition-opacity duration-700 ease-out"
                style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 2 : 1 }}
              >
                <video
                  ref={(el) => { videoRefs.current[i] = el }}
                  src={b.video}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-contain object-center bg-black"
                />
                {/* Cover photo fades to reveal video */}
                <div
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-700 ease-out"
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

              {/* Center brand label */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4 transition-opacity duration-500 ease-out"
                style={{ opacity: coverVisible ? 1 : 0 }}
              >
                {/* Responsive font: very small on xs, larger on md+ */}
                <h1 className="font-display text-[11vw] sm:text-[10vw] md:text-[9vw] font-bold uppercase text-white leading-[0.85] drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
                  {brands[active].name}
                </h1>
                <div className="mt-3 flex items-center justify-center gap-2 text-white/70 text-[9px] md:text-xs uppercase tracking-[0.3em]">
                  <span className="text-base leading-none">⇅</span> Scroll
                </div>
              </div>

              <span className="absolute bottom-28 left-4 md:left-12 text-white/80 text-xs md:text-base">
                {brands[active].category}
              </span>
              <span className="absolute bottom-28 right-4 md:right-12 text-white/80 text-xs md:text-base tabular-nums">
                {brands[active].year}
              </span>
            </div>

            {/* Brand strip — top on mobile, bottom on desktop */}
            <div className="absolute z-30 left-4 right-4 md:left-12 md:right-12 top-16 bottom-auto lg:top-auto lg:bottom-14">
              {/* Active brand name (mobile only) */}
              <div className="lg:hidden mb-2 text-center text-white/80 text-[10px] uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {brands[active].name}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {brands.map((b, j) => (
                  <button
                    key={b.name}
                    onClick={(e) => { e.stopPropagation(); goToBrand(j) }}
                    aria-label={`Show ${b.name}`}
                    /* min-h-[44px] ensures iOS tap-target guideline */
                    className="group flex-1 min-h-[44px] lg:min-h-0 lg:py-1 flex items-center"
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

          {/* Invisible scroll anchors */}
          {brands.map((b) => (
            <div key={b.name} className="h-[100dvh] w-full snap-start snap-always" />
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

      {/* Custom cursor label (desktop only) */}
      {loaded && project === null && (
        <div
          ref={cursorRef}
          className={`fixed left-0 top-0 z-[60] pointer-events-none hidden md:block transition-opacity duration-200 ${
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

      {/* Project view */}
      <ProjectView
        brands={brands}
        index={project}
        onClose={() => setProject(null)}
        onNavigate={(i) => setProject(i)}
      />
    </>
  )
}
