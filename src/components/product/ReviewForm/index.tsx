'use client'

import React, { useState } from 'react'
import { Star, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

type Props = {
  productId: string
  onSuccess?: () => void
  dialogMode?: boolean
}

export default function ReviewForm({ productId, onSuccess, dialogMode = false }: Props) {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [orderId, setOrderId] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Client-side validations
    if (!orderId.trim()) {
      setError('Please provide your Amazon/Flipkart Order ID to verify your purchase.')
      setIsSubmitting(false)
      return
    }

    if (!title.trim()) {
      setError('Please provide a review headline.')
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim(),
          reviewBody: body.trim(),
          orderId: orderId.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setSuccess(true)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        <div>
          <h3 className="font-bold text-emerald-900 text-lg">Review Submitted!</h3>
          <p className="text-sm text-emerald-700 mt-1 max-w-md">
            Thank you! Your review has been submitted for verification. It will be visible to other customers as soon as our team approves the Order ID.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={dialogMode ? "space-y-5" : "space-y-5 p-6 rounded-3xl bg-neutral-50/50 border border-neutral-200/50"}
    >
      {!dialogMode && (
        <h3 className="text-lg font-bold text-honeycomb-charcoal">Write a Customer Review</h3>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Star Rating Picker */}
      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-honeycomb-charcoal">Overall Rating</label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-0.5 rounded-md hover:scale-110 transition-transform focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    isFilled ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Order ID Input */}
      <div className="space-y-1.5">
        <label htmlFor="orderId" className="block text-sm font-bold text-honeycomb-charcoal">
          Amazon / Flipkart Order ID
        </label>
        <input
          id="orderId"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. 403-1234567-1234567"
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-wigrix-teal focus:border-transparent text-sm bg-white"
          required
        />
        <p className="text-xs text-honeycomb-muted">
          Your order ID is used only by our administrators to verify you purchased this product. It will not be shown publicly.
        </p>
      </div>

      {/* Title / Headline */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-bold text-honeycomb-charcoal">
          Review Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-wigrix-teal focus:border-transparent text-sm bg-white"
          required
        />
      </div>

      {/* Review Body */}
      <div className="space-y-1.5">
        <label htmlFor="body" className="block text-sm font-bold text-honeycomb-charcoal">
          Review Comments (Optional)
        </label>
        <textarea
          id="body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you like or dislike? How are you using the product?"
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-wigrix-teal focus:border-transparent text-sm bg-white resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-honeycomb-slate active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  )
}
