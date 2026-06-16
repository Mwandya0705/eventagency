'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'

interface Car {
  name: string
  tagline: string
  cover: string
  video: string
}

// Sequence: Mercedes → BMW → Lamborghini → Ferrari → Tesla → Toyota
const cars: Car[] = [
  {
    name: 'Mercedes-Benz',
    tagline: 'The Best or Nothing',
    cover: '/images/mercedes-benz-cover.png',
    video: '/videos/mercedes.mp4',
  },
  {
    name: 'BMW',
    tagline: 'The Ultimate Driving Machine',
    cover: '/images/bmw-cover.png',
    video: '/videos/bmw.mp4',
  },
  {
    name: 'Lamborghini',
    tagline: 'Beyond the Concept of Speed',
    cover: '/images/lamborghini-cover.png',
    video: '/videos/lamborghini.mp4',
  },
  {
    name: 'Ferrari',
    tagline: 'We Are the Competition',
    cover: '/images/ferrari-cover.png',
    video: '/videos/ferari.mp4',
  },
  {
    name: 'Tesla',
    tagline: 'Accelerating the Future',
    cover: '/images/tesla-cover.png',
    video: '/videos/tesla.mp4',
  },
  {
    name: 'Toyota',
    tagline: "Let's Go Places",
    cover: '/images/toyota-cover.png',
    video: '/videos/toyota.mp4',
  },
]

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  // Flat list of panels in scroll order: [cover0, video0, cover1, video1, ...]
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  // Preload the cover images so the splash can hand off cleanly.
  useEffect(() => {
    const promises = cars.map(
      (c) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = c.cover
        })
    )
    Promise.all(promises).then(() => setImagesReady(true))
  }, [])

  // Play a car's video when its panel scrolls into view; reset it on the way out.
  useEffect(() => {
    if (!loaded) return
    const root = scrollRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('video')
          if (!video) return
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            video.currentTime = 0
            video.play().catch(() => {})
          } else {
            video.pause()
            video.currentTime = 0
          }
        })
      },
      { root, threshold: [0, 0.6, 1] }
    )

    sectionsRef.current.forEach((section) => {
      if (section?.dataset.type === 'video') observer.observe(section)
    })

    return () => observer.disconnect()
  }, [loaded])

  // When a video finishes, advance to the next car's cover panel.
  const handleVideoEnded = (carIndex: number) => {
    const nextCover = sectionsRef.current[carIndex * 2 + 2]
    nextCover?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {!loaded && (
        <LoadingScreen ready={imagesReady} onComplete={() => setLoaded(true)} />
      )}

      <Navbar />

      <div
        ref={scrollRef}
        data-lenis-prevent
        className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {cars.map((car, i) => (
          <Fragment key={car.name}>
            {/* Cover panel */}
            <section
              ref={(el) => {
                sectionsRef.current[i * 2] = el
              }}
              data-type="cover"
              className="relative h-screen w-screen snap-start snap-always overflow-hidden"
            >
              <img
                src={car.cover}
                alt={car.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />

              <div className="absolute bottom-28 left-6 md:left-12 max-w-3xl">
                <span className="text-blue-accent text-xs md:text-sm font-medium uppercase tracking-[0.3em]">
                  {`0${i + 1} / 0${cars.length}`}
                </span>
                <h2 className="font-display text-[14vw] md:text-[8vw] font-bold uppercase text-white leading-[0.85] mt-2">
                  {car.name}
                </h2>
                <p className="text-gray-light text-base md:text-xl mt-3">{car.tagline}</p>
              </div>

              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-[10px] md:text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2 animate-bounce">
                <span>Scroll</span>
                <span className="text-lg leading-none">↓</span>
              </div>
            </section>

            {/* Video panel */}
            <section
              ref={(el) => {
                sectionsRef.current[i * 2 + 1] = el
              }}
              data-type="video"
              className="relative h-screen w-screen snap-start snap-always overflow-hidden bg-black"
            >
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={car.video}
                muted
                playsInline
                preload="metadata"
                onEnded={() => handleVideoEnded(i)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-28 left-6 md:left-12">
                <span className="text-blue-accent text-xs md:text-sm font-medium uppercase tracking-[0.3em]">
                  Now Playing
                </span>
                <h3 className="font-display text-[10vw] md:text-[5vw] font-bold uppercase text-white/90 leading-none mt-2">
                  {car.name}
                </h3>
              </div>
            </section>
          </Fragment>
        ))}
      </div>

      <Footer />
    </>
  )
}
