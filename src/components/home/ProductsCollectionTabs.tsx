'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Star, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'

type ProductsCollectionTabsProps = {
  products: Product[]
}

const tabs = [
  { id: 'all', label: 'All Products' },
  { id: 'latest', label: 'Latest Products' },
  { id: 'bestsellers', label: 'Best Sellers' },
  { id: 'featured', label: 'Featured Products' },
]

function getProductPrice(product: Product) {
  const amount = product.priceInUSD
  if (typeof amount !== 'number') return null
  return {
    formatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount),
    amount,
  }
}

export default function ProductsCollectionTabs({ products }: ProductsCollectionTabsProps) {
  const [activeTab, setActiveTab] = useState('latest')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Filter products based on active tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'latest':
        return products.slice(0, 8)
      case 'bestsellers':
        return products.filter((_, i) => i % 2 === 0).slice(0, 8)
      case 'featured':
        return products.filter((_, i) => i % 3 === 0).slice(0, 8)
      default:
        return products
    }
  }

  const filteredProducts = getFilteredProducts()

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScrollButtons)
      return () => ref.removeEventListener('scroll', checkScrollButtons)
    }
  }, [filteredProducts])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320 // Approximate card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:cursor-pointer ${
              activeTab === tab.id
                ? 'bg-honeycomb-charcoal text-white shadow-lg shadow-honeycomb-charcoal/20'
                : 'bg-white text-honeycomb-charcoal hover:bg-honeycomb-light border border-honeycomb-cream/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-honeycomb-light transition-all hover:scale-110 hover:cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-honeycomb-charcoal" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-honeycomb-light transition-all hover:scale-110 hover:cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-honeycomb-charcoal" />
          </button>
        )}

        {/* Scrollable Products Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide overflow-y-visible p-6 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const price = getProductPrice(product)
  const galleryImages = product?.gallery?.filter((img) => typeof img.image === 'object') || []
  const firstImage = galleryImages[0]?.image as Media
  const thumbnailUrl = firstImage?.url || (typeof product.meta?.image === 'object' ? product.meta?.image?.url : undefined)

  // Generate rating
  const rating = (4 + ((product.id?.charCodeAt(0) || 0) % 10) / 10).toFixed(1)

  // Show countdown for first product (demo)
  const showCountdown = index === 0

  return (
    <div
      className="group flex-shrink-0 w-[280px] snap-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-2 border border-honeycomb-cream/30">
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-honeycomb-light overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="280px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-honeycomb-muted text-xs">
              No Image
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all z-20 hover:cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>

          {/* Countdown Timer (for first product) */}
          {showCountdown && (
            <div className="absolute bottom-3 left-3 right-3 z-20">
              <div className="flex items-center gap-1 bg-honeycomb-charcoal/90 backdrop-blur-sm rounded-xl px-3 py-2 text-white">
                <Clock className="w-4 h-4 mr-1" />
                <div className="flex gap-1">
                  {[
                    { value: '05', label: 'Days' },
                    { value: '12', label: 'Hours' },
                    { value: '30', label: 'Mins' },
                    { value: '25', label: 'Secs' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="bg-white/20 rounded px-1.5 py-0.5 text-xs font-bold">
                        {item.value}
                      </div>
                      {i < 3 && <span className="mx-0.5 text-xs">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-honeycomb-muted font-medium">
              {product.categories && product.categories.length > 0
                ? (product.categories[0] as any)?.title || 'Accessory'
                : 'Accessory'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-honeycomb-charcoal">{rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-honeycomb-charcoal text-sm leading-snug line-clamp-2 mb-3 group-hover:text-honeycomb-slate transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            {price ? (
              <span className="font-bold text-honeycomb-charcoal text-lg">{price.formatted}</span>
            ) : (
              <span className="text-sm text-gray-400">Price unavailable</span>
            )}
          </div>

          {/* View Details Button */}
          <Link href={`/products/${product.slug}`} className="block w-full">
            <Button
              variant="honey"
              size="sm"
              className="w-full rounded-xl py-2 text-xs font-semibold hover:cursor-pointer"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
