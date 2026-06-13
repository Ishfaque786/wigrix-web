import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from 'next/navigation'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-4 py-20">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/50 p-8 shadow-xl shadow-neutral-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center">
          <RenderParams />
          <h1 className="text-2xl font-black text-honeycomb-charcoal tracking-tight">Create Account</h1>
          <p className="text-sm text-honeycomb-muted mt-2">
            Create an account to track recently viewed products and submit verified reviews.
          </p>
        </div>
        <CreateAccountForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
