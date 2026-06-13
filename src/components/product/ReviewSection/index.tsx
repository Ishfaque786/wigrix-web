import React from 'react'
import type { Review } from '@/payload-types'
import { Star, MessageSquare, Clock, ShieldCheck, LogIn } from 'lucide-react'
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
  const approvedReviews = reviews.filter((r) => r.status === 'approved')
  const pendingReviews = reviews.filter((r) => {
    if (r.status !== 'pending' || !userId) return false
    return typeof r.user === 'object' && r.user !== null
      ? r.user.id === userId
      : r.user === userId
  })

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
          <div>
            <h2 className="text-2xl font-bold text-honeycomb-charcoal">Customer Reviews</h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-0.5">{renderStars(averageRating, "w-6 h-6")}</div>
              <span className="text-xl font-bold text-honeycomb-charcoal">
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} out of 5
              </span>
            </div>
            <p className="text-sm text-honeycomb-muted mt-1">
              Based on {reviewCount} {reviewCount === 1 ? 'global review' : 'global reviews'}
            </p>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1]
              const percent = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-honeycomb-medium font-medium">{star} star</span>
                  <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-honeycomb-muted font-medium">{percent}%</span>
                </div>
              )
            })}
          </div>

          {/* Review Submission Area */}
          <div className="pt-6 border-t border-honeycomb-cream/30">
            {!userId ? (
              <div className="p-4 rounded-2xl bg-ikstudio-beige/30 border border-honeycomb-cream/40 text-center space-y-3">
                <p className="text-sm text-honeycomb-medium">
                  Have you purchased this product? Log in to share your thoughts with other customers.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-honeycomb-charcoal rounded-full hover:bg-honeycomb-slate transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Review
                </Link>
              </div>
            ) : hasReviewed ? (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/40 text-center">
                <p className="text-sm text-honeycomb-medium text-neutral-600">
                  You have already submitted a review for this product. Thank you for your feedback!
                </p>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-honeycomb-charcoal text-white font-bold text-sm hover:bg-honeycomb-slate active:scale-[0.98] transition-all hover:cursor-pointer">
                    Write a Review
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-honeycomb-charcoal">Write a Customer Review</DialogTitle>
                  </DialogHeader>
                  <ReviewForm productId={productId} dialogMode={true} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-lg font-bold text-honeycomb-charcoal flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-honeycomb-muted" />
            Product Feedback
          </h3>

          {/* User's Pending Reviews */}
          {pendingReviews.length > 0 && (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 rounded-2xl border-2 border-dashed border-amber-300/60 bg-amber-50/20 relative"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting Approval
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-800 uppercase">
                      {review.userName?.substring(0, 2) || 'U'}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-honeycomb-charcoal">
                        {review.userName}
                      </span>
                      <span className="text-xs text-honeycomb-muted block">
                        Submitted on {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 mt-3">
                    {renderStars(review.rating, "w-4 h-4")}
                  </div>

                  <h4 className="font-bold text-honeycomb-charcoal mt-2">{review.title}</h4>
                  {review.body && (
                    <p className="text-sm text-honeycomb-medium mt-1 leading-relaxed whitespace-pre-line">
                      {review.body}
                    </p>
                  )}
                  <p className="text-xs text-honeycomb-muted mt-3 italic">
                    Note: Your review is currently pending administrator verification of Order ID "{review.orderId}". It is only visible to you.
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Approved Reviews */}
          {approvedReviews.length > 0 ? (
            <div className="divide-y divide-honeycomb-cream/40 space-y-6">
              {approvedReviews.map((review, idx) => (
                <div key={review.id} className={idx > 0 ? "pt-6" : ""}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-wigrix-teal/10 flex items-center justify-center text-sm font-bold text-wigrix-teal uppercase">
                        {review.userName?.substring(0, 2) || 'AN'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-honeycomb-charcoal">
                            {review.userName}
                          </span>
                          <span
                            className="inline-flex items-center gap-0.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded"
                            title="Verified purchase review"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        </div>
                        <span className="text-xs text-honeycomb-muted block">
                          Reviewed on {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 mt-3">
                    {renderStars(review.rating, "w-4 h-4")}
                  </div>

                  <h4 className="font-bold text-honeycomb-charcoal mt-2">{review.title}</h4>
                  {review.body && (
                    <p className="text-sm text-honeycomb-medium mt-1 leading-relaxed whitespace-pre-line">
                      {review.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            pendingReviews.length === 0 && (
              <div className="p-8 rounded-2xl bg-neutral-50/50 border border-neutral-100 text-center">
                <p className="text-sm text-honeycomb-muted">No reviews yet. Be the first to review this product!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
