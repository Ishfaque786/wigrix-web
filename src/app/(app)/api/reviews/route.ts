import { NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })

    // Auth check
    const { user } = await payload.auth({ headers })
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to submit a review.' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, rating, title, reviewBody, orderId } = body

    // Validate required fields
    if (!productId || !rating || !title || !orderId) {
      return NextResponse.json(
        { error: 'Product, rating, title, and order ID are required.' },
        { status: 400 },
      )
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 })
    }

    // Check user hasn't already reviewed this product
    const existing = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { product: { equals: productId } },
          { user: { equals: user.id } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'You have already submitted a review for this product.' },
        { status: 409 },
      )
    }

    // Create the review (status defaults to 'pending' via collection config)
    const review = await payload.create({
      collection: 'reviews',
      data: {
        product: productId,
        user: user.id,
        userName: user.name || user.email || 'Anonymous',
        orderId,
        rating,
        title,
        body: reviewBody || '',
        status: 'pending',
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/reviews]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
