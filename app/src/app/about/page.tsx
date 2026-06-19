'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    no: '01',
    title: 'Concept Development',
    description:
      'Come to us with an idea — or even just a goal — and we build the entire creative vision from start to finish. From viral social moments to large-scale productions, we develop bold, strategic concepts that cut through the noise and deliver real impact.',
    features: [
      'Creative strategy',
      'Storyboarding',
      'Campaign direction',
      'Narrative development',
      'Moodboards',
      'Trend forecasting',
    ],
  },
  {
    no: '02',
    title: 'Production',
    description:
      'No matter the scale, we bring productions to life with precision. Backed by a network of top-tier creatives, we handle everything — crew, gear, logistics — so shoots run seamlessly from pre-production to final cut.',
    features: [
      'Commercial video production',
      'Studio & on-location photography',
      'Social content',
      'Talent casting',
      'Crew booking & gear sourcing',
      'Global production management',
    ],
  },
  {
    no: '03',
    title: 'Animation & VFX',
    description:
      'We don’t just enhance videos — we make them unforgettable. Using cutting-edge CGI and stunning visual effects, we bring incredible, lifelike worlds and imaginative visuals to life, pushing the limits of what’s possible.',
    features: [
      '3D animation',
      'Visual effects & compositing',
      'FOOH / mixed reality',
      'Product & location mockups',
      'Hand-drawn 2D animation',
      'AI-generated visuals',
    ],
  },
  {
    no: '04',
    title: 'Post-Production',
    description:
      'Whether you’re stepping in for the finish or handing us every clip, we keep the edit seamless and the turnaround quick — finishing your story with polish and precision.',
    features: [
      'Editing & storytelling',
      'Color grading',
      'Sound design & mix',
      'Motion graphics',
      'Quick-turn capture',
      'Final delivery & masters',
    ],
  },
  {
    no: '05',
    title: 'Social Media Management',
    description:
      'Content is only half the battle — momentum is the rest. We craft platform-native strategies, publish on cadence, and manage the community so your brand stays present, relevant, and impossible to scroll past.',
    features: [
      'Content strategy',
      'Channel management',
      'Community management',
      'Paid amplification',
      'Reporting & insights',
      'Always-on calendar',
    ],
  },
]

// Five columns of behind-the-scenes imagery (placeholders — swap with real BTS shots).
const galleryColumns = [
  ['/images/portfolio-1.jpg', '/images/card-1.jpg', '/images/portfolio-6.jpg', '/images/card-4.jpg', '/images/portfolio-9.jpg'],
  ['/images/card-2.jpg', '/images/portfolio-2.jpg', '/images/card-5.jpg', '/images/portfolio-7.jpg', '/images/card-6.jpg'],
  ['/images/portfolio-3.jpg', '/images/card-3.jpg', '/images/portfolio-8.jpg', '/images/portfolio-4.jpg', '/images/card-1.jpg'],
  ['/images/card-4.jpg', '/images/portfolio-5.jpg', '/images/card-2.jpg', '/images/portfolio-9.jpg', '/images/portfolio-3.jpg'],
  ['/images/portfolio-6.jpg', '/images/card-5.jpg', '/images/portfolio-1.jpg', '/images/card-3.jpg', '/images/portfolio-7.jpg'],
]

// Per-column vertical travel (% of column height). Center columns travel further so the
// grid rises into frame from the middle outward as the section is pinned.
const columnTravel = [
  { from: 10, to: -10 },
  { from: 18, to: -18 },
  { from: 26, to: -26 },
  { from: 18, to: -18 },
  { from: 10, to: -10 },
]

