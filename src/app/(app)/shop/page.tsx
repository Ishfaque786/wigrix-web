import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'
import { Package } from 'lucide-react'
import type { Metadata } from 'next'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { CategoryBar } from '@/components/CategoryBar'

export const metadata: Metadata = {
  description:
    'Explore our complete collection of premium workspace accessories. Shop desk organisers, gadget stands, desk planters and more.',
  title: 'Shop | Wigrix — Premium Workspace Accessories',
}

type SearchParams = { [key: string]: string | string[] | undefined }
type Props = { searchParams: Promise<SearchParams> }

const VALID_SORTS = ['title', '-title', 'priceInINR', '-priceInINR', '-createdAt']
const DEFAULT_SORT = 'title'

export default async function ShopPage({ searchParams }: Props) {
  const { q, category, sort } = await searchParams

  const searchQuery = typeof q === 'string' ? q.trim() : ''
  const activeCategory = typeof category === 'string' ? category.trim() : ''
  const activeSort =
    typeof sort === 'string' && VALID_SORTS.includes(sort) ? sort : DEFAULT_SORT

  const payload = await getPayload({ config: configPromise })

  // Build Payload where clause
  const andClauses: Where[] = [{ _status: { equals: 'published' } }]

  if (searchQuery) {
    andClauses.push({
      or: [
        { title: { like: searchQuery } },
        { 'meta.description': { like: searchQuery } },
      ],
    })
  }

  if (activeCategory) {
    // Dot-notation traversal into related categories collection
    andClauses.push({ 'categories.slug': { equals: activeCategory } })
  }

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    depth: 2,
    sort: activeSort,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInINR: true,
      externalLinks: true,
    },
    where: { and: andClauses },
  })

  const count = products.docs.length
  const resultsText = count === 1 ? 'result' : 'results'

  return (
    <main className="min-h-screen bg-white">
      {/* Category bar — shop page only */}
      <CategoryBar />

      {/* Wigrix shop header — search + sort dropdown */}
      <ShopHeader
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        activeSort={activeSort}
      />

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Search info bar */}
        {searchQuery && (
          <p className="mb-6 text-honeycomb-medium text-sm">
            {count === 0 ? 'No products match ' : `Showing ${count} ${resultsText} for `}
            <span className="font-bold text-honeycomb-charcoal">&quot;{searchQuery}&quot;</span>
            {activeCategory && (
              <span className="text-honeycomb-muted">
                {' '}in <span className="font-semibold capitalize text-honeycomb-charcoal">{activeCategory.replace(/-/g, ' ')}</span>
              </span>
            )}
          </p>
        )}

        {/* Empty state */}
        {count === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="w-14 h-14 text-honeycomb-cream mb-4" strokeWidth={1} />
            <h2 className="text-xl font-bold text-honeycomb-charcoal mb-2">No products found</h2>
            <p className="text-honeycomb-muted text-sm">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}

        {/* Product grid */}
        {count > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.docs.map((product) => (
              <ProductGridItem key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Results count footer */}
        {count > 0 && (
          <p className="mt-10 text-center text-xs text-honeycomb-muted">
            {count} {resultsText} found
          </p>
        )}
      </div>
    </main>
  )
}
