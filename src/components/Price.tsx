import React from 'react'

type BaseProps = {
  className?: string
  as?: 'span' | 'p'
}

type PriceFixed = {
  amount: number
  highestAmount?: never
  lowestAmount?: never
}

type PriceRange = {
  amount?: never
  highestAmount: number
  lowestAmount: number
}

type Props = BaseProps & (PriceFixed | PriceRange)

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const Price = ({
  amount,
  className,
  highestAmount,
  lowestAmount,
  as = 'p',
}: Props & React.ComponentProps<'p'>) => {
  const Element = as

  if (typeof amount === 'number') {
    return (
      <Element className={className} suppressHydrationWarning>
        {formatINR(amount)}
      </Element>
    )
  }

  if (highestAmount && highestAmount !== lowestAmount) {
    return (
      <Element className={className} suppressHydrationWarning>
        {`${formatINR(lowestAmount)} - ${formatINR(highestAmount)}`}
      </Element>
    )
  }

  if (lowestAmount) {
    return (
      <Element className={className} suppressHydrationWarning>
        {formatINR(lowestAmount)}
      </Element>
    )
  }

  return null
}
