import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'
import fs from 'fs'
import path from 'path'
import os from 'os'

function createRichText(text: string): any {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

const productSeedData = [
  {
    name: 'Spinning Desk Organizer',
    handle: 'spinning-desk-organiser',
    categoryName: 'Desk Organisers',
    categoryHandle: 'desk-organisers',
    imageFiles: [
      '2025-09-26_0c9265407d8678.webp',
      '2025-09-26_14a997b13ec12.webp',
      '2025-09-26_592cc5fb604d1.webp',
      '2025-09-26_f362e06876ae78.webp',
      'cover.jpg',
    ],
    description: 'Experience the perfect blend of engineering and aesthetics. Our signature spinning organizer keeps your tools accessible with a satisfying 360° rotation mechanism.',
    priceInUSD: 19,
    priceInINR: 949,
  },
  {
    name: 'Hexagon Desk Organizer',
    handle: 'hexagon-organizer',
    categoryName: 'Desk Organisers',
    categoryHandle: 'desk-organisers',
    imageFiles: [
      '2025-04-17_4887f495eafa98.webp',
      '2025-04-17_4e2373abe482a8.webp',
      '2025-04-17_d12403458d4ec8.webp',
      '2025-04-17_f7cbc9e2de9b38.webp',
    ],
    description: 'Modular storage for your pens, pencils, and tools. Mix and match to create your perfect setup.',
    priceInUSD: 15,
    priceInINR: 499,
  },
  {
    name: 'Kumiko Design Desk Organizer',
    handle: 'kumiko-design-desk-organizer',
    categoryName: 'Desk Organisers',
    categoryHandle: 'desk-organisers',
    imageFiles: [
      '2025-04-20_4ef24035daf998.webp',
      '2025-04-20_8758e0102b4df.webp',
      '2025-04-20_a2def065796.webp',
      '2025-04-20_e110443def369.webp',
    ],
    description: 'Traditional Japanese Kumiko-inspired design meets modern functionality. A stunning desk organizer with intricate geometric patterns.',
    priceInUSD: 9,
    priceInINR: 449,
  },
  {
    name: 'Hexagon Remote Control Holder',
    handle: 'hexagon-remote-control-holder',
    categoryName: 'Desk Organisers',
    categoryHandle: 'desk-organisers',
    imageFiles: [
      '2025-04-28_7a90bd62c80fa8.webp',
      '2025-04-28_95689fdd23634.webp',
      '2025-04-28_b353f0a3a60518.webp',
    ],
    description: 'Keep your remotes organized and within reach. Hexagonal design adds style to your living room or desk setup.',
    priceInUSD: 12,
    priceInINR: 649,
  },
  {
    name: 'Shade Stand Mini',
    handle: 'shade-stand-mini',
    categoryName: 'Gadget Stands',
    categoryHandle: 'gadget-stands',
    imageFiles: [
      '2025-07-08_2437c5d555645.webp',
      '2025-07-08_272150b98d44e.webp',
      '2025-07-08_3ad6dc5cdaa21.webp',
      '2025-07-08_c845701cb88e28.webp',
    ],
    description: 'Premium Sunglasses Holder. Keep your shades safe and stylishly displayed on your desk.',
    priceInUSD: 19,
    priceInINR: 999,
  },
  {
    name: 'Acoustic Phone Stand',
    handle: 'acoustic-phone-stand',
    categoryName: 'Gadget Stands',
    categoryHandle: 'gadget-stands',
    imageFiles: [
      '2025-06-04_35b710890382e8.webp',
      '2025-06-04_4c8a7dd4717628.webp',
      '2025-06-04_4df782b5db641.webp',
      '2025-06-04_b6ad96183145f.webp',
    ],
    description: "A passive amplifier that naturally boosts your phone's volume while holding it at the perfect viewing angle.",
    priceInUSD: 14,
    priceInINR: 699,
  },
  {
    name: 'Gear Phone Stand',
    handle: 'gear-phone-stand',
    categoryName: 'Gadget Stands',
    categoryHandle: 'gadget-stands',
    imageFiles: [
      '2024-10-26_10840bf7e4f65.webp',
      '2024-10-26_59846b8ccd557.webp',
      '2024-10-26_90e0985e87442.webp',
      '2024-10-26_a3147646e14bf.webp',
      '2024-10-26_af276e69e5155.webp',
    ],
    description: 'A unique gear-inspired phone stand with industrial aesthetics. Holds your phone at the perfect angle.',
    priceInUSD: 10,
    priceInINR: 499,
  },
  {
    name: 'Honeycomb Desk Planter',
    handle: 'honeycomb-planter',
    categoryName: 'Desk Planters',
    categoryHandle: 'desk-planters',
    imageFiles: [
      '2024-02-04_c3963008f252.webp',
      '2025-07-22_63b8f9d731fed.webp',
      '2025-07-22_8155c23f1d828.webp',
    ],
    description: 'Bring nature indoors with this geometric planter. Perfect for succulents and small desk plants.',
    priceInUSD: 16,
    priceInINR: 799,
  },
  {
    name: 'Geometric Succulent Pot',
    handle: 'geometric-succulent-pot',
    categoryName: 'Desk Planters',
    categoryHandle: 'desk-planters',
    imageFiles: [
      '2024-11-20_c5b4c89c76d64.webp',
      '2024-11-24_3158230890f7e.webp',
      '2024-11-24_f1031f0c12062.webp',
    ],
    description: 'A modern geometric design pot perfect for small succulents and cacti.',
    priceInUSD: 9,
    priceInINR: 449,
  },
  {
    name: 'Minimalist Pen Holder',
    handle: 'minimalist-pen-holder',
    categoryName: 'Pen Holders',
    categoryHandle: 'pen-holders',
    imageFiles: [
      '2023-12-30_a8fedab5e5305.webp',
      '2023-12-30_c632a791e240b.webp',
      '2023-12-30_cb2b334bcef24.webp',
      '2024-03-03_262db417f12e.webp',
    ],
    description: 'Clean lines and thoughtful design. Perfect for keeping your favorite pens within reach.',
    priceInUSD: 7,
    priceInINR: 349,
  },
]

const collections: CollectionSlug[] = ['products', 'categories', 'media']
const globals: GlobalSlug[] = ['header', 'footer']

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database with Wigrix products...')

  // Temporarily disable local storage writes to bypass EROFS read-only filesystem errors on production/serverless environments.
  // The images are already pushed to git and served statically from public/media, so disk writes are unnecessary during seeding.
  const mediaConfig = payload.collections['media']?.config
  let originalDisableLocalStorage = false
  let originalStaticDir: string | undefined = undefined
  const tempDir = path.join(os.tmpdir(), 'payload-media-temp-seed')

  if (mediaConfig?.upload) {
    originalDisableLocalStorage = !!mediaConfig.upload.disableLocalStorage
    mediaConfig.upload.disableLocalStorage = true
    payload.logger.info('Temporarily disabled local storage file writes for media uploads.')

    if (typeof mediaConfig.upload.staticDir === 'string') {
      originalStaticDir = mediaConfig.upload.staticDir
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      mediaConfig.upload.staticDir = tempDir
      payload.logger.info(`Temporarily changed staticDir to ${tempDir} to avoid naming collisions.`)
    }
  }

  try {
    payload.logger.info(`— Clearing/resetting globals...`)
    await Promise.all(
      globals.map((global) =>
        payload.updateGlobal({
          slug: global,
          data: {
            navItems: [],
          },
          depth: 0,
          context: {
            disableRevalidate: true,
          },
        }),
      ),
    )

    payload.logger.info(`— Uploading or updating product media files...`)
    const mediaMap: Record<string, string | number> = {}
    
    // Extract all unique image filenames to upload
    const allImageFilenames = Array.from(
      new Set(productSeedData.flatMap((p) => p.imageFiles))
    )

    for (const filename of allImageFilenames) {
      const filePath = path.join(process.cwd(), 'public/media', filename)
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath)
        const stats = fs.statSync(filePath)
        const ext = path.extname(filename).toLowerCase()
        const mimetype = 
          ext === '.webp' ? 'image/webp' : 
          ext === '.gif' ? 'image/gif' : 
          ext === '.png' ? 'image/png' : 
          'image/jpeg'

        const alt = filename.replace(ext, '').replace(/[-_]/g, ' ')

        // Check if media already exists (by filename or alt)
        const existingMedia = await payload.find({
          collection: 'media',
          where: {
            or: [
              {
                filename: {
                  equals: filename,
                },
              },
              {
                alt: {
                  equals: alt,
                },
              },
            ],
          },
          limit: 1,
          req,
        })

        if (existingMedia.docs && existingMedia.docs.length > 0) {
          const docId = existingMedia.docs[0].id
          const media = await payload.update({
            collection: 'media',
            id: docId,
            req,
            data: {
              alt,
            },
            file: {
              name: filename,
              data: fileBuffer,
              mimetype,
              size: stats.size,
            },
          })
          mediaMap[filename] = media.id
          payload.logger.info(`Updated existing media ${filename} as ID ${media.id}`)
        } else {
          const media = await payload.create({
            collection: 'media',
            req,
            data: {
              alt,
            },
            file: {
              name: filename,
              data: fileBuffer,
              mimetype,
              size: stats.size,
            },
          })
          mediaMap[filename] = media.id
          payload.logger.info(`Uploaded new media ${filename} as ID ${media.id}`)
        }
      } else {
        payload.logger.error(`Local image file not found: ${filePath}`)
      }
    }

    payload.logger.info(`— Creating or updating categories...`)
    const categoryMap: Record<string, string | number> = {}
    const uniqueCategories = Array.from(
      new Set(
        productSeedData.map((p) =>
          JSON.stringify({ name: p.categoryName, slug: p.categoryHandle })
        )
      )
    ).map((s) => JSON.parse(s))

    // Explicitly add Bundles and Accessories if not present
    const extraCategories = [
      { name: 'Bundles', slug: 'bundles' },
      { name: 'Accessories', slug: 'accessories' },
    ]

    const allCatsToCreate = [...uniqueCategories]
    for (const extra of extraCategories) {
      if (!allCatsToCreate.some((c) => c.slug === extra.slug)) {
        allCatsToCreate.push(extra)
      }
    }

    for (const cat of allCatsToCreate) {
      const existingCat = await payload.find({
        collection: 'categories',
        where: {
          slug: {
            equals: cat.slug,
          },
        },
        limit: 1,
        req,
      })

      if (existingCat.docs && existingCat.docs.length > 0) {
        const docId = existingCat.docs[0].id
        const updatedCat = await payload.update({
          collection: 'categories',
          id: docId,
          req,
          data: {
            title: cat.name,
          },
        })
        categoryMap[cat.slug] = updatedCat.id
        payload.logger.info(`Updated existing category ${cat.name} (ID: ${updatedCat.id})`)
      } else {
        const createdCat = await payload.create({
          collection: 'categories',
          req,
          data: {
            title: cat.name,
            slug: cat.slug,
          },
        })
        categoryMap[cat.slug] = createdCat.id
        payload.logger.info(`Created category ${cat.name} with ID ${createdCat.id}`)
      }
    }

    payload.logger.info(`— Creating or updating products...`)
    for (const prod of productSeedData) {
      const gallery = prod.imageFiles
        .map((filename) => {
          const id = mediaMap[filename]
          return id ? { image: id as any } : null
        })
        .filter(Boolean) as any[]

      const mainMediaId = gallery[0]?.image
      const catId = categoryMap[prod.categoryHandle]

      const externalLinks = [
        {
          label: 'Buy on Amazon',
          url: `https://www.amazon.in/s?k=${encodeURIComponent(prod.name)}`,
        },
        {
          label: 'Buy on Flipkart',
          url: `https://www.flipkart.com/search?q=${encodeURIComponent(prod.name)}`,
        },
      ]

      const productData = {
        title: prod.name,
        slug: prod.handle,
        description: createRichText(prod.description),
        priceInINR: prod.priceInINR,
        priceInINREnabled: true,
        externalLinks,
        categories: catId ? [catId as any] : [],
        gallery,
        meta: {
          title: `${prod.name} | Wigrix`,
          description: prod.description,
          image: mainMediaId || undefined,
        },
        _status: 'published' as const,
      }

      // Check if product already exists
      const existingProd = await payload.find({
        collection: 'products',
        where: {
          slug: {
            equals: prod.handle,
          },
        },
        limit: 1,
        req,
      })

      if (existingProd.docs && existingProd.docs.length > 0) {
        const docId = existingProd.docs[0].id
        await payload.update({
          collection: 'products',
          id: docId,
          req,
          data: productData,
        })
        payload.logger.info(`Updated existing product ${prod.name} (ID: ${docId})`)
      } else {
        await payload.create({
          collection: 'products',
          req,
          data: productData,
        })
        payload.logger.info(`Created product ${prod.name}`)
      }
    }

    payload.logger.info(`— Updating header & footer globals...`)
    await payload.updateGlobal({
      slug: 'header',
      req,
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Home',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Shop',
              url: '/shop',
            },
          },
        ],
      },
    })

    await payload.updateGlobal({
      slug: 'footer',
      req,
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Shop All',
              url: '/shop',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Admin Panel',
              url: '/admin',
            },
          },
        ],
      },
    })

    payload.logger.info('Wigrix products and categories seeded successfully!')
  } finally {
    // Restore original config value
    if (mediaConfig?.upload) {
      mediaConfig.upload.disableLocalStorage = originalDisableLocalStorage
      if (originalStaticDir !== undefined) {
        mediaConfig.upload.staticDir = originalStaticDir
      }
      payload.logger.info('Restored original media upload config.')
    }
    // Clean up temp directory
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    } catch (err) {
      payload.logger.error({ err, message: 'Failed to clean up temp seed directory' })
    }
  }
}
