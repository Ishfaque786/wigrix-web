import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''

    if (!q.trim()) {
      return NextResponse.json({ docs: [] })
    }

    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            _status: { equals: 'published' },
          },
          {
            or: [
              { title: { like: q } },
              { slug: { like: q } },
            ],
          },
        ],
      },
      limit: 6,
      depth: 2,
    })

    return NextResponse.json({ docs: result.docs })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return NextResponse.json({ error: 'Failed to search products.' }, { status: 500 })
  }
}
