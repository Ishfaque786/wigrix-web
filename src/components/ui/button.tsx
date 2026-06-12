import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/cn'

const buttonVariants = cva(
  "relative inline-flex items-center justify-center hover:cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 ',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-input bg-card shadow-xs hover:bg-accent hover:bg-primary-foreground',
        secondary:
          'bg-white text-honeycomb-dark border border-honeycomb-cream/40 hover:bg-honeycomb-light hover:border-honeycomb-cream shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-full',
        ghost:
          'text-primary/50 hover:text-primary [&.active]:text-primary py-2 px-4 uppercase font-mono tracking-widest text-xs',
        link: 'text-primary underline-offset-4 hover:underline',
        nav: 'text-primary/50 hover:text-primary [&.active]:text-primary p-0 pt-2 pb-6 uppercase font-mono tracking-widest text-xs',
        // Wigrix Custom Variants
        primary:
          'bg-honeycomb-charcoal border-[3px] border-white text-white hover:bg-honeycomb-slate shadow-lg shadow-honeycomb-charcoal/25 hover:shadow-xl hover:-translate-y-0.5 rounded-full',
        glass:
          'bg-white/10 backdrop-blur-xl border border-honeycomb-cream/30 text-white hover:bg-honeycomb-cream/20 shadow-lg rounded-full',
        honey:
          'bg-gradient-to-r from-honeycomb-sand via-honeycomb-cream to-honeycomb-beige text-honeycomb-dark font-semibold shadow-lg shadow-honeycomb-cream/30 hover:shadow-xl hover:shadow-honeycomb-beige/40 hover:-translate-y-1 relative overflow-hidden rounded-full',
      },
      size: {
        clear: '',
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        xl: 'h-14 px-10 py-4 text-base font-semibold rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