const Coin = () => (
  <span className="inline-flex items-center justify-center shrink-0 mx-8 md:mx-12 w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-accent shadow-[0_0_40px_rgba(59,91,255,0.6)]">
    <svg width="60%" height="60%" viewBox="0 0 32 32" fill="none" className="text-white">
      <path
        d="M16 2L18.5 12.5L29 15L18.5 17.5L16 28L13.5 17.5L3 15L13.5 12.5L16 2Z"
        fill="currentColor"
      />
    </svg>
  </span>
)

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutTextRef = useRef<HTMLDivElement>(null)
  const servicesScrollerRef = useRef<HTMLDivElement>(null)
  const btsRef = useRef<HTMLDivElement>(null)
  const btsTitleRef = useRef<HTMLHeadingElement>(null)
  const columnsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-in') || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )

      // About-text reveal on scroll
      if (aboutTextRef.current) {
        gsap.fromTo(
          aboutTextRef.current.querySelectorAll('.about-block'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: { trigger: aboutTextRef.current, start: 'top 75%' },
          }
        )
      }

      // Behind-the-scenes: parallax columns rise as the section is pinned
      if (btsRef.current) {
        gsap.fromTo(
          columnsRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: btsRef.current, start: 'top 60%' },
          }
        )

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: btsRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        })

        columnsRef.current.forEach((col, i) => {
          if (!col) return
          tl.fromTo(
            col,
            { yPercent: columnTravel[i].from },
            { yPercent: columnTravel[i].to, ease: 'none' },
            0
          )
        })

        // Title brightens then settles as imagery overtakes it
        tl.fromTo(
          btsTitleRef.current,
          { opacity: 1, scale: 1.04 },
          { opacity: 0.32, scale: 1, ease: 'none' },
          0
        )
      }
    })

    return () => ctx.revert()
  }, [])

  const scrollServices = (dir: number) => {
    const el = servicesScrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
      >
        <button className="hero-in flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
          </svg>
          Watch Reel
        </button>

        <h1 className="hero-in font-display font-bold uppercase leading-[0.85] tracking-tight text-[#d8e6ff] text-[24vw] md:text-[18vw]">
          Pamedia
        </h1>

        <div className="hero-in mt-10 max-w-2xl">
          <p className="text-lg md:text-2xl text-white leading-relaxed">
            <span className="font-semibold">Digital powerhouse creating the unskippable.</span>{' '}
            <span className="text-gray-light">
              We deliver versatile branded content, striking visuals, and refined storytelling.
              Built to hold attention and impossible to ignore.
            </span>
          </p>
        </div>
      </section>

      {/* About Us */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white">
            About Us
          </h2>
          <div ref={aboutTextRef} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8 about-block">
              <p className="text-white/90 leading-relaxed">
                Pamedia is a creative agency built to create momentum. We help brands move faster,
                think sharper, and show up with relevance through culture-shaping content and
                high-impact campaigns. Rooted in strategy, production, and execution, we work across
                the full creative spectrum to turn ideas into work that actually connects.
              </p>
              <p className="text-white/90 leading-relaxed about-block">
                As culture, platforms, and attention spans keep shifting, we adapt without losing
                focus. From brand strategy to production and launch, we design and execute work that
                meets the moment and pushes it forward. Stay flexible. Move fast. Make it matter.
              </p>
            </div>
            <div className="space-y-8 about-block">
              <p className="text-white/90 leading-relaxed">
                We believe momentum comes from people — the ones behind the work and the ones it’s
                made for. Our network of creatives, producers, and collaborators builds ideas that
                feel alive, timely, and human. We create content that travels and campaigns that
                resonate, not by chasing trends, but by understanding them.
              </p>
              <p className="text-white/90 leading-relaxed about-block">
                At our core, Pamedia is about commitment — to our clients, to the work, and to each
                other. We treat every brand like it’s our own and every challenge like it’s personal.
                Always moving. Always building. Always creating together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-10 border-y border-gray-mid/40 overflow-hidden">
        <div className="marquee-track items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center">
                  <span className="font-display font-bold uppercase text-[9vw] md:text-[7vw] leading-none text-white whitespace-nowrap">
                    Create. <span className="text-blue-accent">Move.</span> Accelerate
                  </span>
                  <Coin />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="px-6 md:px-12 py-24">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white">
            Services
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollServices(-1)}
              aria-label="Previous service"
              className="w-12 h-12 rounded-xl border border-gray-mid flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scrollServices(1)}
              aria-label="Next service"
              className="w-12 h-12 rounded-xl border border-gray-mid flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={servicesScrollerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 md:-mx-12 px-6 md:px-12"
          style={{ scrollbarWidth: 'none' }}
        >
          {services.map((service) => (
            <article
              key={service.no}
              className="snap-start shrink-0 w-[88vw] sm:w-[420px] bg-gray-dark/60 border border-gray-mid/60 rounded-2xl p-8 flex flex-col"
            >
              <div className="relative h-48 rounded-xl bg-gradient-to-br from-blue-accent/15 via-gray-mid/20 to-transparent flex items-center justify-center mb-8 overflow-hidden">
                <span className="font-display font-bold text-[7rem] leading-none text-white/5 select-none">
                  {service.no}
                </span>
                <span className="absolute inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-accent/90 shadow-[0_0_40px_rgba(59,91,255,0.5)]">
                  <svg width="50%" height="50%" viewBox="0 0 32 32" fill="none" className="text-white">
                    <path
                      d="M16 2L18.5 12.5L29 15L18.5 17.5L16 28L13.5 17.5L3 15L13.5 12.5L16 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </div>

              <h3 className="text-2xl font-medium text-white mb-3">{service.title}</h3>
              <p className="text-gray-light leading-relaxed mb-8">{service.description}</p>

              <ul className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-blue-accent shrink-0 mt-0.5"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Behind the Scenes — pinned, 5-column parallax gallery */}
      <section ref={btsRef} className="relative h-[280vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Giant title behind imagery */}
          <h2
            ref={btsTitleRef}
            className="absolute inset-0 flex items-center justify-center text-center font-display font-bold uppercase leading-[0.85] tracking-tight text-[#d8e6ff] text-[15vw] md:text-[13vw] z-0 pointer-events-none px-4"
          >
            Behind-the-Scenes
          </h2>

          {/* Columns */}
          <div className="absolute inset-0 z-10 flex gap-2 md:gap-3 px-2 md:px-3">
            {galleryColumns.map((col, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) columnsRef.current[i] = el
                }}
                className="flex-1 flex flex-col gap-2 md:gap-3 will-change-transform"
              >
                {col.map((src, j) => (
                  <div
                    key={j}
                    className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-mid"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-28 text-center">
        <h2 className="font-display text-4xl md:text-6xl font-bold uppercase text-white mb-6">
          Ready to create?
        </h2>
        <p className="text-gray-light mb-10 max-w-lg mx-auto">
          Let’s collaborate on your next project and make something unforgettable.
        </p>
        <a
          href="/contact"
          className="inline-block bg-white text-black px-10 py-4 rounded-full font-medium text-sm hover:bg-blue-accent hover:text-white transition-all duration-300"
        >
          Get in Touch
        </a>
      </section>

      <Footer />
    </div>
  )
}
