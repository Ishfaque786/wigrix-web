import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { checkRole } from '@/access/utilities'

const getProductId = (productField: any): string | number | null => {
  if (!productField) return null
  if (typeof productField === 'object' && productField !== null) {
    return productField.id
  }
  return productField
}

const updateProductRating = async (productId: string | number | null, payload: any) => {
  if (!productId) return

  const reviewsResult = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { product: { equals: productId } },
        { status: { equals: 'approved' } }
      ]
    },
    limit: 500,
    overrideAccess: true
  })

  const reviews = reviewsResult.docs || []
  const count = reviews.length
  const average = count > 0
    ? parseFloat((reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / count).toFixed(2))
    : 0

  await payload.update({
    collection: 'products',
    id: productId,
    data: {
      ratingAverage: average,
      ratingCount: count
    },
    overrideAccess: true
  })
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    group: 'Content',
    defaultColumns: ['product', 'userName', 'rating', 'status', 'createdAt'],
    useAsTitle: 'title',
  },
  access: {
    // Only logged-in users can create
    create: ({ req: { user } }) => Boolean(user),

    // Admin sees all; logged-in user sees their own; public sees only approved
    read: ({ req: { user } }) => {
      if (!user) {
        return { status: { equals: 'approved' } } as any
      }
      if (checkRole(['admin'], user)) return true
      return {
        or: [
          { status: { equals: 'approved' } },
          { user: { equals: user.id } },
        ],
      } as any
    },

    // Only admin can change status / delete
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      // Auto-set user and userName on create
      async ({ data, operation, req }) => {
        if (operation === 'create' && req.user) {
          data.user = req.user.id
          data.userName = req.user.name || req.user.email || 'Anonymous'
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const prodId = getProductId(doc.product)
        const prevProdId = getProductId(previousDoc?.product)

        const statusChanged = doc.status !== previousDoc?.status
        const ratingChanged = doc.rating !== previousDoc?.rating
        const productChanged = prodId !== prevProdId

        if (statusChanged || ratingChanged || productChanged) {
          if (prodId) {
            await updateProductRating(prodId, req.payload)
          }
          if (productChanged && prevProdId) {
            await updateProductRating(prevProdId, req.payload)
          }
        }
      }
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const prodId = getProductId(doc.product)
        if (prodId) {
          await updateProductRating(prodId, req.payload)
        }
      }
    ]
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'userName',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'orderId',
      type: 'text',
      required: true,
      label: 'Order ID (Amazon / Flipkart)',
      admin: {
        description: 'The order number from Amazon or Flipkart for verification',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: { description: '1 = Worst, 5 = Best' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Review Headline',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Review Body',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: '⏳ Pending', value: 'pending' },
        { label: '✅ Approved', value: 'approved' },
        { label: '❌ Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
      access: {
        // Only admin can change status
        update: ({ req: { user } }) => checkRole(['admin'], user),
      },
    },
  ],
}
