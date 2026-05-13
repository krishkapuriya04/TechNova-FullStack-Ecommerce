import dotenv from 'dotenv'
import { connectDatabase, disconnectDatabase } from '../config/database.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'

dotenv.config()

const ADMIN_EMAIL = 'admin@technova.dev'
const ADMIN_PASSWORD = 'Password123'

function img(seed) {
  return `https://picsum.photos/seed/technova-${seed}/960/720`
}

const catalog = [
  {
    title: 'NovaBook X1',
    slug: 'novabook-x1',
    description:
      'Flagship creator laptop with OLED display, vapor chamber cooling, and all-day battery.',
    price: 1899,
    discountPrice: 1749,
    category: 'Laptops',
    brand: 'TechNova Labs',
    images: [img('nb1'), img('nb2')],
    stock: 24,
    ratings: { average: 4.8, count: 312 },
    featured: true,
    specifications: [
      { name: 'Display', value: '16" 3.2K OLED' },
      { name: 'Memory', value: '32GB unified' },
      { name: 'Storage', value: '1TB NVMe' },
    ],
  },
  {
    title: 'Pulse ANC Pro',
    slug: 'pulse-anc-pro',
    description: 'Hybrid ANC earbuds with spatial audio and adaptive transparency.',
    price: 249,
    discountPrice: 199,
    category: 'Audio',
    brand: 'Helix Audio',
    images: [img('pulse1')],
    stock: 180,
    ratings: { average: 4.6, count: 1284 },
    featured: true,
    specifications: [
      { name: 'Driver', value: '11mm beryllium' },
      { name: 'Battery', value: '36h with case' },
    ],
  },
  {
    title: 'Orbit Watch Ultra',
    slug: 'orbit-watch-ultra',
    description: 'Titanium chassis, dual-frequency GPS, and week-long battery in endurance mode.',
    price: 429,
    discountPrice: null,
    category: 'Wearables',
    brand: 'Orbit',
    images: [img('orbit1'), img('orbit2')],
    stock: 92,
    ratings: { average: 4.7, count: 891 },
    featured: true,
    specifications: [
      { name: 'Case', value: 'Titanium' },
      { name: 'Water resistance', value: '100m' },
    ],
  },
  {
    title: 'Lumen Hub Max',
    slug: 'lumen-hub-max',
    description: 'Matter-ready smart hub with edge ML routines and local-first privacy.',
    price: 179,
    discountPrice: 159,
    category: 'Smart Home',
    brand: 'Lumen',
    images: [img('lumen1')],
    stock: 210,
    ratings: { average: 4.5, count: 640 },
    featured: true,
    specifications: [
      { name: 'Protocols', value: 'Matter, Thread, Zigbee' },
      { name: 'Ports', value: '2x USB-C' },
    ],
  },
  {
    title: 'Aurora Display 27"',
    slug: 'aurora-display-27',
    description: 'Mini-LED reference panel with factory calibration and 1600 nits peak.',
    price: 899,
    discountPrice: 849,
    category: 'Laptops',
    brand: 'Aurora',
    images: [img('aurora1')],
    stock: 48,
    ratings: { average: 4.7, count: 220 },
    featured: false,
    specifications: [
      { name: 'Resolution', value: '5K' },
      { name: 'Refresh', value: '120Hz' },
    ],
  },
  {
    title: 'Vertex Edge AI Station',
    slug: 'vertex-edge-ai-station',
    description: 'Compact NPU workstation for on-device inference and lightweight training.',
    price: 1299,
    discountPrice: null,
    category: 'Laptops',
    brand: 'Vertex Labs',
    images: [img('vertex1')],
    stock: 18,
    ratings: { average: 4.4, count: 96 },
    featured: false,
    specifications: [
      { name: 'NPU', value: '120 TOPS' },
      { name: 'RAM', value: '64GB' },
    ],
  },
  {
    title: 'EchoFrame Glasses',
    slug: 'echoframe-glasses',
    description: 'Audio glasses with open-ear drivers and adaptive beam steering.',
    price: 329,
    discountPrice: 299,
    category: 'Wearables',
    brand: 'EchoFrame',
    images: [img('echo1')],
    stock: 74,
    ratings: { average: 4.3, count: 410 },
    featured: false,
    specifications: [
      { name: 'Weight', value: '48g' },
      { name: 'Lens', value: 'Polarized option' },
    ],
  },
  {
    title: 'Helix Studio Mic',
    slug: 'helix-studio-mic',
    description: 'USB-C condenser microphone with onboard DSP presets for streaming.',
    price: 189,
    discountPrice: null,
    category: 'Audio',
    brand: 'Helix Audio',
    images: [img('mic1')],
    stock: 300,
    ratings: { average: 4.8, count: 512 },
    featured: false,
    specifications: [
      { name: 'Pattern', value: 'Cardioid' },
      { name: 'Sample rate', value: '192kHz' },
    ],
  },
  {
    title: 'Grid Security Cam 4K',
    slug: 'grid-security-cam-4k',
    description: 'HDR night vision, on-device person detection, and encrypted cloud backup.',
    price: 149,
    discountPrice: 129,
    category: 'Smart Home',
    brand: 'Grid',
    images: [img('cam1')],
    stock: 410,
    ratings: { average: 4.6, count: 880 },
    featured: false,
    specifications: [
      { name: 'Field of view', value: '130°' },
      { name: 'Storage', value: 'microSD + cloud' },
    ],
  },
  {
    title: 'Flux Mechanical Keyboard',
    slug: 'flux-mechanical-keyboard',
    description: 'Hot-swappable switches, gasket mount, and per-key RGB with QMK support.',
    price: 189,
    discountPrice: null,
    category: 'Accessories',
    brand: 'Flux',
    images: [img('kb1')],
    stock: 150,
    ratings: { average: 4.7, count: 620 },
    featured: false,
    specifications: [
      { name: 'Layout', value: '75%' },
      { name: 'Switches', value: 'Linear / tactile' },
    ],
  },
  {
    title: 'Skyline Travel Charger 140W',
    slug: 'skyline-travel-charger-140w',
    description: 'GaN charger with dual USB-C and intelligent power routing for laptops.',
    price: 99,
    discountPrice: 79,
    category: 'Accessories',
    brand: 'Skyline',
    images: [img('chg1')],
    stock: 600,
    ratings: { average: 4.5, count: 1500 },
    featured: false,
    specifications: [
      { name: 'Ports', value: '2x USB-C, 1x USB-A' },
      { name: 'Protocol', value: 'PD 3.1' },
    ],
  },
  {
    title: 'Nimbus Wi-Fi 7 Router',
    slug: 'nimbus-wifi-7-router',
    description: 'Quad-band mesh backbone with self-healing topology and parental controls.',
    price: 349,
    discountPrice: null,
    category: 'Smart Home',
    brand: 'Nimbus',
    images: [img('wifi1')],
    stock: 88,
    ratings: { average: 4.4, count: 260 },
    featured: false,
    specifications: [
      { name: 'Throughput', value: 'BE19000 class' },
      { name: 'Ports', value: '2.5G WAN + LAN' },
    ],
  },
]

async function seed() {
  await connectDatabase()

  const existingProducts = await Product.countDocuments()
  if (existingProducts === 0) {
    await Product.insertMany(catalog)
    console.log(`[seed] Inserted ${catalog.length} products`)
  } else {
    console.log('[seed] Products already present — skipping catalog insert')
  }

  const adminExists = await User.exists({ email: ADMIN_EMAIL })
  if (!adminExists) {
    await User.create({
      name: 'TechNova Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      avatar: '',
    })
    console.log(`[seed] Created admin user (${ADMIN_EMAIL})`)
  } else {
    console.log('[seed] Admin user already exists — skipping')
  }

  await disconnectDatabase()
  console.log('[seed] Done')
}

seed().catch((err) => {
  console.error('[seed] Failed', err)
  process.exit(1)
})
