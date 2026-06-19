'use client'

import Link from 'next/link'

export default function BigFooter() {
  return (
    <footer className="relative bg-black text-white pt-24 pb-12 px-6 md:px-12 overflow-hidden border-t border-white/5">
      {/* Background radial blue glow (matching premium aesthetic in screenshot) */}
      <div className="absolute bottom-0 left-0 right-0 h-[350px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-accent/20 via-blue-accent/5 to-transparent pointer-events-none blur-3xl z-0" />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-16 lg:gap-24">
          
          {/* Left Column: Brand, Locations & Globe */}
          <div className="flex flex-col gap-8 lg:max-w-md">
            {/* Logo */}
            <h2 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">
              PAMEDIA
            </h2>
            
            {/* Locations and Availability */}
            <div className="flex flex-col gap-4 text-xs md:text-sm font-medium">
              <div className="flex items-center gap-3 text-white/50">
                <span>Based In</span>
                <span className="text-white/80">→</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['NYC', 'LA', 'MIA'].map((city) => (
                    <span
                      key={city}
                      className="border border-white/15 rounded-full px-3 py-1 font-mono text-[10px] md:text-xs text-white bg-white/5 tracking-wider uppercase"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/50">
                <span>Available Worldwide</span>
                <span className="text-white/80">→</span>
                <div className="w-7 h-7 border border-white/15 rounded-full flex items-center justify-center bg-white/5">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path
                      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24 lg:gap-32">
            
            {/* Pages Navigation */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide">
                Home
              </Link>
              <Link href="/portfolio" className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide">
                Work
              </Link>
              <Link href="/about" className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide">
                About us
              </Link>
              <Link href="/contact" className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide">
                Contact
              </Link>
            </div>

            {/* Socials & Contact */}
            <div className="flex flex-col gap-4">
              <a
                href="https://instagram.com/thiswaspamedia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group"
              >
                Instagram <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <a
                href="https://tiktok.com/@thiswaspamedia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group"
              >
                TikTok <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <a
                href="https://linkedin.com/company/pamedia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group"
              >
                LinkedIn <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <a
                href="mailto:contact@pamedia.com"
                className="text-white/55 hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-1 group"
              >
                Email <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Section: Copyrights & Policy */}
        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-xs text-white/40 font-mono tracking-wider">
          <span>@ 2026 Pamedia Media Agency, All Rights Reserved</span>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Services</span>
            <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
          </div>

          <span className="text-white/50">
            thiswaspamedia® <span className="text-white/30">Site by</span> <a href="https://wearestokt.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-white/50">Stökt</a>
          </span>
        </div>

      </div>
    </footer>
  )
}
