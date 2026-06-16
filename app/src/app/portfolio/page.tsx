'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const filters = ['All', 'Production', 'Animation & VFX', 'Post-Production', 'Concept Development']

const allProjects = [
  { id: 1, title: 'Powerade', category: 'College Football', year: '2025', image: '/images/portfolio-1.jpg', services: ['Production', 'Animation & VFX', 'Post-Production', 'Concept Development'] },
  { id: 2, title: 'Cleveland Browns', category: 'Show Open', year: '2025', image: '/images/portfolio-2.jpg', services: ['Production', 'Animation & VFX', 'Post-Production', 'Concept Development'] },
  { id: 3, title: 'Baller League', category: 'USA Release Teaser', year: '2025', image: '/images/portfolio-3.jpg', services: ['Production', 'Concept Development'] },
  { id: 4, title: 'Warner Bros', category: 'Superman FOOH', year: '2025', image: '/images/portfolio-4.jpg', services: ['Animation & VFX', 'Concept Development'] },
  { id: 5, title: 'USC', category: 'Show Open', year: '2024', image: '/images/portfolio-5.jpg', services: ['Production', 'Post-Production'] },
  { id: 6, title: 'Fanatics', category: 'ONE Launch', year: '2025', image: '/images/portfolio-6.jpg', services: ['Production', 'Animation & VFX', 'Concept Development'] },
  { id: 7, title: 'NBA', category: 'All-Star Campaign', year: '2024', image: '/images/portfolio-7.jpg', services: ['Production', 'Concept Development'] },
  { id: 8, title: 'NFL', category: 'Playoffs Promo', year: '2024', image: '/images/portfolio-8.jpg', services: ['Animation & VFX', 'Post-Production'] },
  { id: 9, title: 'Celsius', category: 'Live Fit Campaign', year: '2025', image: '/images/portfolio-9.jpg', services: ['Production', 'Post-Production', 'Concept Development'] },
]

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredProjects = allProjects.filter((project) => {
    const matchesFilter = activeFilter === 'All' || project.services.includes(activeFilter)
    const matchesSearch =
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTitle = heroRef.current?.querySelector('h1')
      if (heroTitle) {
        gsap.fromTo(
          heroTitle,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
        )
      }

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.querySelectorAll('.project-card'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [activeFilter])

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[40vh] flex flex-col justify-end px-6 md:px-12 pb-8 pt-24"
      >
        <h1 className="font-display text-[12vw] md:text-[10vw] font-bold uppercase text-white leading-[0.85]">
          Portfolio
        </h1>
        <p className="text-gray-light mt-4 text-base">25 projects</p>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-40 px-6 md:px-12 py-4 bg-black/90 backdrop-blur-md border-b border-gray-mid/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-gray-mid hover:border-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-gray-dark border border-gray-mid rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-light focus:outline-none focus:border-blue-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <section className="px-6 md:px-12 py-12 pb-32">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute top-4 left-4">
                <span className="text-blue-accent text-xs font-medium uppercase tracking-wider">
                  {project.category}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-gray-light text-xs mb-1 block">#{index + 1}</span>
                <h3 className="text-white text-xl font-medium mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {project.services.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] text-white/70 bg-white/10 px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <span className="absolute top-4 right-4 text-gray-light text-xs">
                {project.year}
              </span>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-light text-lg">No projects found matching your criteria.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
