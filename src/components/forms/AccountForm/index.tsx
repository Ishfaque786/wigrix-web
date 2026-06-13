'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react'
import { cn } from '@/utilities/cn'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const [subTab, setSubTab] = useState<'profile' | 'password'>('profile')

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
          body: JSON.stringify(data),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          toast.success('Successfully updated account.')
          setSubTab('profile')
          reset({
            name: json.doc.name,
            email: json.doc.email,
            password: '',
            passwordConfirm: '',
          })
        } else {
          toast.error('There was a problem updating your account.')
        }
      }
    },
    [user, setUser, reset],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, subTab])

  return (
    <form className="max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      {/* Sub-tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-honeycomb-cream/5 rounded-2xl mb-8 w-fit border border-honeycomb-cream/20">
        <button
          type="button"
          onClick={() => {
            setSubTab('profile')
            reset({
              name: user?.name || '',
              email: user?.email || '',
              password: '',
              passwordConfirm: '',
            })
          }}
          className={cn(
            'flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 hover:cursor-pointer',
            subTab === 'profile'
              ? 'bg-white text-honeycomb-charcoal shadow-md shadow-honeycomb-cream/5 scale-100'
              : 'text-honeycomb-cream/80 hover:text-honeycomb-charcoal hover:bg-white/40',
          )}
        >
          <UserIcon className={cn('w-4 h-4 transition-colors', subTab === 'profile' ? 'text-honeycomb-cream' : 'text-honeycomb-cream/40')} />
          Profile Details
        </button>
        <button
          type="button"
          onClick={() => {
            setSubTab('password')
            reset({
              name: user?.name || '',
              email: user?.email || '',
              password: '',
              passwordConfirm: '',
            })
          }}
          className={cn(
            'flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 hover:cursor-pointer',
            subTab === 'password'
              ? 'bg-white text-honeycomb-charcoal shadow-md shadow-honeycomb-cream/5 scale-100'
              : 'text-honeycomb-cream/80 hover:text-honeycomb-charcoal hover:bg-white/40',
          )}
        >
          <Lock className={cn('w-4 h-4 transition-colors', subTab === 'password' ? 'text-honeycomb-cream' : 'text-honeycomb-cream/40')} />
          Change Password
        </button>
      </div>

      {subTab === 'profile' ? (
        <Fragment>
          <div className="flex flex-col gap-6 mb-8">
            <FormItem className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm font-bold text-neutral-800">
                Full Name
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-honeycomb-cream/80" />
                <Input
                  id="name"
                  placeholder="Your Name"
                  className="bg-white text-neutral-900 pl-10 h-11"
                  {...register('name', { required: 'Please provide a name.' })}
                  type="text"
                />
              </div>
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>

            <FormItem className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-bold text-neutral-800">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-honeycomb-cream/80" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  className="bg-white text-neutral-900 pl-10 h-11"
                  {...register('email', { required: 'Please provide an email.' })}
                  type="email"
                />
              </div>
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="flex flex-col gap-6 mb-8">
            <FormItem className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-bold text-neutral-800">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-honeycomb-cream/80" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  className="bg-white text-neutral-900 pl-10 h-11"
                  {...register('password', { required: 'Please provide a new password.' })}
                  type="password"
                />
              </div>
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem className="flex flex-col gap-1.5">
              <Label htmlFor="passwordConfirm" className="text-sm font-bold text-neutral-800">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-honeycomb-cream/80" />
                <Input
                  id="passwordConfirm"
                  placeholder="••••••••"
                  className="bg-white text-neutral-900 pl-10 h-11"
                  {...register('passwordConfirm', {
                    required: 'Please confirm your new password.',
                    validate: (value) => value === password.current || 'The passwords do not match',
                  })}
                  type="password"
                />
              </div>
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>
          </div>
        </Fragment>
      )}

      <button
        disabled={isLoading || isSubmitting || !isDirty}
        type="submit"
        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-honeycomb-slate active:scale-[0.98] transition-all disabled:opacity-50 hover:cursor-pointer"
      >
        {isLoading || isSubmitting ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            Processing...
          </>
        ) : subTab === 'password' ? (
          <>
            <ShieldCheck className="w-4.5 h-4.5" />
            Change Password
          </>
        ) : (
          <>
            <ShieldCheck className="w-4.5 h-4.5" />
            Update Account
          </>
        )}
      </button>
    </form>
  )
}
