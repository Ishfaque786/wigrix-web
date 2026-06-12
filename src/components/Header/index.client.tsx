'use client'
import Link from 'next/link'
import React, { Suspense, useState, useEffect } from 'react'
import { Search, User, Menu, X, ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { LogoIcon } from '@/components/icons/logo'
import type { Header } from 'src/payload-types'

type Props = {
  header: Header
}

const staticNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
]

export function HeaderClient({ header }: Props) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const navLinks = staticNavLinks

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          isScrolled
            ? 'bg-white/85 backdrop-blur-2xl border-b border-neutral-200/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
            : 'bg-transparent',
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="group flex items-center gap-x-2" aria-label="Wigrix Home">
                <LogoIcon className="h-8 w-auto" />
              </Link>
            </div>

            {/* Center: Desktop Navigation pill */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-ikstudio-beige/40 rounded-full px-1.5 py-1.5 backdrop-blur-sm border border-white/30">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out',
                        isActive
                          ? 'bg-white text-honeycomb-charcoal shadow-sm border border-honeycomb-cream/20'
                          : 'text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-white/50',
                      )}
                    >
                      {link.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                className="p-2.5 rounded-full text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-ikstudio-beige/50 transition-all duration-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Account - Desktop only */}
              <Link
                href="/account"
                className="hidden sm:flex p-2.5 rounded-full text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-ikstudio-beige/50 transition-all duration-300"
                aria-label="Account"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                className="lg:hidden p-2.5 rounded-full text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-ikstudio-beige/50 transition-all duration-300"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6">
              <LogoIcon className="h-7 w-auto" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-honeycomb-light transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-honeycomb-charcoal" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 px-8 overflow-y-auto">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        'group flex items-center justify-between py-4 border-b border-neutral-100 text-lg font-medium transition-all duration-300',
                        isActive
                          ? 'text-honeycomb-charcoal'
                          : 'text-honeycomb-medium hover:text-honeycomb-charcoal',
                      )}
                    >
                      <span>{link.name}</span>
                      <ArrowRight
                        className={cn(
                          'w-5 h-5 transition-all duration-300',
                          isActive
                            ? 'text-honeycomb-charcoal'
                            : 'text-neutral-300 group-hover:text-honeycomb-charcoal group-hover:translate-x-1',
                        )}
                      />
                    </Link>
                  )
                })}
              </div>

              {/* Account link */}
              <div className="mt-8 pt-8 border-t border-neutral-200 space-y-4">
                <Link
                  href="/account"
                  className="flex items-center gap-3 text-honeycomb-medium hover:text-honeycomb-charcoal transition-colors"
                >
                  <User className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-base">Account</span>
                </Link>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-8 bg-honeycomb-light/50">
              <Link href="/shop">
                <div className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-honeycomb-charcoal text-white font-bold text-base hover:bg-honeycomb-slate transition-colors">
                  Shop All Products
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <p className="text-xs text-honeycomb-muted text-center mt-4 tracking-wide uppercase font-bold">
                Wigrix — Handcrafted with Care
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
