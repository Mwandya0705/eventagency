'use client'

import Link from 'next/link'

export default function BigFooter() {
  return (
    <footer
      className="relative text-white overflow-hidden border-t border-white/10"
      style={{ background: 'linear-gradient(180deg, #06153d 0%, #0a2a8a 50%, #0d4fd8 100%)' }}
    >
      {/* ── Bottom links & copyright — compact ── */}
      <div className="px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
            PAMEDIA
          </h2>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">Home</Link>
            <Link href="/portfolio" className="text-white/60 hover:text-white transition-colors">Work</Link>
            <Link href="/about" className="text-white/60 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-5 text-sm font-medium">
            {[
              { label: 'Instagram', href: 'https://instagram.com/thiswaspamedia' },
              { label: 'TikTok', href: 'https://tiktok.com/@thiswaspamedia' },
              { label: 'LinkedIn', href: 'https://linkedin.com/company/pamedia' },
              { label: 'Email', href: 'mailto:contact@pamedia.com' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors flex items-center gap-0.5 group"
              >
                {label}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright bar */}
        <div className="max-w-7xl mx-auto mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/35 font-mono tracking-wider">
          <span>© 2026 Pamedia Media Agency — All Rights Reserved</span>
          <div className="flex items-center gap-5">
            <span className="hover:text-white/70 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white/70 transition-colors cursor-pointer">Terms of Services</span>
            <span className="hover:text-white/70 transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
