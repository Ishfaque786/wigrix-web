'use client'

import type { Product } from '@/payload-types'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Star, ShoppingBag } from 'lucide-react'
import { type Media } from '@/payload-types'


type Props = {
  product: Partial<Product>
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInINR, title, slug, externalLinks } = product

  let price = priceInINR
  const variants = product.variants?.docs
  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (variant && typeof variant === 'object' && variant?.priceInINR && typeof variant.priceInINR === 'number') {
      price = variant.priceInINR
    }
  }

  const image = gallery?.[0]?.image && typeof gallery[0]?.image !== 'string'
    ? (gallery[0]?.image as Media)
    : null

  const thumbnailUrl = image?.url || null
  const categoryName = product.categories && Array.isArray(product.categories) && product.categories.length > 0
    ? (product.categories[0] as any)?.title || 'Accessory'
    : 'Accessory'

  const avgRating = product.ratingAverage ?? 0
  const countReviews = product.ratingCount ?? 0

  const firstExternalLink = externalLinks && externalLinks.length > 0 ? externalLinks[0] : null

  return (
    <div className="group flex flex-col h-full">
      {/* Card */}
      <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-honeycomb-cream/30 flex flex-col h-full">
        {/* Image — links to detail page */}
        <Link href={`/products/${slug}`} className="block relative aspect-square overflow-hidden bg-honeycomb-light/40">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title || 'Product image'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-honeycomb-muted text-xs">
              No Image
            </div>
          )}
        </Link>

        {/* Card Body */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-honeycomb-muted font-medium uppercase tracking-wider">
              {categoryName}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-honeycomb-charcoal">
                {countReviews > 0 ? avgRating.toFixed(1) : 'New'}
              </span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${slug}`}>
            <h3 className="font-semibold text-honeycomb-charcoal text-sm leading-snug line-clamp-2 hover:text-honeycomb-slate transition-colors">
              {title}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-auto pt-1">
            {typeof price === 'number' ? (
              <span className="font-bold text-honeycomb-charcoal text-lg">{formatINR(price)}</span>
            ) : (
              <span className="text-sm text-gray-400">Price unavailable</span>
            )}
          </div>

          {/* Buy Button or Out of Stock */}
          {firstExternalLink ? (
            <a
              href={firstExternalLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-honeycomb-charcoal text-white text-xs font-bold hover:bg-honeycomb-slate transition-all duration-200 hover:shadow-md hover:cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {firstExternalLink.label || 'Buy Now'}
            </a>
          ) : (
            <div className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-red-300/50 bg-red-50 text-red-500 text-xs font-bold uppercase tracking-wide">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
