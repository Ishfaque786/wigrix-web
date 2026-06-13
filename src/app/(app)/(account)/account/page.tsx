import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { AccountForm } from '@/components/forms/AccountForm'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { User, Eye, Star, Settings } from 'lucide-react'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { MyReviews } from '@/components/MyReviews'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
    )
  }

  const resolvedSearchParams = await searchParams
  const activeTab = resolvedSearchParams.tab || 'settings'
  const displayName = user.name?.trim() || 'there'

  const getInitials = (name?: string | null) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const showSettings = activeTab === 'settings'
  const showRecentlyViewed = activeTab === 'recently-viewed'
  const showMyReviews = activeTab === 'my-reviews'

  // Fetch user reviews server-side
  const reviewsResult = await payload.find({
    collection: 'reviews',
    where: {
      user: { equals: user.id },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })
  const reviews = reviewsResult.docs || []

  return (
    <>
      {/* Welcome card */}
      <div className="bg-gradient-to-br from-honeycomb-latte to-honeycomb-cream rounded-3xl p-6 lg:p-8 text-honeycomb-charcoal shadow-lg shadow-honeycomb-cream/15 relative overflow-hidden">
        {/* Decorative background glassmorphic shapes */}
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-honeycomb-cream/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0 text-honeycomb-charcoal font-black text-2xl shadow-sm border border-white/60 backdrop-blur-md">
            {getInitials(user.name)}
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              Welcome back, {displayName}! 👋
            </h2>
            <p className="text-honeycomb-charcoal/80 text-sm mt-1.5 font-medium">
              Signed in as <span className="font-semibold text-honeycomb-charcoal">{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recently Viewed section */}
      {showRecentlyViewed && (
        <div className="bg-white rounded-3xl border-2 border-honeycomb-cream/25 p-6 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-honeycomb-cream/15 flex items-center justify-center">
              <Eye className="w-5 h-5 text-honeycomb-cream" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Recently Viewed</h3>
              <p className="text-xs text-neutral-400">Products you&apos;ve looked at recently</p>
            </div>
          </div>
          <RecentlyViewed />
        </div>
      )}

      {/* My Reviews section */}
      {showMyReviews && (
        <MyReviews reviews={reviews} />
      )}

      {/* Account Settings */}
      {showSettings && (
        <div className="bg-white rounded-3xl border-2 border-honeycomb-cream/25 p-6 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-honeycomb-cream/15 flex items-center justify-center">
              <Settings className="w-5 h-5 text-honeycomb-cream" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Account Settings</h3>
              <p className="text-xs text-neutral-400">Update your name, email, and password</p>
            </div>
          </div>
          <AccountForm />
        </div>
      )}
    </>
  )
}

export const metadata: Metadata = {
  description: 'Manage your Wigrix account, recently viewed products, and review queue.',
  openGraph: mergeOpenGraph({
    title: 'My Account',
    url: '/account',
  }),
  title: 'My Account',
}
