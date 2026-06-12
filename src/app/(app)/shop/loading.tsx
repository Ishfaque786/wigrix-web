import React from 'react'

// Wigrix skeleton loading state for shop page
export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="bg-honeycomb-light/50 pt-28 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-5 animate-pulse">
          <div className="h-5 w-28 rounded-full bg-honeycomb-cream/60" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="flex flex-col gap-3">
              <div className="h-12 w-48 rounded-xl bg-honeycomb-cream/60" />
              <div className="h-4 w-72 rounded-full bg-honeycomb-cream/40" />
            </div>
            <div className="h-10 w-full lg:w-64 rounded-full bg-honeycomb-cream/40" />
          </div>
          {/* Filter pills skeleton */}
          <div className="flex gap-2 flex-wrap">
            {[80, 120, 110, 100, 95].map((w, i) => (
              <div
                key={i}
                className="h-8 rounded-full bg-honeycomb-cream/50"
                style={{ width: w }}
              />
            ))}
            <div className="ml-auto h-8 w-36 rounded-full bg-honeycomb-cream/40" />
          </div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl overflow-hidden border border-honeycomb-cream/30 bg-white"
            >
              <div className="aspect-square bg-honeycomb-light/60" />
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded-full bg-honeycomb-cream/50" />
                  <div className="h-3 w-8 rounded-full bg-honeycomb-cream/50" />
                </div>
                <div className="h-4 w-full rounded bg-honeycomb-cream/60" />
                <div className="h-4 w-3/4 rounded bg-honeycomb-cream/40" />
                <div className="h-6 w-20 rounded bg-honeycomb-cream/60 mt-1" />
                <div className="h-9 w-full rounded-xl bg-honeycomb-cream/50 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
