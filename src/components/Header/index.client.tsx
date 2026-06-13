'use client'
import Link from 'next/link'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Search, User, Menu, X, ArrowRight, LayoutGrid, ChevronDown, Loader2, Settings, LogOut } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import { LogoIcon } from '@/components/icons/logo'
import type { Header } from 'src/payload-types'
import { useAuth } from '@/providers/Auth'

type Category = {
  title: string
  slug: string
}

type Props = {
  header: Header
  categories?: Category[]
}

const navLinksBefore = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
]

const navLinksAfter = [
  { name: 'About', href: '/about' },
]

function HeaderClientInner({ header, categories = [] }: Props) {
  const { user } = useAuth()

  const getInitials = (name?: string | null) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

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

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    if (!searchQuery.trim() || !searchOpen) {
      setSearchResults([])
      setSearchLoading(false)
      setShowSearchResults(false)
      return
    }

    setShowSearchResults(true)
    setSearchLoading(true)

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.docs || [])
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchOpen])

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

  // close mobile menu and search overlay on route change
  useEffect(() => {
    setMobileOpen(false)
    setCatOpen(false)
    setSearchOpen(false)
    setShowSearchResults(false)
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
                {navLinksBefore.map((link) => {
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
                        catOpen
                          ? 'bg-white text-honeycomb-charcoal shadow-sm border border-honeycomb-cream/20'
                          : 'text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-white/50',
                      )}
                      aria-expanded={catOpen}
                      aria-haspopup="true"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
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

                {navLinksAfter.map((link) => {
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
            <div className="flex items-center gap-3">
              {/* Search Bar Container */}
              <div className="relative flex items-center">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-1.5">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim()) {
                        setShowSearchResults(true)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchOpen(false)
                        setShowSearchResults(false)
                        searchInputRef.current?.blur()
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSearchResults(false)
                        if (!searchQuery.trim()) {
                          setSearchOpen(false)
                        }
                      }, 250)
                    }}
                    className={cn(
                      'h-10 text-xs font-semibold pl-4 pr-4 rounded-full border border-neutral-200/60 transition-all duration-300 ease-out bg-white/95 backdrop-blur shadow-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-wigrix-teal/20 focus:border-wigrix-teal focus-visible:ring-2 focus-visible:ring-wigrix-teal/20 focus-visible:border-wigrix-teal focus-visible:ring-offset-0',
                      searchOpen
                        ? 'w-40 sm:w-56 md:w-64 opacity-100 pointer-events-auto scale-100'
                        : 'w-0 opacity-0 pointer-events-none scale-95 p-0 border-none'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (searchOpen) {
                        if (searchQuery.trim()) {
                          router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
                          setShowSearchResults(false)
                        }
                        setSearchOpen(false)
                      } else {
                        setSearchOpen(true)
                      }
                    }}
                    className="w-10 h-10 rounded-full text-honeycomb-medium hover:text-honeycomb-charcoal hover:bg-ikstudio-beige/50 transition-all duration-300 flex items-center justify-center hover:cursor-pointer flex-shrink-0"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </form>

                {/* Live Search Preview Dropdown */}
                {searchOpen && showSearchResults && searchQuery.trim() && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 md:w-96 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-8 gap-2.5 text-honeycomb-medium text-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-wigrix-teal" />
                        <span>Searching products...</span>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-6 text-center text-sm text-neutral-500 font-medium">
                        No products found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    ) : (
                      <div className="max-h-[320px] overflow-y-auto divide-y divide-neutral-100 no-scrollbar">
                        <div className="px-4 py-2 border-b border-neutral-100 text-[10px] font-bold text-honeycomb-muted uppercase tracking-wider bg-neutral-50/50">
                          Matches
                        </div>
                        {searchResults.map((product) => {
                          const image = product.gallery?.[0]?.image
                          const thumbnailUrl = typeof image === 'object' && image !== null ? image.url : null
                          const categoryName = product.categories && Array.isArray(product.categories) && product.categories.length > 0
                            ? (product.categories[0] as any)?.title || 'Accessory'
                            : 'Accessory'

                          let price = product.priceInUSD
                          const variants = product.variants?.docs
                          if (variants && variants.length > 0) {
                            const variant = variants[0]
                            if (variant && typeof variant === 'object' && variant?.priceInUSD && typeof variant.priceInUSD === 'number') {
                              price = variant.priceInUSD
                            }
                          }

                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={() => {
                                setShowSearchResults(false)
                                setSearchOpen(false)
                              }}
                              className="flex items-center gap-3.5 p-3.5 hover:bg-neutral-50/60 transition-colors"
                            >
                              <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden relative flex-shrink-0 border border-neutral-100">
                                {thumbnailUrl ? (
                                  <Image
                                    src={thumbnailUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-400">
                                    No Image
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <span className="text-[10px] font-bold text-wigrix-teal uppercase tracking-wider block mb-0.5">
                                  {categoryName}
                                </span>
                                <h4 className="text-sm font-semibold text-honeycomb-charcoal truncate">
                                  {product.title}
                                </h4>
                              </div>
                              <div className="text-right flex-shrink-0">
                                {typeof price === 'number' ? (
                                  <span className="text-sm font-bold text-honeycomb-charcoal">
                                    {new Intl.NumberFormat('en-IN', {
                                      style: 'currency',
                                      currency: 'INR',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format(price)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-neutral-400">Unavailable</span>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Account - Desktop only */}
              {user ? (
                <div className="relative group hidden sm:flex items-center">
                  <Link
                    href="/account"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-honeycomb-cream text-honeycomb-charcoal font-extrabold text-xs shadow-md border-2 border-white hover:border-honeycomb-cream hover:scale-105 transition-all duration-300"
                    aria-label="Account"
                  >
                    {getInitials(user.name)}
                  </Link>

                  {/* Hover Card */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-honeycomb-cream/25 p-4 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-honeycomb-cream/15 flex items-center justify-center font-extrabold text-sm text-honeycomb-cream">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-honeycomb-charcoal truncate">
                            {user.name || 'Wigrix User'}
                          </p>
                          <p className="text-xs text-honeycomb-muted truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-honeycomb-cream/20 flex flex-col gap-1.5">
                        <Link
                          href="/account?tab=settings"
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-honeycomb-charcoal/80 hover:bg-honeycomb-cream/10 hover:text-honeycomb-charcoal transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Account Settings
                        </Link>
                        <Link
                          href="/logout"
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log out
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4.5 py-2 rounded-full border border-neutral-200/80 bg-white/70 hover:bg-white text-neutral-700 hover:text-neutral-900 font-extrabold text-xs shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  aria-label="Log In"
                >
                  <User className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2.5} />
                  <span>Log In</span>
                </Link>
              )}

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
                {navLinksBefore.map((link) => {
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

                {navLinksAfter.map((link) => {
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
                {user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-honeycomb-cream/5 border border-honeycomb-cream/20 hover:bg-honeycomb-cream/15 hover:border-honeycomb-cream/35 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-honeycomb-cream text-honeycomb-charcoal flex items-center justify-center font-bold text-sm shadow-sm border border-white/20">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-honeycomb-charcoal truncate">
                          {user.name || 'Wigrix User'}
                        </p>
                        <p className="text-xs text-honeycomb-muted truncate">{user.email}</p>
                      </div>
                    </Link>
                    <Link
                      href="/logout"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-red-600 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-honeycomb-medium hover:text-honeycomb-charcoal transition-colors"
                  >
                    <User className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-base">Account</span>
                  </Link>
                )}
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
