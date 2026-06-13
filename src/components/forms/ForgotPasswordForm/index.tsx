'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'There was a problem while attempting to send you a password reset email. Please try again.',
      )
    }
  }, [])

  return (
    <Fragment>
      {!success && (
        <React.Fragment>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-honeycomb-charcoal tracking-tight">Forgot Password</h2>
            <p className="text-sm text-honeycomb-muted mt-2">
              Enter your email address and we will send you instructions to reset your password safely.
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Message error={error} />

            <FormItem className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-bold text-honeycomb-charcoal">
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                className="bg-white text-neutral-900"
                {...register('email', { required: 'Please provide your email.' })}
                type="email"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-honeycomb-slate active:scale-[0.98] transition-all hover:cursor-pointer"
              >
                Send Reset Link
              </button>

              <p className="text-xs text-center text-honeycomb-muted font-medium mt-1">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="text-wigrix-teal hover:text-wigrix-teal/80 font-bold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </React.Fragment>
      )}
      {success && (
        <React.Fragment>
          <div className="text-center py-4 space-y-3">
            <h2 className="text-2xl font-black text-honeycomb-charcoal tracking-tight">Email Sent!</h2>
            <p className="text-sm text-honeycomb-medium leading-relaxed">
              We have sent a password reset link to your email address. Please check your inbox and follow the instructions.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center py-2.5 px-6 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-honeycomb-slate transition-all hover:cursor-pointer"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </React.Fragment>
      )}
    </Fragment>
  )
}
