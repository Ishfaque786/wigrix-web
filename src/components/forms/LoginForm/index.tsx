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
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (redirect?.current) router.push(redirect.current)
        else router.push('/account')
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
  )

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} />
      
      <div className="space-y-4">
        <FormItem className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-sm font-bold text-honeycomb-charcoal">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="bg-white text-neutral-900"
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-bold text-honeycomb-charcoal">Password</Label>
            <Link
              href={`/forgot-password${allParams}`}
              className="text-xs text-wigrix-teal hover:text-wigrix-teal/80 transition-colors font-bold"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="bg-white text-neutral-900"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-honeycomb-slate active:scale-[0.98] transition-all disabled:opacity-50 hover:cursor-pointer"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="text-xs text-center text-honeycomb-muted font-medium mt-1">
          Don&apos;t have an account?{' '}
          <Link
            href={`/create-account${allParams}`}
            className="text-wigrix-teal hover:text-wigrix-teal/80 font-bold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}
