import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderParams } from '@/components/RenderParams'
import { AccountNav } from '@/components/AccountNav'
import Link from 'next/link'
import { HelpCircle, ArrowRight } from 'lucide-react'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const userName = user ? `${user.name || ''}`.trim() || null : null
  const userEmail = user?.email || null

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <RenderParams className="" />
          <h1 className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
            My Account
          </h1>
          <p className="text-neutral-500 mt-1 font-medium">
            Manage your profile and track your product interests
          </p>
        </div>

        {/* Mobile nav (above content) */}
        {user && (
          <AccountNav
            userEmail={userEmail}
            userName={userName}
          />
        )}

        {/* Content grid: sidebar + main */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Sidebar — desktop only */}
          {user && (
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <AccountNav
                userEmail={userEmail}
                userName={userName}
              />
            </div>
          )}

          {/* Main content */}
          <div className="min-w-0 flex flex-col gap-6">{children}</div>
        </div>

        {/* Help section */}
        <div className="mt-12 bg-white rounded-3xl border-2 border-neutral-100 p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-wigrix-teal/10 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-wigrix-teal" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Need Help?</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Find answers to frequently asked questions or reach out to us directly.
                </p>
              </div>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-2 px-5 py-2.5 bg-wigrix-teal/10 text-wigrix-teal font-bold text-sm rounded-full hover:bg-wigrix-teal hover:text-white transition-colors whitespace-nowrap"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
