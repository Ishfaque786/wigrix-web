'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, Suspense } from 'react'
import { Search, X, SlidersHorizontal, ChevronDown, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from '@/components/ui/menubar'

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
  const [inputValue, setInputValue] = useState(searchQuery)

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

  const navigate = useCallback(
    (updates: Record<string, string | null>) => {
      const qs = createQS(updates)
      router.push(`${pathname}${qs ? `?${qs}` : ''}`)
    },
    [createQS, pathname, router],
  )

  // Sync state with prop (e.g. if query cleared from elsewhere or via back button)
  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim() !== searchQuery) {
        navigate({ q: inputValue.trim() || null })
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [inputValue, searchQuery, navigate])

  // Search submit (instant search on Enter key)
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate({ q: inputValue.trim() || null })
  }

  // Instant clear
  const handleClear = () => {
    setInputValue('')
    navigate({ q: null })
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

      <div className="relative max-w-7xl mx-auto pt-28 pb-6 lg:pt-32 lg:pb-8 px-0 md:px-6 lg:px-10">
        {/* ── Title Section ────────────────────────────────────────────── */}
        <div className="mb-6 md:mb-8 text-left px-6 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-honeycomb-charcoal tracking-tight">
            Shop All
          </h1>
          <p className="text-honeycomb-medium mt-2 text-sm md:text-base">
            Premium workspace accessories, handcrafted for you.
          </p>
        </div>

        {/* ── Unified Glass Control Bar ─────────────────────────────────── */}
        <div className="bg-white/80 backdrop-blur-md border-t border-b border-x-0 md:border border-honeycomb-cream/40 rounded-none md:rounded-3xl px-6 py-3 md:p-4 shadow-xl shadow-honeycomb-charcoal/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories / Filter Scroll Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 -mx-6 px-6 md:mx-0 md:px-0">
            <span className="flex items-center gap-1.5 text-xs font-bold text-honeycomb-muted uppercase tracking-wider mr-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </span>
            {categoryLinks.map((cat) => {
              const isActive = activeCategory === cat.slug
              return (
                <Link
                  key={cat.slug || 'all'}
                  href={categoryHref(cat.slug)}
                  aria-pressed={isActive}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border shrink-0 ${
                    isActive
                      ? 'bg-honeycomb-charcoal text-white border-honeycomb-charcoal shadow-sm'
                      : 'bg-white border-honeycomb-cream/40 text-honeycomb-charcoal hover:bg-honeycomb-light hover:border-honeycomb-cream/80 hover:shadow-sm'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>

          {/* Divider on Mobile only */}
          <div className="h-px bg-honeycomb-cream/15 md:hidden -mx-6" />

          {/* Search + Sort Group */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-honeycomb-muted pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-10 pr-9 py-2 rounded-full border border-honeycomb-cream/60 bg-white text-sm text-honeycomb-charcoal placeholder:text-honeycomb-muted focus:outline-none focus:ring-2 focus:ring-honeycomb-charcoal/15 focus:border-honeycomb-charcoal/30 transition-all"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-honeycomb-muted hover:text-honeycomb-charcoal transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Sort Dropdown */}
            <div className="shrink-0">
              <Menubar className="border-none bg-transparent p-0 h-auto">
                <MenubarMenu>
                  <MenubarTrigger className="group flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2 rounded-full border border-honeycomb-cream/60 bg-white text-sm font-semibold text-honeycomb-charcoal hover:bg-honeycomb-light hover:border-honeycomb-cream/80 hover:shadow-sm focus:bg-honeycomb-light data-[state=open]:bg-honeycomb-light data-[state=open]:text-honeycomb-charcoal data-[state=open]:border-honeycomb-cream/80 transition-all duration-200 whitespace-nowrap cursor-pointer">
                    <ArrowUpDown className="w-4 h-4 text-honeycomb-muted group-hover:text-honeycomb-charcoal group-data-[state=open]:text-honeycomb-charcoal transition-colors shrink-0" />
                    <span className="hidden sm:inline">{activeSortLabel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-honeycomb-muted transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
                  </MenubarTrigger>
                  <MenubarContent align="end" className="w-48 bg-white rounded-2xl shadow-xl border border-honeycomb-cream/30 py-1">
                    <MenubarRadioGroup value={activeSort} onValueChange={(val) => navigate({ sort: val })}>
                      {sortOptions.map((opt) => (
                        <MenubarRadioItem
                          key={opt.value}
                          value={opt.value}
                          className="flex items-center pl-8 pr-4 py-2.5 text-sm text-honeycomb-medium hover:bg-honeycomb-light hover:cursor-pointer focus:bg-honeycomb-light data-[state=checked]:text-honeycomb-charcoal data-[state=checked]:font-semibold cursor-pointer"
                        >
                          {opt.label}
                        </MenubarRadioItem>
                      ))}
                    </MenubarRadioGroup>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
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
