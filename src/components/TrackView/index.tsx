'use client'

import { useEffect } from 'react'

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

type Props = {
  product: {
    id: string | number
    slug: string
    title: string
    priceInINR?: number | null
    imageUrl?: string | null
    categoryName?: string
    externalLinks?: { url: string; label?: string | null }[]
  }
}

const MAX_RECENTLY_VIEWED = 10
const STORAGE_KEY = 'wigrix_recently_viewed'

export function TrackView({ product }: Props) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const existing: TrackedProduct[] = stored ? JSON.parse(stored) : []

      // Remove if already exists (we'll add it fresh at front)
      const filtered = existing.filter((p) => p.slug !== product.slug)

      const entry: TrackedProduct = {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.priceInINR ?? null,
        imageUrl: product.imageUrl ?? null,
        categoryName: product.categoryName ?? 'Product',
        externalLinks: product.externalLinks,
        viewedAt: Date.now(),
      }

      const updated = [entry, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [product.slug])

  return null
}
