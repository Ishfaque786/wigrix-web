import { Metadata } from 'next'
import { ArrowRight, Sparkles, Star, Truck, Shield, Package, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Product, Category, Media } from '@/payload-types'

import { Button } from '@/components/ui/button'
import HeroImageCarousel from '@/components/home/HeroImageCarousel'
import ProductsCollectionTabs from '@/components/home/ProductsCollectionTabs'

export const metadata: Metadata = {
  title: 'Wigrix | Premium Desk Organisers & Workspace Accessories',
  description: 'Elevate your workspace with premium desk organisers, gadget stands, desk planters, and accessories.',
}

// Trust badges
const trustBadges = [
  { icon: Truck, label: 'Free Shipping', desc: 'Orders ₹999+' },
  { icon: Shield, label: 'Premium Quality', desc: 'Built to last' },
  { icon: Package, label: 'Easy Returns', desc: '30-day policy' },
  { icon: Clock, label: 'Fast Delivery', desc: '2-4 days' },
]


// Featured Collections - Updated with local image paths
const featuredCollections = [
  {
    title: 'Desk Organisers',
    subtitle: 'Declutter your space',
    image: '/images/products/hexagon-organizer.jpg',
    href: '/shop?category=desk-organisers',
  },
  {
    title: 'Gadget Stands',
    subtitle: 'For all your devices',
    image: '/images/products/acoustic-phone-stand.jpg',
    href: '/shop?category=gadget-stands',
  },
  {
    title: 'Desk Planters',
    subtitle: 'Bring nature indoors',
    image: '/images/products/honeycomb-planter.jpg',
    href: '/shop?category=desk-planters',
  },
]

// Map category slugs to preset local images
const categoryImageMap: Record<string, string> = {
  bundles: '/images/products/hexagon-organizer.jpg',
  'desk-organisers': '/images/products/spinning-organizer.jpg',
  'gadget-stands': '/images/products/shade-stand-mini.jpg',
  'desk-planters': '/images/products/honeycomb-planter.jpg',
  'pen-holders': '/images/products/hexagon-organizer.jpg',
  accessories: '/images/products/acoustic-phone-stand.jpg',
}

