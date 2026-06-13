'use client'
import Link from 'next/link'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Search, User, Menu, X, ArrowRight, LayoutGrid, ChevronDown } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { LogoIcon } from '@/components/icons/logo'
import type { Header } from 'src/payload-types'

type Category = {
  title: string
  slug: string
}

type Props = {
  header: Header
  categories?: Category[]
}

const staticNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
]

function HeaderClientInner({ header, categories = [] }: Props) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeCategory = searchParams.get('category') ?? ''
  const catRef = useRef<HTMLDivElement>(null)

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
    if (searchParams.get('q')) {
      setSearchOpen(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/shop')
    }
    setSearchOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setCatOpen(false)
  }, [pathname])

  // close category dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

                {/* Categories dropdown button */}
                {categories.length > 0 && (
                  <div className="relative" ref={catRef}>
                    <button
                      onClick={() => setCatOpen((v) => !v)}
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out',
                        catOpen || activeCategory
                          ? 'bg-white text-honeycomb-charcoal shadow-sm border border-honeycomb-cream/20'
                          : 'text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-white/50',
                      )}
                      aria-expanded={catOpen}
                      aria-haspopup="true"
                    >
                      <LayoutGrid
                        className={cn(
                          'w-3.5 h-3.5 transition-colors',
                          activeCategory ? 'text-wigrix-teal' : '',
                        )}
                      />
                      Categories
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 transition-transform duration-200',
                          catOpen ? 'rotate-180' : '',
                        )}
                      />
                    </button>

                    {/* Dropdown panel */}
                    {catOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="p-2">
                          {/* All Products */}
                          <Link
                            href="/shop"
                            onClick={() => setCatOpen(false)}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                              !activeCategory
                                ? 'bg-wigrix-teal/10 text-wigrix-teal'
                                : 'text-neutral-700 hover:bg-wigrix-teal/10 hover:text-wigrix-teal',
                            )}
                          >
                            <span
                              className={cn(
                                'w-2 h-2 rounded-full flex-shrink-0 transition-colors',
                                !activeCategory ? 'bg-wigrix-teal' : 'bg-honeycomb-cream',
                              )}
                            />
                            All Products
                          </Link>
                          <div className="my-1.5 border-t border-neutral-100" />
                          {categories.map((cat) => {
                            const isActive = activeCategory === cat.slug
                            return (
                              <Link
                                key={cat.slug}
                                href={`/shop?category=${cat.slug}`}
                                onClick={() => setCatOpen(false)}
                                className={cn(
                                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                                  isActive
                                    ? 'bg-wigrix-teal/10 text-wigrix-teal font-semibold'
                                    : 'text-neutral-600 hover:bg-wigrix-teal/10 hover:text-wigrix-teal',
                                )}
                              >
                                <span
                                  className={cn(
                                    'w-2 h-2 rounded-full flex-shrink-0 transition-colors',
                                    isActive ? 'bg-wigrix-teal' : 'bg-wigrix-teal/30',
                                  )}
                                />
                                {cat.title}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-1">
              {/* Search Bar Container */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false)
                      searchInputRef.current?.blur()
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!searchQuery.trim()) {
                        setSearchOpen(false)
                      }
                    }, 200)
                  }}
                  className={cn(
                    'h-10 text-sm pl-4 pr-10 rounded-full border border-neutral-200/60 focus:outline-none focus:ring-2 focus:ring-wigrix-teal focus:border-transparent transition-all duration-300 ease-out bg-white/95 backdrop-blur shadow-inner',
                    searchOpen
                      ? 'w-40 sm:w-56 md:w-64 opacity-100 pointer-events-auto scale-100'
                      : 'w-0 opacity-0 pointer-events-none scale-95 p-0 border-none',
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (searchOpen) {
                      if (searchQuery.trim()) {
                        router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
                      }
                      setSearchOpen(false)
                    } else {
                      setSearchOpen(true)
                    }
                  }}
                  className="p-2.5 rounded-full text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-ikstudio-beige/50 transition-all duration-300"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </form>

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

                {/* Categories section in mobile */}
                {categories.length > 0 && (
                  <div className="py-4 border-b border-neutral-100">
                    <p className="flex items-center gap-2 text-sm font-bold text-honeycomb-medium uppercase tracking-wider mb-3">
                      <LayoutGrid className="w-4 h-4" />
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/shop"
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-wigrix-teal hover:text-white transition-colors"
                      >
                        All
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-wigrix-teal hover:text-white transition-colors"
                        >
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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

export function HeaderClient(props: Props) {
  return (
    <Suspense fallback={null}>
      <HeaderClientInner {...props} />
    </Suspense>
  )
}
