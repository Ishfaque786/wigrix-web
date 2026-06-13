import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { CategoryBarClient } from './index.client'

async function CategoryList() {
  const payload = await getPayload({ config: configPromise })
  const categoriesData = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 20,
    select: {
      title: true,
      slug: true,
    },
  })

  const categories = categoriesData.docs.map((cat) => ({
    title: cat.title as string,
    slug: cat.slug as string,
  }))

  return <CategoryBarClient categories={categories} />
}

export function CategoryBar() {
  return (
    <Suspense fallback={<div className="h-12 bg-white/80 border-b border-neutral-100" />}>
      <CategoryList />
    </Suspense>
  )
}
