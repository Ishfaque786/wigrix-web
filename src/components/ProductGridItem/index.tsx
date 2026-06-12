import type { Product, Variant } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title } = product

  let price = priceInUSD

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInUSD &&
      typeof variant.priceInUSD === 'number'
    ) {
      price = variant.priceInUSD
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  return (
    <Link className="relative inline-block h-full w-full group" href={`/products/${product.slug}`}>
      {image ? (
        <div className="relative overflow-hidden aspect-square border border-honeycomb-cream/30 rounded-2xl p-8 bg-honeycomb-light/30">
          <Media
            className={clsx(
              'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
            )}
            height={80}
            imgClassName={clsx('h-full w-full object-cover rounded-2xl')}
            resource={image}
            width={80}
          />
        </div>
      ) : null}

      <div className="flex justify-between items-center mt-4 font-semibold text-honeycomb-charcoal group-hover:text-honeycomb-slate transition-colors text-sm">
        <div>{title}</div>

        {typeof price === 'number' && (
          <div className="text-honeycomb-charcoal">
            <Price amount={price} />
          </div>
        )}
      </div>
    </Link>
  )
}
