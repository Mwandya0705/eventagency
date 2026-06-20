'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import BigFooter from '@/components/BigFooter'
import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false })

interface Project {
  id: number
  title: string
  category: string
  year: string
  image: string
  services: string[]
}

// 25 premium projects with prop data as requested by the user
const allProjects: Project[] = [
  { id: 1, title: 'Powerade', category: 'College Football', year: '2025', image: '/images/portfolio-1.jpg', services: ['Production', 'Animation & VFX', 'Post-Production', 'Concept Development'] },
  { id: 2, title: 'Cleveland Browns', category: 'Show Open', year: '2025', image: '/images/portfolio-2.jpg', services: ['Production', 'Animation & VFX', 'Post-Production', 'Concept Development'] },
  { id: 3, title: 'Baller League', category: 'USA Release Teaser', year: '2025', image: '/images/portfolio-3.jpg', services: ['Production', 'Concept Development'] },
  { id: 4, title: 'Warner Bros', category: 'Superman FOOH', year: '2025', image: '/images/portfolio-4.jpg', services: ['Animation & VFX', 'Concept Development'] },
  { id: 5, title: 'USC', category: 'Show Open', year: '2024', image: '/images/portfolio-5.jpg', services: ['Production', 'Post-Production'] },
  { id: 6, title: 'Fanatics', category: 'ONE Launch', year: '2025', image: '/images/portfolio-6.jpg', services: ['Production', 'Animation & VFX', 'Concept Development'] },
  { id: 7, title: 'NBA', category: 'All-Star Campaign', year: '2024', image: '/images/portfolio-7.jpg', services: ['Production', 'Concept Development'] },
  { id: 8, title: 'NFL', category: 'Playoffs Promo', year: '2024', image: '/images/portfolio-8.jpg', services: ['Animation & VFX', 'Post-Production'] },
  { id: 9, title: 'Celsius', category: 'Live Fit Campaign', year: '2025', image: '/images/portfolio-9.jpg', services: ['Production', 'Post-Production', 'Concept Development'] },
  { id: 10, title: 'Mercedes-Benz', category: 'AMG GT Launch', year: '2025', image: '/images/card-1.jpg', services: ['Production', 'Animation & VFX', 'Post-Production'] },
  { id: 11, title: 'BMW', category: 'M-Series Track Day', year: '2025', image: '/images/card-2.jpg', services: ['Production', 'Concept Development'] },
  { id: 12, title: 'Audi', category: 'e-tron Premiere', year: '2024', image: '/images/card-3.jpg', services: ['Animation & VFX', 'Concept Development'] },
  { id: 13, title: 'Red Bull', category: 'Cliff Diving VR', year: '2025', image: '/images/card-4.jpg', services: ['Production', 'Post-Production'] },
  { id: 14, title: 'Gatorade', category: 'Sweat the Details', year: '2025', image: '/images/card-5.jpg', services: ['Production', 'Concept Development', 'Post-Production'] },
  { id: 15, title: 'Nike', category: 'Air Max Day', year: '2025', image: '/images/card-6.jpg', services: ['Animation & VFX', 'Production'] },
  { id: 16, title: 'Adidas', category: 'Speedportal Commercial', year: '2024', image: '/images/portfolio-1.jpg', services: ['Production', 'Post-Production'] },
  { id: 17, title: 'Porsche', category: '911 GT3 RS Reveal', year: '2025', image: '/images/portfolio-2.jpg', services: ['Production', 'Animation & VFX'] },
  { id: 18, title: 'Beats by Dre', category: 'Solo 4 Campaign', year: '2024', image: '/images/portfolio-3.jpg', services: ['Animation & VFX', 'Post-Production'] },
  { id: 19, title: 'EA Sports', category: 'FC 25 Teaser', year: '2025', image: '/images/portfolio-4.jpg', services: ['Production', 'Concept Development', 'Post-Production'] },
  { id: 20, title: 'Activision', category: 'Call of Duty FOOH', year: '2024', image: '/images/portfolio-5.jpg', services: ['Animation & VFX', 'Concept Development'] },
  { id: 21, title: 'Netflix', category: 'Stranger Things Promo', year: '2025', image: '/images/portfolio-6.jpg', services: ['Production', 'Post-Production'] },
  { id: 22, title: 'Prime Video', category: 'Fallout Series Open', year: '2024', image: '/images/portfolio-7.jpg', services: ['Animation & VFX', 'Concept Development', 'Post-Production'] },
  { id: 23, title: 'Sony', category: 'PlayStation 5 Pro', year: '2025', image: '/images/portfolio-8.jpg', services: ['Production', 'Animation & VFX'] },
  { id: 24, title: 'Pepsi', category: 'UEFA Champions League', year: '2025', image: '/images/portfolio-9.jpg', services: ['Production', 'Post-Production', 'Concept Development'] },
  { id: 25, title: 'Paramount+', category: 'Halo Season 2', year: '2024', image: '/images/card-1.jpg', services: ['Animation & VFX', 'Post-Production'] },
]

