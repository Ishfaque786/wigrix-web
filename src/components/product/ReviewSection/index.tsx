'use client'

import React, { useState } from 'react'
import type { Review } from '@/payload-types'
import { Star, MessageSquare, Clock, LogIn, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ReviewForm from '../ReviewForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type Props = {
  productId: string
  reviews: Review[]
  userId?: string | null
}

export default function ReviewSection({ productId, reviews, userId }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const approvedReviews = reviews.filter((r) => r.status === 'approved')
  const reviewCount = approvedReviews.length
  const averageRating =
    reviewCount > 0 ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0

  // Calculate distribution (1 to 5 stars)
  const distribution = [0, 0, 0, 0, 0]
  approvedReviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating - 1]++
    }
  })

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return [1, 2, 3, 4, 5].map((i) => {
      const fillPercent = Math.min(Math.max(rating - (i - 1), 0), 1) * 100
      return (
        <div key={i} className={`relative ${size}`}>
          <Star className={`absolute inset-0 ${size} text-neutral-200`} />
          {fillPercent > 0 && (
            <div
              className={`absolute inset-0 overflow-hidden ${size}`}
              style={{ width: `${fillPercent}%` }}
            >
              <Star className={`${size} fill-amber-400 text-amber-400`} />
            </div>
          )}
        </div>
      )
    })
  }

  // Check if current user has already submitted a review
  const hasReviewed = reviews.some((r) => {
    if (!userId) return false
    return typeof r.user === 'object' && r.user !== null
      ? r.user.id === userId
      : r.user === userId
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="mt-16 border-t border-honeycomb-cream/40 pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Summary & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xs border border-honeycomb-cream/35 p-6 rounded-3xl shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-honeycomb-charcoal flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-wigrix-teal" />
                Customer Reviews
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-4xl font-extrabold text-honeycomb-charcoal tracking-tight">
                  {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                </span>
                <div>
                  <div className="flex items-center gap-0.5">{renderStars(averageRating, "w-4.5 h-4.5")}</div>
                  <p className="text-xs text-honeycomb-muted mt-1 font-semibold">
                    {reviewCount} {reviewCount === 1 ? 'global rating' : 'global ratings'}
                  </p>
                </div>
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-3 pt-4 border-t border-honeycomb-cream/20">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star - 1]
                const percent = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0
                return (
                  <div key={star} className="flex items-center gap-3 text-xs font-semibold">
                    <span className="w-12 text-honeycomb-medium">{star} star</span>
                    <div className="flex-1 h-2 bg-neutral-150/70 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-honeycomb-muted">{percent}%</span>
                  </div>
                )
              })}
            </div>

            {/* Review Submission Area */}
            <div className="pt-6 border-t border-honeycomb-cream/20">
              {!userId ? (
                <div className="p-4 rounded-2xl bg-ikstudio-beige/20 border border-honeycomb-cream/30 text-center space-y-3">
                  <p className="text-xs text-honeycomb-medium leading-relaxed font-semibold">
                    Have you purchased this product? Log in to share your thoughts with other customers.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-honeycomb-charcoal rounded-full hover:bg-wigrix-teal hover:shadow-md hover:shadow-wigrix-teal/20 active:scale-[0.98] transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In to Review
                  </Link>
                </div>
              ) : hasReviewed ? (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/40 text-center">
                  <p className="text-xs text-honeycomb-medium font-semibold text-neutral-600">
                    You have already submitted a review for this product. Thank you for your feedback!
                  </p>
                </div>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-wigrix-teal hover:shadow-md hover:shadow-wigrix-teal/20 active:scale-[0.98] transition-all hover:cursor-pointer">
                      Write a Review
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold text-honeycomb-charcoal">Write a Customer Review</DialogTitle>
                    </DialogHeader>
                    <ReviewForm productId={productId} dialogMode={true} onSuccess={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-lg font-bold text-honeycomb-charcoal flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-honeycomb-muted" />
            Product Feedback
          </h3>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="group relative bg-white border border-honeycomb-cream/25 hover:border-wigrix-teal/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-wigrix-teal/20 to-wigrix-teal/5 flex items-center justify-center text-sm font-bold text-wigrix-teal-dark uppercase shadow-inner">
                        {review.userName?.substring(0, 2) || 'AN'}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-honeycomb-charcoal block group-hover:text-wigrix-teal transition-colors">
                          {review.userName}
                        </span>
                        <span className="text-xs text-honeycomb-muted block mt-0.5">
                          Reviewed on {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 bg-honeycomb-light/50 px-2.5 py-1 rounded-full border border-honeycomb-cream/10">
                      {renderStars(review.rating, "w-3.5 h-3.5")}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-bold text-honeycomb-charcoal text-base">{review.title}</h4>
                    {review.body && (
                      <p className="text-sm text-honeycomb-medium mt-2 leading-relaxed whitespace-pre-line text-neutral-600">
                        {review.body}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-neutral-50/50 border border-neutral-100 text-center">
              <p className="text-sm text-honeycomb-muted font-medium">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
