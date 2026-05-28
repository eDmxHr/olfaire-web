'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LumiMark } from './lumi-mark'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-parchment/95 backdrop-blur-md border-b border-dust'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <LumiMark size={28} wingColor="#1C1A18" bodyColor="#B07D2A" />
          <span className="serif text-xl font-light tracking-[0.12em] text-ink">
            Olfaire
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/about',   label: 'About'   },
            { href: '/pricing', label: 'Pricing' },
            { href: '/blog',    label: 'Journal' },
            { href: '/support', label: 'Support' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="amber-hover text-ash hover:text-ink transition-colors text-sm tracking-wide"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/#hero"
            className="bg-ink text-parchment px-5 py-2.5 rounded-full text-sm font-medium tracking-wide hover:bg-amber transition-colors duration-200"
          >
            Join waitlist
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-ink transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-parchment border-t border-dust px-6 py-6 flex flex-col gap-5">
          {[
            { href: '/about',   label: 'About'   },
            { href: '/pricing', label: 'Pricing' },
            { href: '/blog',    label: 'Journal' },
            { href: '/support', label: 'Support' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-ink text-base font-light tracking-wide"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            href="/#hero"
            className="bg-ink text-parchment px-5 py-3 rounded-full text-sm font-medium text-center"
            onClick={() => setOpen(false)}
          >
            Join waitlist
          </a>
        </div>
      )}
    </header>
  )
}
