import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()

  // Fetch categories server-side to pass to the header dropdown
  const payload = await getPayload({ config: configPromise })
  const categoriesData = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 20,
    select: { title: true, slug: true },
  })

  const categories = categoriesData.docs.map((cat) => ({
    title: cat.title as string,
    slug: cat.slug as string,
  }))

  return <HeaderClient header={header} categories={categories} />
}
