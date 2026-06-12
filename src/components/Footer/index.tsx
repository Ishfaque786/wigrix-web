import Link from 'next/link'
import React from 'react'
import { Instagram, Facebook, Hexagon } from 'lucide-react'
import { LogoIcon } from '@/components/icons/logo'

const footerLinks = {
  products: [
    { name: 'Desk Organisers', href: '/shop?category=desk-organisers' },
    { name: 'Gadget Stands', href: '/shop?category=gadget-stands' },
    { name: 'Desk Planters', href: '/shop?category=desk-planters' },
    { name: 'Accessories', href: '/shop?category=accessories' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Shipping Policy', href: '/shipping' },
    { name: 'Refund Policy', href: '/refund-policy' },
  ],
}

export async function Footer() {
  return (
    <footer className="bg-honeycomb-charcoal relative overflow-hidden text-white">
      {/* Honeycomb pattern overlay — cream coloured */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23C5B99A' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      {/* Decorative floating hexagons */}
      <div className="absolute top-10 left-10 text-honeycomb-cream/10 pointer-events-none">
        <Hexagon className="w-16 h-16" strokeWidth={1} />
      </div>
      <div className="absolute bottom-20 right-10 text-honeycomb-cream/10 pointer-events-none">
        <Hexagon className="w-20 h-20" strokeWidth={1} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-10">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-5" aria-label="Wigrix Home">
              <LogoIcon className="h-8 w-auto" />
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-xs mb-6 text-sm">
              Premium workspace accessories designed to boost your productivity and elevate your desk
              setup.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/wigrix_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wigrix on Instagram"
                className="w-10 h-10 rounded-xl bg-honeycomb-cream/10 flex items-center justify-center hover:bg-honeycomb-cream/20 transition-colors text-honeycomb-cream hover:text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/wigrix_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wigrix on Facebook"
                className="w-10 h-10 rounded-xl bg-honeycomb-cream/10 flex items-center justify-center hover:bg-honeycomb-cream/20 transition-colors text-honeycomb-cream hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Products */}
            <div>
              <h4 className="text-sm font-bold text-honeycomb-cream uppercase tracking-wider mb-4">
                Products
              </h4>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-honeycomb-cream transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold text-honeycomb-cream uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-honeycomb-cream transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold text-honeycomb-cream uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-honeycomb-cream transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-honeycomb-cream/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Wigrix. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Made with ❤️ in India</span>
              <span className="text-lg">🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