export default async function Home() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all published products
  const productsResult = await payload.find({
    collection: 'products',
    draft: false,
    limit: 100,
    where: {
      _status: { equals: 'published' },
    },
  })
  const allProducts = productsResult.docs || []

  // Fetch all categories
  const categoriesResult = await payload.find({
    collection: 'categories',
    limit: 100,
  })
  const allCategories = categoriesResult.docs || []

  // Calculate counts for categories
  const categoryCounts = await Promise.all(
    allCategories.map(async (cat) => {
      const prodCountResult = await payload.count({
        collection: 'products',
        where: {
          and: [{ _status: { equals: 'published' } }, { categories: { contains: cat.id } }],
        },
      })
      return {
        handle: cat.slug,
        count: prodCountResult.totalDocs,
      }
    }),
  )

  // Find spinning desk organizer or default to first product
  const spinningOrganizer =
    allProducts.find((p) => p.slug === 'spinning-desk-organiser') || allProducts[0] || null

  // Fallback categories if none exist in CMS yet
  const displayCategories =
    allCategories.length > 0
      ? allCategories.map((cat) => {
          const image = categoryImageMap[cat.slug] || '/images/products/hexagon-organizer.jpg'
          return {
            name: cat.title,
            slug: cat.slug,
            image,
          }
        })
      : [
          { name: 'Bundles', slug: 'bundles', image: '/images/products/hexagon-organizer.jpg' },
          {
            name: 'Organisers',
            slug: 'desk-organisers',
            image: '/images/products/spinning-organizer.jpg',
          },
          { name: 'Stands', slug: 'gadget-stands', image: '/images/products/shade-stand-mini.jpg' },
          { name: 'Planters', slug: 'desk-planters', image: '/images/products/honeycomb-planter.jpg' },
          { name: 'Pen Holders', slug: 'pen-holders', image: '/images/products/hexagon-organizer.jpg' },
          {
            name: 'Accessories',
            slug: 'accessories',
            image: '/images/products/acoustic-phone-stand.jpg',
          },
        ]

  // Spotlight Image Url
  let spotlightImageUrl = '/images/products/spinning-organizer.jpg'
  if (spinningOrganizer) {
    const gallery = spinningOrganizer.gallery?.filter((img) => typeof img.image === 'object') || []
    const firstImage = gallery[0]?.image as Media
    if (firstImage?.url) {
      spotlightImageUrl = firstImage.url
    }
  }

  // Format spotlight price
  const spotlightPrice =
    spinningOrganizer && typeof spinningOrganizer.priceInINR === 'number'
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(spinningOrganizer.priceInINR)
      : '₹949'


  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section - Clean & Impactful */}
      <section className="relative bg-honeycomb-light/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh] py-20 lg:py-24">
            {/* Left: Content */}
            <div className="relative z-10 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-honeycomb-charcoal/5 border border-honeycomb-charcoal/10 text-honeycomb-charcoal text-sm font-medium mb-6 animate-in slide-in-from-left-4 duration-700">
                <Sparkles className="w-4 h-4" />
                Premium 3D Printed Essentials
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-honeycomb-charcoal tracking-tight leading-[1.1] mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-150">
                Organize Your
                <div className="block mt-2">
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-honeycomb-charcoal to-honeycomb-slate">
                      Workspace
                    </span>
                    <span className="absolute bottom-3 left-0 right-0 h-4 bg-honeycomb-cream/60 -z-0 rounded-sm" />
                  </span>
                </div>
              </h1>

              <p className="text-lg lg:text-xl text-honeycomb-medium leading-relaxed max-w-xl mb-10 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                Discover our signature honeycomb collection. Precision-crafted desk accessories that
                blend modern aesthetics with supreme functionality.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-in slide-in-from-bottom-4 duration-700 delay-500">
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto text-base h-12 px-8 shadow-xl shadow-honeycomb-charcoal/10 hover:shadow-2xl hover:shadow-honeycomb-charcoal/20 transition-all hover:cursor-pointer"
                  >
                    Shop Collection
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="xl"
                    className="w-full sm:w-auto text-base h-12 px-8 border-honeycomb-charcoal/20 hover:bg-honeycomb-charcoal/5 hover:cursor-pointer"
                  >
                    Explore Categories
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-honeycomb-cream animate-in slide-in-from-bottom-4 duration-700 delay-700">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-honeycomb-cream border-2 border-white flex items-center justify-center text-sm shadow-sm"
                      >
                        {['👨‍💻', '👩‍🎨', '👨‍💼', '👩‍💻'][i - 1]}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm leading-tight">
                    <span className="block font-bold text-honeycomb-charcoal text-base">2,500+</span>
                    <span className="text-honeycomb-muted">Happy Customers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image Carousel */}
            <HeroImageCarousel products={allProducts} categoryCounts={categoryCounts} />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-honeycomb-cream/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-honeycomb-beige/20 rounded-full blur-[100px] -z-0 -translate-x-1/3 translate-y-1/3" />
      </section>

      {/* Trust Badges - Clean Bar */}
      <section className="py-8 bg-white border-y border-honeycomb-cream/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-4 justify-center lg:justify-start group"
              >
                <div className="w-12 h-12 rounded-2xl bg-honeycomb-light flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-honeycomb-cream/50">
                  <badge.icon className="w-6 h-6 text-honeycomb-charcoal" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-honeycomb-charcoal mb-0.5">{badge.label}</p>
                  <p className="text-xs text-honeycomb-muted">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Bar */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <h2 className="text-lg font-bold text-honeycomb-charcoal uppercase tracking-widest text-opacity-80">
              Explore Categories
            </h2>
          </div>
          <div className="flex justify-center gap-6 lg:gap-10 overflow-x-auto no-scrollbar pb-4">
            {displayCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group flex flex-col items-center flex-shrink-0 min-w-[80px]"
              >
                <div className="relative mb-3">
                  <div className="absolute -inset-2 bg-gradient-to-br from-honeycomb-cream/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden ring-4 ring-honeycomb-light group-hover:ring-honeycomb-cream transition-all duration-300 shadow-lg cursor-pointer">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-honeycomb-charcoal transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Products Collections */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-honeycomb-light/30 via-white to-honeycomb-beige/20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-honeycomb-cream/10 rounded-full blur-[150px] -z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-honeycomb-beige/20 rounded-full blur-[120px] -z-0" />

        <div className="relative mx-auto px-6 md:px-12 max-w-7xl">
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-5 animate-in fade-in duration-700">
              <span className="w-12 h-[3px] bg-gradient-to-r from-transparent via-honeycomb-cream to-honeycomb-cream rounded-full" />
              <span className="text-xs font-bold text-honeycomb-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-honeycomb-cream" />
                Our Products
              </span>
              <span className="w-12 h-[3px] bg-gradient-to-l from-transparent via-honeycomb-cream to-honeycomb-cream rounded-full" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-honeycomb-charcoal mb-4 animate-in slide-in-from-bottom-4 duration-700 delay-150">
              Discover Our{' '}
              <span className="relative inline-block">
                <span className="relative z-10 italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-honeycomb-slate to-honeycomb-charcoal">
                  Premium
                </span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-honeycomb-cream/40 -z-0 rounded-sm" />
              </span>{' '}
              Collections
            </h2>
            <p className="text-honeycomb-medium text-lg max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
              From desk organizers to planters, each piece is thoughtfully designed to bring harmony
              to your workspace.
            </p>
          </div>

          {/* Products Tabs Component */}
          <div className="animate-in fade-in duration-700 delay-500">
            <ProductsCollectionTabs products={allProducts} />
          </div>

          {/* Enhanced View All Products CTA */}
          <div className="text-center mt-16 animate-in slide-in-from-bottom-4 duration-700 delay-700">
            <Link href="/shop">
              <Button
                size="xl"
                className="h-14 px-10 text-base bg-honeycomb-charcoal text-white hover:bg-honeycomb-slate shadow-lg shadow-honeycomb-charcoal/20 hover:shadow-xl hover:shadow-honeycomb-charcoal/30 transition-all duration-300 group relative overflow-hidden hover:cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-honeycomb-charcoal to-honeycomb-slate opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Spotlight Section - Premium Enhanced Design */}
      <section className="py-20 lg:py-32 bg-honeycomb-charcoal relative overflow-hidden text-white">
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0 bg-[url('/images/products/spinning-organizer.jpg')] bg-cover bg-center opacity-[0.15]" />
        <div className="absolute inset-0 bg-gradient-to-r from-honeycomb-charcoal via-honeycomb-charcoal/95 to-honeycomb-charcoal/70" />

        {/* Animated Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-honeycomb-cream/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Enhanced Badge */}
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-honeycomb-cream text-honeycomb-charcoal text-xs font-bold uppercase tracking-[0.15em] shadow-lg shadow-honeycomb-cream/20 animate-in slide-in-from-left-4 duration-700">
                <Star className="w-4 h-4 fill-honeycomb-charcoal" />
                Design Spotlight
              </span>

              {/* Enhanced Title with Animation */}
              <h2 className="text-5xl lg:text-6xl font-bold leading-[1.1] animate-in slide-in-from-bottom-4 duration-700 delay-150">
                The Spinning{' '}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-honeycomb-cream via-honeycomb-cream to-honeycomb-cream bg-[length:200%_auto] animate-gradient">
                  Desk Organizer
                </span>
              </h2>

              {/* Enhanced Description */}
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                <p className="text-gray-200 text-lg leading-relaxed max-w-lg">
                  Experience the perfect blend of engineering and aesthetics. Our signature spinning organizer keeps your tools accessible with a satisfying 360° rotation mechanism.
                </p>

                {/* Feature Highlights */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-honeycomb-cream/90 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-honeycomb-cream" />
                    360° Smooth Rotation
                  </div>
                  <div className="flex items-center gap-2 text-honeycomb-cream/90 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-honeycomb-cream" />
                    Premium 3D Print
                  </div>
                  <div className="flex items-center gap-2 text-honeycomb-cream/90 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-honeycomb-cream" />
                    Eco-Friendly
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-500">
                {spinningOrganizer ? (
                  <Link href={`/products/${spinningOrganizer.slug}`}>
                    <Button
                      size="xl"
                      className="hover:bg-white text-honeycomb-charcoal bg-honeycomb-cream border-0 h-16 px-10 text-base font-bold shadow-xl transition-all duration-300 group relative overflow-hidden hover:cursor-pointer"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Shop Now
                        <span className="text-sm opacity-75">·</span>
                        {spotlightPrice}
                        <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/shop">
                    <Button
                      size="xl"
                      className="hover:bg-white text-honeycomb-charcoal bg-honeycomb-cream border-0 h-16 px-10 text-base font-bold shadow-xl transition-all duration-300 group relative overflow-hidden hover:cursor-pointer"
                    >
                      Shop Collection
                    </Button>
                  </Link>
                )}
                <Link href="/shop">
                  <Button
                    variant="secondary"
                    size="xl"
                    className="border-2 border-white/40 text-white bg-transparent hover:bg-white hover:text-honeycomb-charcoal h-16 px-10 text-base font-semibold backdrop-blur-sm transition-all duration-300 group hover:cursor-pointer"
                  >
                    View All Organizers
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Enhanced Right Side - Product Showcase */}
            <div className="relative hidden lg:flex items-center justify-center h-[550px]">
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border-2 border-honeycomb-cream/10 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[320px] h-[320px] rounded-full border border-honeycomb-cream/5" />
              </div>

              {/* Center Product Image */}
              <div className="relative w-[400px] h-[400px] animate-in zoom-in duration-1000 delay-500 group">
                {/* Soft Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-honeycomb-cream/10 via-white/5 to-honeycomb-cream/10 rounded-full blur-[60px] opacity-50" />

                {/* Product Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[85%] h-[85%]">
                    <Image
                      src={spotlightImageUrl}
                      alt={spinningOrganizer?.title || 'Spinning Desk Organizer'}
                      fill
                      className="object-contain mix-blend-lighten opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 animate-in slide-in-from-right-4 duration-700 delay-700">
                <div className="text-3xl font-bold text-white mb-1">2.5K+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>

              <div className="absolute bottom-20 left-10 bg-honeycomb-cream/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl animate-in slide-in-from-left-4 duration-700 delay-900">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-honeycomb-charcoal text-honeycomb-charcoal" />
                  <span className="text-2xl font-bold text-honeycomb-charcoal">4.9</span>
                </div>
                <div className="text-sm text-honeycomb-charcoal/80 font-medium">Avg. Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-honeycomb-cream uppercase tracking-[0.2em] mb-3 block">
              Curated For You
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-honeycomb-charcoal">
              Shop by{' '}
              <span className="italic font-serif font-normal text-honeycomb-slate">Collection</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {featuredCollections.map((collection, index) => (
              <Link
                key={index}
                href={collection.href}
                className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-honeycomb-cream text-xs font-bold uppercase tracking-wider mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {collection.subtitle}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    {collection.title}
                  </h3>
                  <div className="w-12 h-1 bg-honeycomb-cream rounded-full mb-4 group-hover:w-full transition-all duration-500 ease-out" />
                  <span className="inline-flex items-center text-white text-sm font-bold uppercase tracking-wide group-hover:gap-2 transition-all">
                    Shop collection{' '}
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="relative bg-honeycomb-light/30 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-12">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/products/shade-stand-mini.jpg"
                    alt="Aesthetic Setup"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/products/hexagon-organizer.jpg"
                    alt="Hexagon Design"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/products/honeycomb-planter.jpg"
                    alt="Green Planter"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/products/spinning-organizer.jpg"
                    alt="Spinning Function"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-honeycomb-cream/50 text-honeycomb-charcoal text-sm font-medium mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-honeycomb-cream" />
                About Wigrix
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-honeycomb-charcoal leading-[1.1] mb-8">
                Crafting the future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-honeycomb-charcoal to-honeycomb-slate">
                  workspace design.
                </span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At Wigrix, we believe that your workspace is a reflection of your mind. A cluttered
                desk leads to a cluttered mind, while a beautiful, organized space inspires
                creativity and focus.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                Using advanced 3D printing technology and eco-friendly biodegradable plastics, we
                sculpt functional art pieces that don&apos;t just organize your tools—they elevate
                your entire work experience.
              </p>

              <div className="flex gap-12 border-t border-honeycomb-charcoal/10 pt-8">
                <div>
                  <span className="block text-3xl font-bold text-honeycomb-charcoal mb-1">100%</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wider">
                    Eco-Friendly
                  </span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-honeycomb-charcoal mb-1">Hand</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Finished</span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-honeycomb-charcoal mb-1">Local</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wider">
                    Made in India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-honeycomb-charcoal relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-honeycomb-cream/10 rounded-full blur-[120px]" />

        <div className="relative max-w-xl mx-auto px-6 text-center">
          <span className="inline-block text-4xl mb-6">✨</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Join the Wigrix Family</h2>
          <p className="text-gray-300 mb-10 text-lg">
            Subscribe to get updates on new products, marketplace deals, and workspace setup
            inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:border-honeycomb-cream focus:ring-1 focus:ring-honeycomb-cream transition-all"
            />
            <Button
              size="xl"
              className="bg-honeycomb-cream text-honeycomb-charcoal hover:bg-white px-8 py-4 h-auto rounded-full font-bold text-base shadow-lg shadow-honeycomb-cream/20 hover:cursor-pointer"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-6 font-medium tracking-wide">
            NO SPAM, UNSUBSCRIBE ANYTIME.
          </p>
        </div>
      </section>
    </main>
  )
}
