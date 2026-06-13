import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { AccountForm } from '@/components/forms/AccountForm'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { User, Eye, Star, Settings } from 'lucide-react'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { ReviewQueue } from '@/components/ReviewQueue'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
    )
  }

  const displayName = user.name?.trim() || 'there'

  return (
    <>
      {/* Welcome card */}
      <div className="bg-white rounded-3xl border-2 border-neutral-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-wigrix-teal/10 flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-wigrix-teal" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              Welcome back, {displayName}! 👋
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Signed in as{' '}
              <span className="font-medium text-neutral-700">{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recently Viewed section */}
      <div className="bg-white rounded-3xl border-2 border-neutral-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-wigrix-teal/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-wigrix-teal" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Recently Viewed</h3>
            <p className="text-xs text-neutral-400">Products you&apos;ve looked at recently</p>
          </div>
        </div>
        <RecentlyViewed />
      </div>

      {/* Review Queue section */}
      <div className="bg-white rounded-3xl border-2 border-neutral-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Review Queue</h3>
            <p className="text-xs text-neutral-400">
              Products you want to review on Amazon or Flipkart
            </p>
          </div>
        </div>
        <ReviewQueue />
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-3xl border-2 border-neutral-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-neutral-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Account Settings</h3>
            <p className="text-xs text-neutral-400">Update your name, email, and password</p>
          </div>
        </div>
        <AccountForm />
      </div>
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
