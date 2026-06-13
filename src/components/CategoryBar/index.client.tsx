'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { LayoutGrid } from 'lucide-react'
import { Suspense } from 'react'

type Category = {
  title: string
  slug: string
}

function CategoryBarInner({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  if (categories.length === 0) return null

  return (
    <div className="sticky top-[64px] lg:top-[80px] z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {/* Icon */}
          <div className="flex items-center gap-1.5 pr-3 mr-1 border-r border-neutral-200 flex-shrink-0">
            <LayoutGrid className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:block">
              Categories
            </span>
          </div>

          {/* All pill */}
          <Link
            href="/shop"
            className={cn(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap',
              !activeCategory
                ? 'bg-honeycomb-charcoal text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
            )}
          >
            All
          </Link>

          {/* Category pills */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={cn(
                  'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-wigrix-teal text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                )}
              >
                {cat.title}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function CategoryBarClient({ categories }: { categories: Category[] }) {
  return (
    <Suspense fallback={<div className="h-11 bg-white/90 border-b border-neutral-100" />}>
      <CategoryBarInner categories={categories} />
    </Suspense>
  )
}
