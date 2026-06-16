'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()

  const navLinks = [
    { label: 'Featured Work', sub: '[6]', href: '/' },
    { label: 'Portfolio', sub: '[25]', href: '/portfolio' },
    { label: 'About', sub: '', href: '/about' },
    { label: 'Contact', sub: '', href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-5">
      <div className="relative flex items-center">
        {/* Desktop nav links — evenly spread across the full width */}
        <div className="hidden md:flex w-full items-center justify-between">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-opacity duration-200 hover:opacity-100 ${
                path === link.href ? 'text-white opacity-100' : 'text-white opacity-90'
              }`}
            >
              {link.label}
              {link.sub && <span className="text-gray-light text-xs"> {link.sub}</span>}
            </Link>
          ))}
        </div>

        {/* Center Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <svg
            width="32"
            height="32"
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

        {/* Mobile menu button */}
        <button className="md:hidden text-white ml-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
