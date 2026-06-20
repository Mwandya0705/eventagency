'use client'

import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/portfolio' },
  { label: 'About us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const socials = [
  { label: 'Instagram', href: 'https://instagram.com/thiswaspamedia' },
  { label: 'TikTok', href: 'https://tiktok.com/@thiswaspamedia' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/pamedia' },
  { label: 'Email', href: 'mailto:contact@pamedia.com' },
]

export default function BigFooter() {
  return (
    <footer
      className="relative text-white overflow-hidden"
      /* Black at the top transitioning into a blue glow rising from the bottom */
      style={{
        background:
          'radial-gradient(125% 95% at 30% 135%, #2f7bff 0%, #0d3fce 28%, #0a2a8a 45%, #05112e 68%, #000000 100%)',
      }}
    >
      <div className="px-6 md:px-12 pt-16 lg:pt-20 pb-8 flex flex-col">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand + location */}
          <div>
            <h2 className="font-display text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-none">
              Pamedia
            </h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/80">
                <span>Based in</span>
                <span aria-hidden>→</span>
                {['NYC', 'LA', 'MIA'].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-0.5 rounded-full border border-blue-glow/60 text-blue-glow text-xs font-medium"
                  >
                    {city}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span>Available Worldwide</span>
                <span aria-hidden>→</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-glow">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                </svg>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex gap-12 md:gap-16 text-sm font-medium">
            <div className="flex flex-col gap-3">
              {navLinks.map(({ label, href }) => (
                <Link key={label} href={href} className="text-white/70 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {socials.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  {label}
                  <span className="inline-block text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 lg:mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/45">
          <span>© 2026 Pamedia Media Agency, All Rights Reserved</span>
          <div className="flex items-center gap-5">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Services</span>
            <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display lowercase tracking-tight text-white/60">thiswaspamedia©</span>
            <a
              href="https://wearestokt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Site by Stōkt
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
