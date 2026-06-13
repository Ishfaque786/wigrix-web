import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-4 py-20">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/50 p-8 shadow-xl shadow-neutral-100 animate-in fade-in zoom-in-95 duration-300">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Forgot Password',
    url: '/forgot-password',
  }),
  title: 'Forgot Password',
}
