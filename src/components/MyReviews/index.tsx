'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MessageSquare, ShoppingBag } from 'lucide-react'

type Props = {
  reviews: any[]
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const MyReviews: React.FC<Props> = ({ reviews = [] }) => {

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border-2 border-honeycomb-cream/25 p-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-honeycomb-cream/5 border border-honeycomb-cream/20 flex items-center justify-center mx-auto mb-4 text-honeycomb-cream/70">
          <MessageSquare className="w-8 h-8" />
        </div>
        <p className="text-neutral-700 font-bold text-base">No reviews submitted yet</p>
        <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
          Products you submit reviews for will appear here after verification.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-wigrix-teal hover:bg-wigrix-teal-dark text-white font-bold text-sm rounded-full transition-colors shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-honeycomb-cream/25 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-honeycomb-cream/20">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Reviewed Products</h3>
          <p className="text-xs text-neutral-400">Products you have submitted reviews for</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => {
          const product = review.product
          if (!product || typeof product !== 'object') return null

          const image = product.gallery?.[0]?.image
          const imageUrl = typeof image === 'object' && image !== null ? image.url : null
          
          let price = product.priceInUSD
          const variants = product.variants?.docs
          if (variants && variants.length > 0) {
            const variant = variants[0]
            if (variant && typeof variant === 'object' && variant?.priceInUSD && typeof variant.priceInUSD === 'number') {
              price = variant.priceInUSD
            }
          }

          const formattedDate = new Date(review.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })

          return (
            <div
              key={review.id}
              className="flex flex-col md:flex-row gap-5 p-5 bg-honeycomb-cream/5 border border-honeycomb-cream/20 rounded-3xl hover:border-honeycomb-cream/40 hover:bg-honeycomb-cream/10 transition-all duration-300 shadow-sm"
            >
              {/* Product Info Block */}
              <div className="flex items-start gap-4 md:w-1/3 flex-shrink-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-16 h-16 rounded-2xl bg-white border border-honeycomb-cream/20 overflow-hidden flex-shrink-0 shadow-sm"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-300 text-xl">
                      🏮
                    </div>
                  )}
                </Link>
                <div className="min-w-0">
                  <Link href={`/products/${product.slug}`}>
                    <h4 className="text-xs font-bold text-neutral-800 line-clamp-2 hover:text-honeycomb-cream transition-colors leading-snug">
                      {product.title}
                    </h4>
                  </Link>
                  {price && (
                    <p className="text-xs font-bold text-neutral-500 mt-1">
                      {formatINR(price)}
                    </p>
                  )}
                </div>
              </div>

              {/* Review Details Block */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-black text-neutral-850 ml-1">
                        {review.title}
                      </span>
                    </div>
                  </div>
                  {review.body && (
                    <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-3">
                      {review.body}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-honeycomb-cream/80 font-bold mt-auto pt-2 border-t border-dashed border-honeycomb-cream/20">
                  <span>Submitted on {formattedDate}</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded-md border border-honeycomb-cream/20">
                    Order: <span className="text-neutral-600 select-all">{review.orderId}</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
