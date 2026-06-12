'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Hexagon, ArrowUpRight } from 'lucide-react'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import type { Product } from '@/payload-types'

// Fallback images in case products don't have images
const fallbackImages = [
  {
    src: '/images/products/shade-stand-mini.jpg',
    title: 'Shade Stand Mini',
    subtitle: 'Premium Sunglasses Holder',
  },
  {
    src: '/images/products/spinning-organizer.jpg',
    title: 'Spinning Organizer',
    subtitle: '360° Desk Caddy',
  },
  {
    src: '/images/products/honeycomb-planter.jpg',
    title: 'Honeycomb Planter',
    subtitle: 'Desk Plant Holder',
  },
  {
    src: '/images/products/acoustic-phone-stand.jpg',
    title: 'Acoustic Phone Stand',
    subtitle: 'Natural Sound Amplifier',
  },
]

type CategoryCard = {
  name: string
  itemCount: string
  image: string
  href: string
}

type HeroImageCarouselProps = {
  products?: Product[]
  categoryCounts?: { handle: string; count: number }[]
}

// Default category cards structure
const defaultCategoryCards: CategoryCard[] = [
  {
    name: 'Desk Organisers',
    itemCount: '0',
    image: '/images/products/spinning-organizer.jpg',
    href: '/shop?category=desk-organisers',
  },
  {
    name: 'Planters',
    itemCount: '0',
    image: '/images/products/honeycomb-planter.jpg',
    href: '/shop?category=desk-planters',
  },
]

export default function HeroImageCarousel({
  products,
  categoryCounts,
}: HeroImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Build category cards with dynamic counts
  const categoryCards: CategoryCard[] = defaultCategoryCards.map((card) => {
    // category query parameter is category slug
    const handle = card.href.split('=').pop() || ''
    const categoryData = categoryCounts?.find((c) => c.handle === `${handle}`)
    return {
      ...card,
      itemCount: categoryData?.count ? `${categoryData.count}` : '0',
    }
  })

  // Use products if available, otherwise use fallback
  const hasProducts = products && products.length > 0
  const itemCount = hasProducts ? Math.min(products.length, 4) : fallbackImages.length

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % itemCount)
  }, [itemCount])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount)
  }, [itemCount])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  // Touch swipe handling
  const touchRef = useRef<{ startX: number; startY: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return

    const deltaX = e.touches[0].clientX - touchRef.current.startX
    const deltaY = e.touches[0].clientY - touchRef.current.startY

    // If horizontal swipe is greater than vertical, prevent scroll
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return

      const deltaX = e.changedTouches[0].clientX - touchRef.current.startX
      const deltaY = e.changedTouches[0].clientY - touchRef.current.startY
      const swipeThreshold = 50

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          prevSlide()
        } else {
          nextSlide()
        }
      }

      touchRef.current = null
    },
    [nextSlide, prevSlide],
  )

  // Get current item data
  const getCurrentItem = () => {
    if (hasProducts) {
      const product = products[currentIndex]
      const galleryImages = product?.gallery?.filter((img) => typeof img.image === 'object') || []
      const firstImage = galleryImages[0]?.image as any
      const thumbnailUrl = firstImage?.url || product?.meta?.image

      return {
        src: thumbnailUrl || fallbackImages[currentIndex % fallbackImages.length].src,
        title: product?.title || 'Featured Product',
        subtitle:
          product?.categories && product.categories.length > 0
            ? (product.categories[0] as any)?.title || 'Premium Accessory'
            : 'Premium Accessory',
        slug: product?.slug || '',
        product: product,
      }
    }
    return { ...fallbackImages[currentIndex], slug: '', product: null }
  }

  const currentItem = getCurrentItem()

  // Build carousel items
  const getCarouselItems = () => {
    if (hasProducts) {
      return products.slice(0, 4).map((product, index) => {
        const galleryImages = product?.gallery?.filter((img) => typeof img.image === 'object') || []
        const firstImage = galleryImages[0]?.image as any
        const thumbnailUrl = firstImage?.url || product?.meta?.image

        return {
          src: thumbnailUrl || fallbackImages[index % fallbackImages.length].src,
          title: product?.title || 'Featured Product',
          subtitle:
            product?.categories && product.categories.length > 0
              ? (product.categories[0] as any)?.title || 'Premium Accessory'
              : 'Premium Accessory',
          slug: product?.slug || '',
        }
      })
    }
    return fallbackImages.map((img) => ({ ...img, slug: '' }))
  }

  const carouselItems = getCarouselItems()

  return (
    <div className="order-1 lg:order-2">
      <div className="relative animate-in zoom-in-95 duration-1000">
        {/* Main large image - Carousel */}
        <div
          className="relative aspect-[4/5] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-honeycomb-charcoal/20 border-8 border-white group touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                priority={index === 0}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

          {/* Floating product card */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6 lg:left-10 lg:right-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-white">
              {/* Icon - Hidden on very small screens */}
              <div className="hidden sm:flex w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Hexagon className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-medium opacity-80 mb-0.5 sm:mb-1">
                  Featured Product
                </p>
                <p className="text-base sm:text-lg font-bold leading-tight mb-0.5 sm:mb-1 truncate">
                  {currentItem.title}
                </p>
                <p className="text-xs sm:text-sm opacity-90 truncate">{currentItem.subtitle}</p>
              </div>

              {/* Link to Product Detail */}
              {currentItem.slug ? (
                <Link
                  href={`/products/${currentItem.slug}`}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full bg-white text-honeycomb-charcoal font-semibold text-sm hover:bg-honeycomb-cream transition-all shadow-lg hover:scale-105"
                >
                  Buy Now
                </Link>
              ) : (
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-honeycomb-charcoal font-semibold text-sm hover:bg-honeycomb-cream transition-all shadow-lg hover:scale-105"
                >
                  Shop Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Category Cards - Right Side */}
        <div className="absolute -right-4 lg:-right-16 top-4 flex flex-col gap-4 z-20 hidden lg:flex">
          {categoryCards.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-x-2 w-40 lg:w-48"
            >
              {/* Image */}
              <div className="relative h-24 lg:h-28 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Arrow button */}
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md group-hover:bg-honeycomb-charcoal group-hover:text-white transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="font-bold text-honeycomb-charcoal text-sm">{category.name}</h4>
                <p className="text-xs text-honeycomb-muted">{category.itemCount} Items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Carousel Navigation - Bottom */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 lg:mt-8">
        <button
          onClick={prevSlide}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-honeycomb-cream/50 flex items-center justify-center shadow-md hover:shadow-lg hover:bg-honeycomb-light transition-all duration-300 hover:scale-105 group"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-honeycomb-charcoal group-hover:text-honeycomb-slate transition-colors" />
        </button>

        {/* Dots indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white border border-honeycomb-cream/50 rounded-full shadow-md">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-5 sm:w-7 bg-honeycomb-charcoal'
                  : 'w-2 sm:w-2.5 bg-honeycomb-cream hover:bg-honeycomb-muted'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-honeycomb-charcoal flex items-center justify-center shadow-md hover:shadow-lg hover:bg-honeycomb-slate transition-all duration-300 hover:scale-105"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
