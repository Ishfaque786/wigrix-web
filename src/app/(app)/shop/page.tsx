import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Package } from 'lucide-react'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    ...(searchValue || category
      ? {
          where: {
            and: [
              {
                _status: {
                  equals: 'published',
                },
              },
              ...(searchValue
                ? [
                    {
                      or: [
                        {
                          title: {
                            like: searchValue,
                          },
                        },
                        {
                          description: {
                            like: searchValue,
                          },
                        },
                      ],
                    },
                  ]
                : []),
              ...(category
                ? [
                    {
                      categories: {
                        contains: category,
                      },
                    },
                  ]
                : []),
            ],
          },
        }
      : {}),
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative bg-gradient-to-br from-ikstudio-cream via-white to-ikstudio-beige/30 border-b border-neutral-100 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-ikstudio-terracotta/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ikstudio-sage/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ikstudio-terracotta text-white text-xs font-bold mb-6 uppercase tracking-wider shadow-lg shadow-ikstudio-terracotta/20">
                <Package className="w-4 h-4" />
                All Products
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ikstudio-charcoal tracking-tight"
                data-testid="store-page-title"
              >
                Shop All
              </h1>
              <p className="text-ikstudio-warmgrey mt-4 max-w-lg text-lg font-medium">
                Explore our complete collection of premium organisers and workspace accessories.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        {searchValue ? (
          <p className="mb-8 text-neutral-500">
            {products.docs?.length === 0
              ? 'There are no products that match '
              : `Showing ${products.docs.length} ${resultsText} for `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}

        {!searchValue && products.docs?.length === 0 && (
          <p className="mb-8 text-neutral-500">No products found. Please try different filters.</p>
        )}

        {products?.docs.length > 0 ? (
          <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.docs.map((product) => {
              return <ProductGridItem key={product.id} product={product} />
            })}
          </Grid>
        ) : null}
      </div>
    </main>
  )
}
