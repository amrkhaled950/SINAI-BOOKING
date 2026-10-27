import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run vite build first.')
  process.exit(1)
}

const baseHtmlPath = path.join(distDir, 'index.html')
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8')

const routes = [
  {
    path: 'room/studio-1',
    title: 'Mashraba duplex (Studio 1) — Sinai Booking | دوبلكس المشربة دهب',
    description: 'Comfortable duplex loft, sea view, AC and private bathroom · Dahab, South Sinai. $40 / 2,000 EGP per night. استوديو دوبلكس المشربة دهب.',
    image: 'https://sinaibooking.com/images/og-studio-1.jpg',
    url: 'https://sinaibooking.com/room/studio-1'
  },
  {
    path: 'rooms/studio-1',
    title: 'Mashraba duplex (Studio 1) — Sinai Booking | دوبلكس المشربة دهب',
    description: 'Comfortable duplex loft, sea view, AC and private bathroom · Dahab, South Sinai. $40 / 2,000 EGP per night. استوديو دوبلكس المشربة دهب.',
    image: 'https://sinaibooking.com/images/og-studio-1.jpg',
    url: 'https://sinaibooking.com/rooms/studio-1'
  },
  {
    path: 'room/studio-2',
    title: '2BR Boho Stone House & Private Roof — Sinai Booking | بيت واستوديو بوهو دهب',
    description: 'Authentic 2BR boho stone house & private roof between Lighthouse & Assala · 2 AC Bedrooms, Garden & Fire Pit, Mountain Roof · $60 / 3,000 EGP. حتى 5 أفراد دهب.',
    image: 'https://sinaibooking.com/images/og-studio-2.jpg',
    url: 'https://sinaibooking.com/room/studio-2'
  },
  {
    path: 'rooms/studio-2',
    title: '2BR Boho Stone House & Private Roof — Sinai Booking | بيت واستوديو بوهو دهب',
    description: 'Authentic 2BR boho stone house & private roof between Lighthouse & Assala · 2 AC Bedrooms, Garden & Fire Pit, Mountain Roof · $60 / 3,000 EGP. حتى 5 أفراد دهب.',
    image: 'https://sinaibooking.com/images/og-studio-2.jpg',
    url: 'https://sinaibooking.com/rooms/studio-2'
  },
  {
    path: 'dahab-accommodation',
    title: 'Dahab Stays & Retreats — Sinai Booking | إقامة دهب',
    description: 'Explore boutique duplex lofts, private stone houses and rooftop retreats in Dahab, South Sinai. أماكن إقامة مميزة ومريحة لروقانك في دهب.',
    image: 'https://sinaibooking.com/images/og-dahab-accommodation.jpg',
    url: 'https://sinaibooking.com/dahab-accommodation'
  },
  {
    path: 'excursions',
    title: 'Desert Jeep Safaris & Hikes from Dahab — Sinai Booking | رحلات سفاري سينا',
    description: 'Ancient rock carvings, canyon hikes, Nawamis tombs, Dragonhead Mountain and Hedoda sand dunes. رحلات جيب سفاري وهايكنج ومبيت تحت نجوم سينا.',
    image: 'https://sinaibooking.com/images/og-excursions.jpg',
    url: 'https://sinaibooking.com/excursions'
  },
  {
    path: 'transportation',
    title: 'Sinai Private Transfers & Group Travel — Sinai Booking | مواصلات وتوصيلات سينا',
    description: 'Comfortable private car transfers and Hiace group travel across Dahab, Sharm, Nuweiba, Taba and St. Catherine. توصيلات خاصة ومجموعات في جنوب سينا.',
    image: 'https://sinaibooking.com/images/og-transportation.jpg',
    url: 'https://sinaibooking.com/transportation'
  }
]

routes.forEach((route) => {
  let html = baseHtml

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${route.title}" />`)
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`)

  // Replace Description
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${route.description}" />`)
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${route.description}" />`)
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`)

  // Replace Image
  html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${route.image}" />`)
  html = html.replace(/<meta property="og:image:secure_url" content=".*?" \/>/i, `<meta property="og:image:secure_url" content="${route.image}" />`)
  html = html.replace(/<link rel="image_src" href=".*?" \/>/i, `<link rel="image_src" href="${route.image}" />`)
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${route.image}" />`)

  // Replace URL
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${route.url}" />`)

  const targetDir = path.join(distDir, route.path)
  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8')
  console.log(`✅ Generated route preview HTML for: ${route.path} -> ${route.image}`)
})

console.log('🎉 All social preview routes generated successfully!')
