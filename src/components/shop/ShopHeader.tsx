'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useRef, Suspense, useState } from 'react'
import { Search, X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react'
import Link from 'next/link'

// ── Categories ─────────────────────────────────────────────────────────────
const categoryLinks = [
  { name: 'All', slug: '' },
  { name: 'Desk Organisers', slug: 'desk-organisers' },
  { name: 'Gadget Stands', slug: 'gadget-stands' },
  { name: 'Desk Planters', slug: 'desk-planters' },
  { name: 'Accessories', slug: 'accessories' },
]

// ── Sort options ────────────────────────────────────────────────────────────
const sortOptions = [
  { label: 'A → Z', value: 'title' },
  { label: 'Z → A', value: '-title' },
  { label: 'Price: Low → High', value: 'priceInUSD' },
  { label: 'Price: High → Low', value: '-priceInUSD' },
  { label: 'Newest First', value: '-createdAt' },
]

type Props = {
  activeCategory: string
  searchQuery: string
  activeSort: string
}

// ── Inner component (needs useSearchParams) ─────────────────────────────────
function ShopHeaderInner({ activeCategory, searchQuery, activeSort }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const [sortOpen, setSortOpen] = useState(false)

  // Build query string preserving all existing params
  const createQS = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (!v) params.delete(k)
        else params.set(k, v)
      })
      return params.toString()
    },
    [searchParams],
  )

  const navigate = (updates: Record<string, string | null>) => {
    const qs = createQS(updates)
    router.push(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  // Search submit
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate({ q: inputRef.current?.value.trim() || null })
  }

  // Category href — keeps search + sort
  const categoryHref = (slug: string) => {
    const qs = createQS({ category: slug || null })
    return `${pathname}${qs ? `?${qs}` : ''}`
  }

  // Active sort label
  const activeSortLabel =
    sortOptions.find((s) => s.value === activeSort)?.label ?? 'Sort by'

  return (
    <div className="relative bg-honeycomb-light/50 overflow-hidden border-b border-honeycomb-cream/20">
      {/* Honeycomb bg pattern */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23C5B99A' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-honeycomb-cream/15 rounded-full blur-[90px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-6 lg:pt-32 lg:pb-8">
        {/* ── Row 1: Title + Search ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-honeycomb-charcoal tracking-tight leading-none">
              Shop All
            </h1>
            <p className="text-honeycomb-medium mt-2 text-sm lg:text-base">
              Premium workspace accessories, handcrafted for you.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full lg:max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-honeycomb-muted pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                defaultValue={searchQuery}
                placeholder="Search products…"
                className="w-full pl-10 pr-9 py-2.5 rounded-full border border-honeycomb-cream/80 bg-white/80 text-sm text-honeycomb-charcoal placeholder:text-honeycomb-muted focus:outline-none focus:ring-2 focus:ring-honeycomb-charcoal/15 focus:border-honeycomb-charcoal/30 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => navigate({ q: null })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-honeycomb-muted hover:text-honeycomb-charcoal transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-full bg-honeycomb-charcoal text-white text-sm font-semibold hover:bg-honeycomb-slate transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>

        {/* ── Row 2: Category pills + Sort ─────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          {/* Filter icon */}
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-honeycomb-muted uppercase tracking-wider mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </span>

          {/* Category Pills */}
          {categoryLinks.map((cat) => {
            const isActive = activeCategory === cat.slug
            return (
              <Link
                key={cat.slug || 'all'}
                href={categoryHref(cat.slug)}
                aria-pressed={isActive}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-honeycomb-charcoal text-white border-honeycomb-charcoal shadow-sm'
                    : 'bg-white/80 border-honeycomb-cream/70 text-honeycomb-charcoal hover:bg-white hover:border-honeycomb-cream hover:shadow-sm'
                }`}
              >
                {cat.name}
              </Link>
            )
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── Sort Dropdown ─────────────────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-honeycomb-cream/70 bg-white/80 text-sm font-medium text-honeycomb-charcoal hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap"
              aria-expanded={sortOpen}
            >
              <span>{activeSortLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-honeycomb-muted transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {sortOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                />
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white rounded-2xl shadow-xl border border-honeycomb-cream/30 overflow-hidden py-1">
                  {sortOptions.map((opt) => {
                    const isSelected = activeSort === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          navigate({ sort: opt.value })
                          setSortOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-honeycomb-light hover:cursor-pointer ${
                          isSelected
                            ? 'text-honeycomb-charcoal font-semibold bg-honeycomb-light/50'
                            : 'text-honeycomb-medium'
                        }`}
                      >
                        {opt.label}
                        {isSelected && <Check className="w-3.5 h-3.5 text-honeycomb-charcoal" />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap in Suspense (required by Next.js for useSearchParams in client component)
export function ShopHeader(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="bg-honeycomb-light/50 pt-28 pb-8 lg:pt-32 lg:pb-12 animate-pulse">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-4">
            <div className="h-10 w-40 rounded-xl bg-honeycomb-cream/50" />
            <div className="flex gap-2">
              {[80, 120, 110, 100, 95].map((w, i) => (
                <div key={i} className="h-8 rounded-full bg-honeycomb-cream/40" style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopHeaderInner {...props} />
    </Suspense>
  )
}
