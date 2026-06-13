'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, ExternalLink, Clock, Trash2 } from 'lucide-react'

type TrackedProduct = {
  id: string | number
  slug: string
  title: string
  price: number | null
  imageUrl: string | null
  categoryName: string
  externalLinks?: { url: string; label?: string | null }[]
  viewedAt: number
}

const STORAGE_KEY = 'wigrix_recently_viewed'

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<TrackedProduct[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setProducts(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setProducts([])
  }

  const handleRemove = (slug: string) => {
    const updated = products.filter((p) => p.slug !== slug)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setProducts(updated)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-neutral-500 font-medium">No recently viewed products</p>
        <p className="text-sm text-neutral-400 mt-1">Products you view will appear here</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-wigrix-teal text-white font-bold text-sm rounded-full hover:bg-wigrix-teal-dark transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-500 font-medium">{products.length} product{products.length !== 1 ? 's' : ''} viewed</p>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => {
          const firstLink = product.externalLinks?.[0]
          return (
            <div
              key={product.slug}
              className="group relative bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden hover:border-wigrix-teal/30 hover:shadow-md transition-all duration-200"
            >
              {/* Remove button */}
              <button
                onClick={() => handleRemove(product.slug)}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                aria-label="Remove from recently viewed"
              >
                <Trash2 className="w-3 h-3 text-neutral-400 hover:text-red-500" />
              </button>

              {/* Image */}
              <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-white overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-300 text-3xl">
                    🏮
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="p-3">
                <Link href={`/products/${product.slug}`}>
                  <h4 className="text-xs font-semibold text-neutral-800 line-clamp-2 hover:text-wigrix-teal transition-colors leading-snug">
                    {product.title}
                  </h4>
                </Link>
                {product.price !== null && (
                  <p className="text-xs font-bold text-honeycomb-charcoal mt-1">
                    {formatINR(product.price)}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span className="text-[10px] text-neutral-400">{timeAgo(product.viewedAt)}</span>
                </div>
                {firstLink && (
                  <a
                    href={firstLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded-lg bg-honeycomb-charcoal text-white text-[11px] font-bold hover:bg-wigrix-teal transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {firstLink.label || 'Buy Now'}
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
