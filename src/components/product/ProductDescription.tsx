'use client'
import type { Product, Variant } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Price } from '@/components/Price'
import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Star, Shield, Truck, Package } from 'lucide-react'

import { VariantSelector } from './VariantSelector'

export function ProductDescription({ 
  product,
  averageRating = 0,
  reviewCount = 0
}: { 
  product: Product
  averageRating?: number
  reviewCount?: number
}) {
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  if (hasVariants) {
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          'priceInUSD' in a &&
          'priceInUSD' in b &&
          typeof a.priceInUSD === 'number' &&
          typeof b.priceInUSD === 'number'
        ) {
          return a.priceInUSD - b.priceInUSD
        }
        return 0
      }) as Variant[]

    if (variantsOrderedByPrice?.length) {
      const lowestVariant = variantsOrderedByPrice[0]?.priceInUSD
      const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1]?.priceInUSD
      if (typeof lowestVariant === 'number' && typeof highestVariant === 'number') {
        lowestAmount = lowestVariant
        highestAmount = highestVariant
      }
    }
  } else if (product.priceInUSD && typeof product.priceInUSD === 'number') {
    amount = product.priceInUSD
  }

  const trustBadges = [
    { icon: Truck, label: 'Free Shipping', desc: 'On all orders' },
    { icon: Package, label: 'Easy Returns', desc: '30-day policy' },
    { icon: Shield, label: 'Secure Payment', desc: '100% protected' },
  ]

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((i) => {
      const fillPercent = Math.min(Math.max(rating - (i - 1), 0), 1) * 100
      return (
        <div key={i} className="relative w-4 h-4">
          <Star className="absolute inset-0 w-4 h-4 text-neutral-300" />
          {fillPercent > 0 && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Price */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-honeycomb-charcoal tracking-tight">{product.title}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {renderStars(averageRating)}
          </div>
          <span className="text-sm text-honeycomb-muted">
            {reviewCount > 0
              ? `(${averageRating.toFixed(1)} · ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})`
              : '(No reviews yet)'}
          </span>
        </div>
        <div className="text-3xl font-bold text-honeycomb-charcoal mt-1">
          {hasVariants ? (
            <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
          ) : (
            <Price amount={amount} />
          )}
        </div>
      </div>

      {/* Description */}
      {product.description ? (
        <RichText className="text-honeycomb-medium leading-relaxed" data={product.description} enableGutter={false} />
      ) : null}

      <hr className="border-honeycomb-cream/30" />

      {/* Variant Selector */}
      {hasVariants && (
        <>
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>
          <hr className="border-honeycomb-cream/30" />
        </>
      )}

      {/* External Purchase Links / Out of Stock */}
      {product.externalLinks && product.externalLinks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {product.externalLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer ${
                idx === 0
                  ? 'bg-honeycomb-charcoal text-white hover:bg-honeycomb-slate shadow-lg shadow-honeycomb-charcoal/20 hover:shadow-xl'
                  : 'border-2 border-honeycomb-charcoal/30 text-honeycomb-charcoal hover:bg-honeycomb-light'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {link.label || 'Buy Now'}
            </a>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-4 px-6 border-2 border-red-400/30 bg-red-50 text-red-600 rounded-full text-base font-bold select-none uppercase tracking-wider">
          Out of Stock
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {trustBadges.map((badge, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-honeycomb-light/50 border border-honeycomb-cream/20 text-center">
            <badge.icon className="w-5 h-5 text-honeycomb-charcoal" strokeWidth={1.5} />
            <span className="text-xs font-bold text-honeycomb-charcoal">{badge.label}</span>
            <span className="text-xs text-honeycomb-muted">{badge.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
