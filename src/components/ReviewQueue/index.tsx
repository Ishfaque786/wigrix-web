'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ExternalLink, Trash2, Plus } from 'lucide-react'

export type ReviewQueueProduct = {
  id: string | number
  slug: string
  title: string
  price: number | null
  imageUrl: string | null
  categoryName: string
  externalLinks?: { url: string; label?: string | null }[]
  addedAt: number
}

export const REVIEW_QUEUE_KEY = 'wigrix_review_queue'

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ReviewQueue() {
  const [products, setProducts] = useState<ReviewQueueProduct[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REVIEW_QUEUE_KEY)
      if (stored) setProducts(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  const handleRemove = (slug: string) => {
    const updated = products.filter((p) => p.slug !== slug)
    localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(updated))
    setProducts(updated)
  }

  const handleClear = () => {
    localStorage.removeItem(REVIEW_QUEUE_KEY)
    setProducts([])
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-neutral-500 font-medium">Your review queue is empty</p>
        <p className="text-sm text-neutral-400 mt-1">
          Add products you&apos;d like to review later from their product page
        </p>
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
        <p className="text-sm text-neutral-500 font-medium">
          {products.length} product{products.length !== 1 ? 's' : ''} to review
        </p>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const firstLink = product.externalLinks?.[0]
          return (
            <div
              key={product.slug}
              className="group flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-wigrix-teal/30 hover:bg-white transition-all duration-200"
            >
              {/* Thumbnail */}
              <Link
                href={`/products/${product.slug}`}
                className="relative w-16 h-16 rounded-xl bg-white border border-neutral-100 overflow-hidden flex-shrink-0"
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🏮</div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.slug}`}>
                  <h4 className="text-sm font-semibold text-neutral-800 line-clamp-1 hover:text-wigrix-teal transition-colors">
                    {product.title}
                  </h4>
                </Link>
                <p className="text-xs text-neutral-500 mt-0.5">{product.categoryName}</p>
                {product.price !== null && (
                  <p className="text-sm font-bold text-honeycomb-charcoal mt-0.5">
                    {formatINR(product.price)}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {firstLink && (
                  <a
                    href={firstLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-200"
                  >
                    <Star className="w-3.5 h-3.5" />
                    Write Review
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => handleRemove(product.slug)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Remove from review queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Standalone button to add to review queue — used on product page
export function AddToReviewQueueButton({
  product,
}: {
  product: ReviewQueueProduct
}) {
  const [inQueue, setInQueue] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REVIEW_QUEUE_KEY)
      const queue: ReviewQueueProduct[] = stored ? JSON.parse(stored) : []
      setInQueue(queue.some((p) => p.slug === product.slug))
    } catch {
      // ignore
    }
  }, [product.slug])

  const toggle = () => {
    try {
      const stored = localStorage.getItem(REVIEW_QUEUE_KEY)
      const queue: ReviewQueueProduct[] = stored ? JSON.parse(stored) : []

      if (inQueue) {
        const updated = queue.filter((p) => p.slug !== product.slug)
        localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(updated))
        setInQueue(false)
      } else {
        const entry: ReviewQueueProduct = { ...product, addedAt: Date.now() }
        const updated = [entry, ...queue.filter((p) => p.slug !== product.slug)].slice(0, 20)
        localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(updated))
        setInQueue(true)
      }
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
        inQueue
          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
      }`}
      aria-label={inQueue ? 'Remove from review queue' : 'Add to review queue'}
    >
      <Star className={`w-4 h-4 ${inQueue ? 'fill-amber-400 text-amber-400' : ''}`} />
      {inQueue ? 'In Review Queue' : 'Want to Review?'}
    </button>
  )
}
