import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

export const maxDuration = 300

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
    imageFile: 'spinning-organizer.jpg',
    description: 'Experience the perfect blend of engineering and aesthetics. Our signature spinning organizer keeps your tools accessible with a satisfying 360° rotation mechanism.',
    priceInUSD: 19,
    priceInINR: 949,
  },
  {
    name: 'Hexagon Desk Organizer',
    handle: 'hexagon-organizer',
    categoryName: 'Desk Organisers',
    categoryHandle: 'desk-organisers',
    imageFile: 'hexagon-organizer.jpg',
    description: 'Modular storage for your pens, pencils, and tools. Mix and match to create your perfect setup.',
    priceInUSD: 15,
    priceInINR: 499,
  },
  {
    name: 'Kumiko Design Desk Organizer',
    handle: 'kumiko-design-desk-organizer',
    categoryName: 'Desk Organisers',
    categoryHandle: 'desk-organisers',
    imageFile: 'spinning-organizer.jpg',
    description: 'Traditional Japanese Kumiko-inspired design meets modern functionality. A stunning desk organizer with intricate geometric patterns.',
    priceInUSD: 9,
    priceInINR: 449,
  },
  {
    name: 'Hexagon Remote Control Holder',
    handle: 'hexagon-remote-control-holder',
    categoryName: 'Desk Organisers',
    categoryHandle: 'desk-organisers',
    imageFile: 'hexagon-organizer.jpg',
    description: 'Keep your remotes organized and within reach. Hexagonal design adds style to your living room or desk setup.',
    priceInUSD: 12,
    priceInINR: 649,
  },
  {
    name: 'Shade Stand Mini',
    handle: 'shade-stand-mini',
    categoryName: 'Gadget Stands',
    categoryHandle: 'gadget-stands',
    imageFile: 'shade-stand-mini.jpg',
    description: 'Premium Sunglasses Holder. Keep your shades safe and stylishly displayed on your desk.',
    priceInUSD: 19,
    priceInINR: 999,
  },
  {
    name: 'Acoustic Phone Stand',
    handle: 'acoustic-phone-stand',
    categoryName: 'Gadget Stands',
    categoryHandle: 'gadget-stands',
    imageFile: 'acoustic-phone-stand.jpg',
    description: "A passive amplifier that naturally boosts your phone's volume while holding it at the perfect viewing angle.",
    priceInUSD: 14,
    priceInINR: 699,
  },
  {
    name: 'Gear Phone Stand',
    handle: 'gear-phone-stand',
    categoryName: 'Gadget Stands',
    categoryHandle: 'gadget-stands',
    imageFile: 'shade-stand-mini.jpg',
    description: 'A unique gear-inspired phone stand with industrial aesthetics. Holds your phone at the perfect angle.',
    priceInUSD: 10,
    priceInINR: 499,
  },
  {
    name: 'Honeycomb Desk Planter',
    handle: 'honeycomb-planter',
    categoryName: 'Desk Planters',
    categoryHandle: 'desk-planters',
    imageFile: 'honeycomb-planter.jpg',
    description: 'Bring nature indoors with this geometric planter. Perfect for succulents and small desk plants.',
    priceInUSD: 16,
    priceInINR: 799,
  },
  {
    name: 'Geometric Succulent Pot',
    handle: 'geometric-succulent-pot',
    categoryName: 'Desk Planters',
    categoryHandle: 'desk-planters',
    imageFile: 'honeycomb-planter.jpg',
    description: 'A modern geometric design pot perfect for small succulents and cacti.',
    priceInUSD: 9,
    priceInINR: 449,
  },
  {
    name: 'Minimalist Pen Holder',
    handle: 'minimalist-pen-holder',
    categoryName: 'Pen Holders',
    categoryHandle: 'pen-holders',
    imageFile: 'hexagon-organizer.jpg',
    description: 'Clean lines and thoughtful design. Perfect for keeping your favorite pens within reach.',
    priceInUSD: 7,
    priceInINR: 349,
  },
  {
    name: 'Hexagon Pen Cup',
    handle: 'hexagon-pen-cup',
    categoryName: 'Pen Holders',
    categoryHandle: 'pen-holders',
    imageFile: 'hexagon-organizer.jpg',
    description: 'A hexagonal pen cup that adds geometric flair to your desk organization.',
    priceInUSD: 6,
    priceInINR: 299,
  },
]

export async function GET() {
  const payload = await getPayload({ config })

  try {
    console.log('Clearing existing categories, products, media...')
    
    // Clear existing
    await payload.delete({
      collection: 'products',
      where: {},
    })

    await payload.delete({
      collection: 'categories',
      where: {},
    })

    await payload.delete({
      collection: 'media',
      where: {},
    })

    // Delete static files in public/media to prevent buildup
    const mediaDir = path.resolve(process.cwd(), 'public/media')
    if (fs.existsSync(mediaDir)) {
      const files = fs.readdirSync(mediaDir)
      for (const file of files) {
        fs.unlinkSync(path.join(mediaDir, file))
      }
    } else {
      fs.mkdirSync(mediaDir, { recursive: true })
    }

    console.log('Uploading media files...')
    const mediaMap: Record<string, string | number> = {}
    const localImageFiles = [
      'spinning-organizer.jpg',
      'hexagon-organizer.jpg',
      'shade-stand-mini.jpg',
      'acoustic-phone-stand.jpg',
      'honeycomb-planter.jpg',
    ]

    for (const filename of localImageFiles) {
      const filePath = path.join(process.cwd(), 'public/images/products', filename)
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath)
        const stats = fs.statSync(filePath)
        
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: filename.replace('.jpg', '').replace('-', ' '),
          },
          file: {
            name: filename,
            data: fileBuffer,
            mimetype: 'image/jpeg',
            size: stats.size,
          },
        })
        mediaMap[filename] = media.id
        console.log(`Uploaded ${filename} as media ID ${media.id}`)
      } else {
        console.error(`Local image file not found: ${filePath}`)
      }
    }

    console.log('Creating categories...')
    const categoryMap: Record<string, string | number> = {}
    const uniqueCategories = Array.from(
      new Set(productSeedData.map((p) => JSON.stringify({ name: p.categoryName, slug: p.categoryHandle }))),
    ).map((s) => JSON.parse(s))

    // Add Bundles and Accessories explicitly too
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
      const createdCat = await payload.create({
        collection: 'categories',
        data: {
          title: cat.name,
          slug: cat.slug,
        },
      })
      categoryMap[cat.slug] = createdCat.id
      console.log(`Created category ${cat.name} with ID ${createdCat.id}`)
    }

    console.log('Creating products...')
    for (const prod of productSeedData) {
      const mediaId = mediaMap[prod.imageFile]
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

      await payload.create({
        collection: 'products',
        data: {
          title: prod.name,
          slug: prod.handle,
          description: createRichText(prod.description),
          priceInINR: prod.priceInINR,
          priceInINREnabled: true,
          externalLinks,
          categories: catId ? [catId as any] : [],
          gallery: mediaId ? [{ image: mediaId as any }] : [],
          meta: {
            title: `${prod.name} | Wigrix`,
            description: prod.description,
            image: (mediaId as any) || undefined,
          },
          _status: 'published',
        },
      })
      console.log(`Created product ${prod.name}`)
    }

    // Set up Header and Footer Globals
    console.log('Updating Header & Footer globals...')
    await payload.updateGlobal({
      slug: 'header',
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

    return Response.json({ success: true, message: 'Wigrix products and categories seeded successfully' })
  } catch (error: any) {
    console.error('Seeding error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
