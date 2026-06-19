'use client'

import { useState } from 'react'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Warm the 3D model as soon as the user shows intent to visit /portfolio,
  // so it's already parsed by the time the page mounts. Dynamic import keeps
  // three.js out of the global bundle.
  const warmPortfolioModel = () => {
    import('@/lib/modelCache')
      .then((m) => m.preloadModel('/models/squid_game_-_worker.glb'))
      .catch(() => {})
  }
  const warmHandlers = (href: string) =>
    href === '/portfolio'
      ? { onMouseEnter: warmPortfolioModel, onFocus: warmPortfolioModel, onTouchStart: warmPortfolioModel }
      : {}

  const navLinks = [
    { label: 'Featured Work', sub: '[6]',  href: '/' },
    { label: 'Portfolio',     sub: '[25]', href: '/portfolio' },
    { label: 'About',         sub: '',     href: '/about' },
    { label: 'Contact',       sub: '',     href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 py-4 md:py-5">
      <div className="relative flex items-center">

        {/* Desktop nav */}
        <div className="hidden md:flex w-full items-center justify-between">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...warmHandlers(link.href)}
              className={`text-sm font-medium tracking-wide transition-opacity duration-200 hover:opacity-100 ${
                path === link.href ? 'text-white opacity-100' : 'text-white opacity-80'
              }`}
            >
              {link.label}
              {link.sub && <span className="text-gray-light text-xs"> {link.sub}</span>}
            </Link>
          ))}
        </div>

        {/* Center Logo (always visible) */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M16 2L18.5 12.5L29 15L18.5 17.5L16 28L13.5 17.5L3 15L13.5 12.5L16 2Z"
              fill="currentColor"
            />
          </svg>
        </Link>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden text-white ml-auto p-2 -mr-2 rounded-md"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            /* X icon */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-3 flex flex-col gap-1 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...warmHandlers(link.href)}
              onClick={() => setMenuOpen(false)}
              className={`py-3 px-2 text-sm font-medium tracking-wide border-b border-white/10 last:border-0 transition-colors ${
                path === link.href ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
              {link.sub && <span className="text-white/40 text-xs ml-1">{link.sub}</span>}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
