'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false })

export default function BigFooter() {
  return (
    <footer className="relative text-white overflow-hidden border-t border-white/10"
      style={{ background: 'linear-gradient(180deg, #06153d 0%, #0a2a8a 40%, #0d4fd8 80%, #1a6dff 100%)' }}
    >
      {/* ── 3D Model section — positioned like the keychain in the inspiration ── */}
      <div className="relative w-full flex flex-col items-center pt-16 pb-0">
        {/* PAMEDIA big outline text behind the model */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none">
          <span
            className="font-display font-black uppercase tracking-tighter text-white"
            style={{ fontSize: 'clamp(60px, 12vw, 180px)', opacity: 0.12, letterSpacing: '-0.04em' }}
          >
            PAMEDIA
          </span>
        </div>

        {/* Model container — tall like the keychain, centered */}
        <div className="relative z-10 w-full max-w-lg" style={{ height: '72vh' }}>
          <ModelViewer
            modelPath="/models/squid_game_-_worker.glb"
            height="100%"
            modelReady={true}
          />
        </div>
      </div>

      {/* ── Links & copyright ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-12 z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-24 border-t border-white/15 pt-10">

          {/* Left: Brand & Locations */}
          <div className="flex flex-col gap-6 lg:max-w-md">
            <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
              PAMEDIA
            </h2>
            <div className="flex flex-col gap-3 text-xs font-medium">
              <div className="flex items-center gap-3 text-white/60">
                <span>Based In</span>
                <span className="text-white/80">→</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['NYC', 'LA', 'MIA'].map((city) => (
                    <span
                      key={city}
                      className="border border-white/20 rounded-full px-3 py-1 font-mono text-[10px] text-white bg-white/10 tracking-wider uppercase"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <span>Available Worldwide</span>
                <span className="text-white/80">→</span>
                <div className="w-7 h-7 border border-white/20 rounded-full flex items-center justify-center bg-white/10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Nav Grid */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24 lg:gap-32">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide">Home</Link>
              <Link href="/portfolio" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide">Work</Link>
              <Link href="/about" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide">About us</Link>
              <Link href="/contact" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide">Contact</Link>
            </div>
            <div className="flex flex-col gap-4">
              <a href="https://instagram.com/thiswaspamedia" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group">
                Instagram <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <a href="https://tiktok.com/@thiswaspamedia" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group">
                TikTok <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <a href="https://linkedin.com/company/pamedia" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group">
                LinkedIn <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <a href="mailto:contact@pamedia.com" className="text-white/60 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group">
                Email <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-white/40 font-mono tracking-wider">
          <span>@ 2026 Pamedia Media Agency, All Rights Reserved</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Services</span>
            <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
          </div>
          <span className="text-white/50">
            thiswaspamedia® <span className="text-white/30">Site by</span>{' '}
            <a href="https://wearestokt.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-white/50">Stökt</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
