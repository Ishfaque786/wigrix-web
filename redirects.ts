import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const disabledCartRedirects = [
    {
      source: '/checkout',
      destination: '/shop',
      permanent: false,
    },
    {
      source: '/checkout/:path*',
      destination: '/shop',
      permanent: false,
    },
    {
      source: '/orders',
      destination: '/account',
      permanent: false,
    },
    {
      source: '/orders/:path*',
      destination: '/account',
      permanent: false,
    },
    {
      source: '/cart',
      destination: '/shop',
      permanent: false,
    },
  ]

  return [internetExplorerRedirect, ...disabledCartRedirects]
}
