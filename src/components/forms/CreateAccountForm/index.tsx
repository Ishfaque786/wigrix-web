'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login({ email: data.email, password: data.password })
        clearTimeout(timer)
        if (redirect) router.push(redirect)
        else router.push(`/account?success=${encodeURIComponent('Account created successfully')}`)
      } catch (_) {
        clearTimeout(timer)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} />

      <div className="space-y-4">
        <FormItem className="flex flex-col gap-1.5">
          <Label htmlFor="name" className="text-sm font-bold text-honeycomb-charcoal">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            className="bg-white text-neutral-900"
            {...register('name', { required: 'Name is required.' })}
            type="text"
          />
          {errors.name && <FormError message={errors.name.message} />}
        </FormItem>

        <FormItem className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-sm font-bold text-honeycomb-charcoal">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            className="bg-white text-neutral-900"
            {...register('email', { required: 'Email is required.' })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-sm font-bold text-honeycomb-charcoal">
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            className="bg-white text-neutral-900"
            {...register('password', { required: 'Password is required.' })}
            type="password"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem className="flex flex-col gap-1.5">
          <Label htmlFor="passwordConfirm" className="text-sm font-bold text-honeycomb-charcoal">
            Confirm Password
          </Label>
          <Input
            id="passwordConfirm"
            placeholder="••••••••"
            className="bg-white text-neutral-900"
            {...register('passwordConfirm', {
              required: 'Please confirm your password.',
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
            type="password"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <button
          disabled={loading}
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-honeycomb-slate active:scale-[0.98] transition-all disabled:opacity-50 hover:cursor-pointer"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-xs text-center text-honeycomb-muted font-medium mt-1">
          Already have an account?{' '}
          <Link
            href={`/login${allParams}`}
            className="text-wigrix-teal hover:text-wigrix-teal/80 font-bold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
