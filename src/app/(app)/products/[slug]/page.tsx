import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { ChevronRight, Star, Package, Truck, Shield, ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import { TrackView } from '@/components/TrackView'
import { AddToReviewQueueButton } from '@/components/ReviewQueue'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []
  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'
  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: { follow: canIndex, index: canIndex },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant?.inventory > 0
      })
    : product.inventory! > 0

  let price = product.priceInUSD
  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object' && variant?.priceInUSD && acc && variant?.priceInUSD > acc) {
        return variant.priceInUSD
      }
      return acc
    }, price)
  }

  // Get category info for breadcrumbs
  const categoryName =
    product.categories && Array.isArray(product.categories) && product.categories.length > 0
      ? (product.categories[0] as any)?.title || 'Products'
      : 'Products'

  const categorySlug =
    product.categories && Array.isArray(product.categories) && product.categories.length > 0
      ? (product.categories[0] as any)?.slug || ''
      : ''

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: (gallery[0]?.image as Media)?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'INR',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  // Data for tracking
  const firstImage = gallery[0]?.image as Media | undefined
  const firstExternalLink = product.externalLinks?.[0]

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        type="application/ld+json"
      />

      {/* Track this product view in localStorage */}
      <TrackView
        product={{
          id: product.id,
          slug: product.slug!,
          title: product.title,
          priceInUSD: price ?? null,
          imageUrl: firstImage?.url ?? null,
          categoryName,
          externalLinks: product.externalLinks?.map((l) => ({ url: l.url, label: l.label })),
        }}
      />

      <main className="min-h-screen bg-honeycomb-warm">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-4">
          <nav className="flex items-center gap-2 text-sm text-honeycomb-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-honeycomb-charcoal transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-honeycomb-charcoal transition-colors">
              Shop
            </Link>
            {categoryName && categoryName !== 'Products' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link
                  href={`/shop?category=${categorySlug}`}
                  className="hover:text-honeycomb-charcoal transition-colors"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-honeycomb-charcoal font-medium line-clamp-1">{product.title}</span>
          </nav>
        </div>

        {/* Product Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <div className="flex flex-col gap-12 rounded-3xl border border-honeycomb-cream/30 p-6 md:p-10 lg:flex-row lg:gap-10 bg-white shadow-sm">
            {/* Gallery */}
            <div className="h-full w-full basis-full lg:basis-1/2">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden bg-honeycomb-light/30 rounded-2xl animate-pulse" />
                }
              >
                {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
              </Suspense>
            </div>

            {/* Description */}
            <div className="basis-full lg:basis-1/2">
              <ProductDescription product={product} />
              {/* Review Queue button */}
              <div className="mt-4">
                <AddToReviewQueueButton
                  product={{
                    id: product.id,
                    slug: product.slug!,
                    title: product.title,
                    price: price ?? null,
                    imageUrl: firstImage?.url ?? null,
                    categoryName,
                    externalLinks: product.externalLinks?.map((l) => ({ url: l.url, label: l.label })),
                    addedAt: 0,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Blocks */}
        {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : <></>}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
            <RelatedProducts products={relatedProducts as Product[]} />
          </div>
        )}
      </main>
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-[3px] bg-honeycomb-cream rounded-full" />
        <h2 className="text-2xl font-bold text-honeycomb-charcoal">You May Also Like</h2>
        <span className="w-10 h-[3px] bg-honeycomb-cream rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const gallery = product.gallery?.filter((img) => typeof img.image === 'object') || []
          const firstImage = gallery[0]?.image as Media
          const thumbnailUrl = firstImage?.url || null
          const priceFormatted =
            typeof product.priceInUSD === 'number'
              ? new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(product.priceInUSD)
              : null

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-honeycomb-cream/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-square bg-honeycomb-light/40 overflow-hidden">
                {thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-honeycomb-muted text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-honeycomb-charcoal line-clamp-1 group-hover:text-honeycomb-slate transition-colors">
                  {product.title}
                </p>
                {priceFormatted && (
                  <p className="text-sm font-bold text-honeycomb-charcoal mt-0.5">{priceFormatted}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInUSD: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}