export default function PortfolioPage() {
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState('All')
  const [selectedClient, setSelectedClient] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')

  // Dropdown open states
  const [serviceOpen, setServiceOpen] = useState(false)
  const [clientOpen, setClientOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const worksSectionRef = useRef<HTMLDivElement>(null)

  // Curated lists for filters
  const services = ['All', 'Production', 'Animation & VFX', 'Post-Production', 'Concept Development']
  const years = ['All', '2025', '2024']
  const clients = ['All', ...Array.from(new Set(allProjects.map((p) => p.title))).sort()]

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServiceOpen(false)
        setClientOpen(false)
        setYearOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter projects based on user input
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesService = selectedService === 'All' || project.services.includes(selectedService)
    const matchesClient = selectedClient === 'All' || project.title === selectedClient
    const matchesYear = selectedYear === 'All' || project.year === selectedYear

    return matchesSearch && matchesService && matchesClient && matchesYear
  })

  // IntersectionObserver scroll-entrance animations (no GSAP dependency)
  useEffect(() => {
    const section = worksSectionRef.current
    if (!section) return

    const elements = section.querySelectorAll('.animate-work-item')
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = '0'
        ; (el as HTMLElement).style.transform = 'translateY(40px)'
        ; (el as HTMLElement).style.transition = 'opacity 0.7s ease, transform 0.7s ease'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              ; (entry.target as HTMLElement).style.opacity = '1'
                ; (entry.target as HTMLElement).style.transform = 'translateY(0)'
            }, i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [viewMode, searchQuery, selectedService, selectedClient, selectedYear])

  return (
    <div className="bg-[#0a0a1a] text-white min-h-screen selection:bg-blue-accent selection:text-white">
      <Navbar />

      {/* Hero Section — Blue gradient, PORTFOLIO text & 3D model */}
      <section className="relative h-[85vh] min-h-[640px] w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(10,10,26,0) 55%, #0a0a1a 100%), linear-gradient(165deg, #2b7fff 0%, #1a6dff 18%, #0d4fd8 38%, #0a2a8a 60%, #071a4d 80%, #0a0a1a 100%)' }}
      >
        {/* Radial highlight at top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(80,160,255,0.35),transparent)] pointer-events-none z-0" />

        {/* Giant PORTFOLIO text — sits high near the navbar, taller on large screens */}
        <div className="absolute top-[31vh] lg:top-[22vh] left-1/2 -translate-x-1/2 w-full px-4 sm:px-8 text-center pointer-events-none select-none z-10">
          <h1
            className="font-display font-black uppercase leading-none tracking-tighter text-white/95 w-full"
            style={{ fontSize: 'clamp(40px, 22vw, 560px)', letterSpacing: '-0.05em' }}
          >
            PORTFOLIO
          </h1>
        </div>

        {/* 3D Model Container — fills most of the hero, leaving only room for the two bottom labels */}
        <div className="absolute top-[7vh] bottom-[7vh] left-1/2 -translate-x-1/2 w-full max-w-4xl z-20 pointer-events-none">
          <div className="w-full h-full pointer-events-auto">
            {mounted && (
              <ModelViewer
                modelPath="/models/squid_game_-_worker.glb"
                height="100%"
                modelReady={true}
              />
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 whitespace-nowrap text-[10px] sm:text-xs font-mono tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/80 animate-pulse">
            <span aria-hidden>⇅</span>
            <span>Scroll For More</span>
            <span aria-hidden>⇅</span>
          </div>
        </div>
      </section>

      {/* Middle Part: Works Layout — full width */}
      <section className="relative w-full px-6 md:px-12 py-24 z-30">

        {/* Filter & View Toolbar (Image 2 style) */}
        <div
          ref={dropdownRef}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-16"
        >
          {/* Left Side: View Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase font-mono tracking-widest text-white/40">View</span>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg p-1">
              {/* Single Card View Icon */}
              <button
                onClick={() => setViewMode('card')}
                aria-label="Card View"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'card' ? 'bg-blue-accent text-white' : 'text-white/40 hover:text-white/80'
                  }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>

              {/* List View Icon */}
              <button
                onClick={() => setViewMode('list')}
                aria-label="List View"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-accent text-white' : 'text-white/40 hover:text-white/80'
                  }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Grid View Icon */}
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-accent text-white' : 'text-white/40 hover:text-white/80'
                  }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side: Search & Multi-dropdown Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                width="15"
                height="15"
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
                className="w-full sm:w-56 bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-accent/60 transition-colors"
              />
            </div>

            {/* Dropdown filters */}
            <div className="flex items-center gap-2">

              {/* Service Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setServiceOpen(!serviceOpen); setClientOpen(false); setYearOpen(false) }}
                  className={`px-4 py-2 border rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${selectedService !== 'All'
                    ? 'border-blue-accent bg-blue-accent/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
                    }`}
                >
                  <span>{selectedService === 'All' ? 'Service' : selectedService}</span>
                  <span className={`transition-transform duration-200 ${serviceOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {serviceOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-gray-dark border border-white/10 rounded-lg shadow-2xl z-50 py-1 font-mono text-[10px] md:text-xs">
                    {services.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSelectedService(s); setServiceOpen(false) }}
                        className={`w-full text-left px-4 py-2 hover:bg-white/5 transition-colors ${selectedService === s ? 'text-blue-accent font-bold' : 'text-white/60'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setClientOpen(!clientOpen); setServiceOpen(false); setYearOpen(false) }}
                  className={`px-4 py-2 border rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${selectedClient !== 'All'
                    ? 'border-blue-accent bg-blue-accent/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
                    }`}
                >
                  <span>{selectedClient === 'All' ? 'Client' : selectedClient}</span>
                  <span className={`transition-transform duration-200 ${clientOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {clientOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 max-h-60 overflow-y-scroll bg-gray-dark border border-white/10 rounded-lg shadow-2xl z-50 py-1 font-mono text-[10px] md:text-xs scrollbar-thin">
                    {clients.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setSelectedClient(c); setClientOpen(false) }}
                        className={`w-full text-left px-4 py-2 hover:bg-white/5 transition-colors ${selectedClient === c ? 'text-blue-accent font-bold' : 'text-white/60'
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setYearOpen(!yearOpen); setServiceOpen(false); setClientOpen(false) }}
                  className={`px-4 py-2 border rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${selectedYear !== 'All'
                    ? 'border-blue-accent bg-blue-accent/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
                    }`}
                >
                  <span>{selectedYear === 'All' ? 'Year' : selectedYear}</span>
                  <span className={`transition-transform duration-200 ${yearOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {yearOpen && (
                  <div className="absolute right-0 mt-1.5 w-28 bg-gray-dark border border-white/10 rounded-lg shadow-2xl z-50 py-1 font-mono text-[10px] md:text-xs">
                    {years.map((y) => (
                      <button
                        key={y}
                        onClick={() => { setSelectedYear(y); setYearOpen(false) }}
                        className={`w-full text-left px-4 py-2 hover:bg-white/5 transition-colors ${selectedYear === y ? 'text-blue-accent font-bold' : 'text-white/60'
                          }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Works Content Grid/List/Card */}
        <div ref={worksSectionRef} className="space-y-4">

          {/* 1. SINGLE CARD VIEW (Matches Image 2 layout) */}
          {viewMode === 'card' && (
            <div className="flex flex-col gap-24">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="animate-work-item group relative grid grid-cols-12 gap-4 items-center border-b border-white/5 pb-20 last:border-b-0"
                >
                  {/* Left Column: Index */}
                  <div className="col-span-12 md:col-span-1 flex items-start md:h-full">
                    <span className="font-mono text-xs text-white/30 tracking-widest mt-1">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Middle Column: Large image */}
                  <div className="col-span-12 md:col-span-7">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-dark border border-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Right Column: Project details */}
                  <div className="col-span-12 md:col-span-4 flex flex-col justify-center gap-5 md:pl-6 relative">
                    {/* Top right Year absolute indicator */}
                    <span className="absolute top-0 right-0 font-mono text-xs text-white/50 tracking-wider">
                      {project.year}
                    </span>

                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-display text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-none">
                        {project.title}
                      </h3>
                      <span className="text-sm font-semibold text-blue-accent tracking-wide uppercase">
                        {project.category}
                      </span>
                    </div>

                    {/* Services/Tags pills */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.services.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] text-white/70 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. LIST VIEW (Sleek rows) */}
          {viewMode === 'list' && (
            <div className="flex flex-col border-t border-white/10">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="animate-work-item group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-white/10 hover:bg-white/[0.02] px-4 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[10px] text-white/30 tracking-wider w-8">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-xl font-bold uppercase tracking-wide text-white group-hover:text-blue-accent transition-colors">
                      {project.title}
                    </span>
                    <span className="text-xs text-white/50 hidden sm:inline">— {project.category}</span>
                  </div>

                  <div className="flex items-center gap-6 mt-3 sm:mt-0 justify-between sm:justify-end">
                    <div className="flex gap-1.5 flex-wrap">
                      {project.services.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[8px] text-white/50 uppercase tracking-widest"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-xs text-white/60 tracking-wider">
                      {project.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. GRID VIEW (Modern columns) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="animate-work-item group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-dark border border-white/5 cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Top indicators */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-blue-accent text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-1 rounded">
                      {project.category}
                    </span>
                    <span className="text-white/60 font-mono text-xs font-medium">
                      {project.year}
                    </span>
                  </div>

                  {/* Bottom details */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2 z-10">
                    <span className="font-mono text-[10px] text-white/40 tracking-wider">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-2xl font-black uppercase text-white tracking-wide leading-none">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.services.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="text-[8px] font-mono text-white/70 bg-white/10 px-2 py-0.5 rounded uppercase tracking-wider"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Results Screen */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-xl">
              <svg
                className="w-12 h-12 mx-auto text-white/20 mb-4 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <p className="text-white/40 text-sm font-medium tracking-wide">
                No projects matched your criteria.
              </p>
            </div>
          )}

        </div>

      </section>

      {/* Footer Section */}
      <BigFooter />
    </div>
  )
}
