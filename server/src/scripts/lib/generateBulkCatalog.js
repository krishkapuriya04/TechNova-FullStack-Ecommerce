import { slugify } from '../../utils/slugify.js'
import { getCatalogImageUrls } from './productImageUrls.js'

/**
 * Deterministic pseudo-random for repeatable seed runs.
 * @param {number} seed
 */
function mulberry32(seed) {
  let a = seed >>> 0
  return function rand() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildDescription({ brand, title, category }) {
  return (
    `${title} by ${brand} — premium ${category.toLowerCase()} built for daily reliability, ` +
    `strong performance-per-watt, and a polished out-of-box experience. ` +
    `Backed by TechNova verified fulfillment, fast dispatch, and straightforward returns on eligible orders.`
  )
}

/** @returns {object[]} Mongo-ready product documents for `insertMany`. */
export function generateBulkCatalog() {
  /** @type {Array<{ category: string; brand: string; title: string; price: number; discountPrice: number | null; specifications: { name: string; value: string }[] }>} */
  const blueprint = [
    // Smartphones
    {
      category: 'Smartphones',
      brand: 'Apple',
      title: 'iPhone 15 Pro 256GB',
      price: 1199,
      discountPrice: 1099,
      specifications: [
        { name: 'Display', value: '6.1" Super Retina XDR' },
        { name: 'Chip', value: 'A17 Pro' },
        { name: 'Camera', value: '48MP main · ProRAW' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'Apple',
      title: 'iPhone 15 128GB',
      price: 829,
      discountPrice: 749,
      specifications: [
        { name: 'Display', value: '6.1" Super Retina XDR' },
        { name: 'Chip', value: 'A16 Bionic' },
        { name: 'USB', value: 'USB-C' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'Samsung',
      title: 'Galaxy S24 Ultra 512GB',
      price: 1419,
      discountPrice: 1299,
      specifications: [
        { name: 'Display', value: '6.8" QHD+ AMOLED 120Hz' },
        { name: 'S Pen', value: 'Included' },
        { name: 'Camera', value: '200MP wide' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'Samsung',
      title: 'Galaxy Z Flip5 256GB',
      price: 1099,
      discountPrice: 949,
      specifications: [
        { name: 'Form factor', value: 'Flip' },
        { name: 'Cover display', value: '3.4" Flex Window' },
        { name: 'Water resistance', value: 'IPX8' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'OnePlus',
      title: 'OnePlus 12 256GB',
      price: 899,
      discountPrice: 799,
      specifications: [
        { name: 'Display', value: '6.82" LTPO AMOLED 120Hz' },
        { name: 'Charging', value: '80W SUPERVOOC' },
        { name: 'Camera', value: 'Hasselblad tuned triple' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'Nothing',
      title: 'Phone (2) 256GB',
      price: 699,
      discountPrice: 629,
      specifications: [
        { name: 'Glyph Interface', value: 'LED back panel' },
        { name: 'Chip', value: 'Snapdragon 8+ Gen 1' },
        { name: 'OS', value: 'Nothing OS' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'Sony',
      title: 'Xperia 1 VI 256GB',
      price: 1399,
      discountPrice: null,
      specifications: [
        { name: 'Display', value: '19.5:9 120Hz OLED' },
        { name: 'Camera', value: 'ZEISS optics' },
        { name: 'Audio', value: '3.5mm jack · LDAC' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'Samsung',
      title: 'Galaxy A55 5G 128GB',
      price: 449,
      discountPrice: 399,
      specifications: [
        { name: 'Display', value: '6.6" Super AMOLED 120Hz' },
        { name: 'Durability', value: 'IP67' },
        { name: 'Battery', value: '5000mAh' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'Apple',
      title: 'iPhone SE (3rd gen) 128GB',
      price: 479,
      discountPrice: 429,
      specifications: [
        { name: 'Chip', value: 'A15 Bionic' },
        { name: 'Biometrics', value: 'Touch ID' },
        { name: 'Wireless', value: '5G' },
      ],
    },
    {
      category: 'Smartphones',
      brand: 'OnePlus',
      title: 'OnePlus Nord 3 128GB',
      price: 449,
      discountPrice: 379,
      specifications: [
        { name: 'Display', value: '6.74" AMOLED 120Hz' },
        { name: 'RAM', value: '8GB' },
        { name: 'Charging', value: '80W' },
      ],
    },
    // Laptops
    {
      category: 'Laptops',
      brand: 'Dell',
      title: 'XPS 15 (9530) OLED',
      price: 2199,
      discountPrice: 1999,
      specifications: [
        { name: 'Display', value: '15.6" 3.5K OLED' },
        { name: 'CPU', value: 'Intel Core Ultra 7' },
        { name: 'Graphics', value: 'RTX 4050' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'HP',
      title: 'Spectre x360 14 2-in-1',
      price: 1699,
      discountPrice: 1549,
      specifications: [
        { name: 'Display', value: '14" 2.8K OLED touch' },
        { name: 'Pen', value: 'Included' },
        { name: 'Battery', value: 'Up to 15 hrs' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'Lenovo',
      title: 'ThinkPad X1 Carbon Gen 12',
      price: 1899,
      discountPrice: null,
      specifications: [
        { name: 'Weight', value: 'From 2.42 lb' },
        { name: 'Security', value: 'Match-on-chip fingerprint' },
        { name: 'RAM', value: '32GB LPDDR5x' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'ASUS',
      title: 'Zenbook 14 OLED',
      price: 1299,
      discountPrice: 1199,
      specifications: [
        { name: 'Display', value: '14" 3K OLED 120Hz' },
        { name: 'CPU', value: 'AMD Ryzen 9' },
        { name: 'Weight', value: '2.82 lb' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'MSI',
      title: 'Stealth 16 Studio',
      price: 2499,
      discountPrice: 2299,
      specifications: [
        { name: 'Display', value: '16" QHD+ 240Hz' },
        { name: 'Graphics', value: 'RTX 4070' },
        { name: 'Cooling', value: 'Vapor chamber' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'Apple',
      title: 'MacBook Pro 14" M4 Pro',
      price: 1999,
      discountPrice: null,
      specifications: [
        { name: 'Chip', value: 'Apple M4 Pro' },
        { name: 'Memory', value: '24GB unified' },
        { name: 'Ports', value: '3x Thunderbolt 4 · HDMI · SD' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'Apple',
      title: 'MacBook Air 15" M3',
      price: 1499,
      discountPrice: 1399,
      specifications: [
        { name: 'Chip', value: 'Apple M3' },
        { name: 'Display', value: '15.3" Liquid Retina' },
        { name: 'Battery', value: 'Up to 18 hrs' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'Dell',
      title: 'Latitude 7440',
      price: 1799,
      discountPrice: 1649,
      specifications: [
        { name: 'Form', value: 'Ultralight carbon' },
        { name: 'Security', value: 'Intel vPro' },
        { name: 'WWAN', value: 'Optional 5G' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'HP',
      title: 'Victus 16 Gaming Laptop',
      price: 1399,
      discountPrice: 1199,
      specifications: [
        { name: 'Graphics', value: 'RTX 4060' },
        { name: 'Display', value: '16.1" FHD 144Hz' },
        { name: 'Cooling', value: 'Wide rear vents' },
      ],
    },
    {
      category: 'Laptops',
      brand: 'Lenovo',
      title: 'Legion Slim 7 Gen 9',
      price: 1899,
      discountPrice: 1699,
      specifications: [
        { name: 'Graphics', value: 'RTX 4070' },
        { name: 'Display', value: '16" WQXGA 240Hz' },
        { name: 'Keyboard', value: 'Legion TrueStrike' },
      ],
    },
    // Gaming
    {
      category: 'Gaming',
      brand: 'ASUS',
      title: 'ROG Zephyrus G16 (2024)',
      price: 2299,
      discountPrice: 2099,
      specifications: [
        { name: 'Graphics', value: 'RTX 4080' },
        { name: 'Display', value: '16" ROG Nebula OLED' },
        { name: 'Cooling', value: 'Tri-fan · vapor chamber' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'MSI',
      title: 'Raider GE68 HX',
      price: 2799,
      discountPrice: 2599,
      specifications: [
        { name: 'Graphics', value: 'RTX 4090' },
        { name: 'Display', value: '16" QHD+ 240Hz' },
        { name: 'Keyboard', value: 'SteelSeries per-key RGB' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'Razer',
      title: 'Blade 16 (2024)',
      price: 3299,
      discountPrice: 2999,
      specifications: [
        { name: 'Graphics', value: 'RTX 4090' },
        { name: 'Display', value: 'Dual-mode mini-LED' },
        { name: 'Chassis', value: 'CNC aluminum' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'Dell',
      title: 'Alienware x16 R2',
      price: 3199,
      discountPrice: 2899,
      specifications: [
        { name: 'Graphics', value: 'RTX 4080' },
        { name: 'Thermal', value: 'Element 31' },
        { name: 'Lighting', value: 'AlienFX' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'MSI',
      title: 'Claw A1M Handheld',
      price: 799,
      discountPrice: 699,
      specifications: [
        { name: 'APU', value: 'Intel Core Ultra' },
        { name: 'Display', value: '7" FHD 120Hz' },
        { name: 'Controls', value: 'Hall effect sticks' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'ASUS',
      title: 'ROG Ally X',
      price: 899,
      discountPrice: 849,
      specifications: [
        { name: 'APU', value: 'AMD Ryzen Z1 Extreme' },
        { name: 'RAM', value: '24GB' },
        { name: 'Storage', value: '1TB NVMe' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'Razer',
      title: 'Wolverine V2 Pro Controller',
      price: 249,
      discountPrice: 219,
      specifications: [
        { name: 'Connectivity', value: '2.4GHz wireless' },
        { name: 'Mecha-tactile', value: 'Action buttons' },
        { name: 'Compatibility', value: 'PC · PS5' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'Logitech',
      title: 'G923 TRUEFORCE Racing Wheel',
      price: 399,
      discountPrice: 349,
      specifications: [
        { name: 'Force feedback', value: 'TRUEFORCE' },
        { name: 'Pedals', value: 'Included' },
        { name: 'Compatibility', value: 'PC · PS5 · Xbox' },
      ],
    },
    {
      category: 'Gaming',
      brand: 'Sony',
      title: 'INZONE H9 Wireless Headset',
      price: 299,
      discountPrice: 249,
      specifications: [
        { name: 'ANC', value: 'Dual noise sensor' },
        { name: 'Spatial', value: '360 Spatial Sound' },
        { name: 'Mic', value: 'Boom + flip-to-mute' },
      ],
    },
    // Audio
    {
      category: 'Audio',
      brand: 'Sony',
      title: 'WH-1000XM5 Wireless Headphones',
      price: 399,
      discountPrice: 329,
      specifications: [
        { name: 'ANC', value: 'Industry-leading dual processor' },
        { name: 'Battery', value: 'Up to 30 hrs' },
        { name: 'Codec', value: 'LDAC' },
      ],
    },
    {
      category: 'Audio',
      brand: 'Bose',
      title: 'QuietComfort Ultra Earbuds',
      price: 299,
      discountPrice: 269,
      specifications: [
        { name: 'ANC', value: 'CustomTune calibration' },
        { name: 'Immersive', value: 'Spatial audio' },
        { name: 'Battery', value: '6 + 18 hrs case' },
      ],
    },
    {
      category: 'Audio',
      brand: 'JBL',
      title: 'Charge 6 Portable Speaker',
      price: 199,
      discountPrice: 169,
      specifications: [
        { name: 'Power', value: '40W RMS' },
        { name: 'Battery', value: '28 hrs' },
        { name: 'Durability', value: 'IP67' },
      ],
    },
    {
      category: 'Audio',
      brand: 'Sony',
      title: 'WF-1000XM5 Earbuds',
      price: 299,
      discountPrice: 249,
      specifications: [
        { name: 'Driver', value: '8.4mm' },
        { name: 'ANC', value: 'V2 processor' },
        { name: 'Case', value: 'Qi wireless' },
      ],
    },
    {
      category: 'Audio',
      brand: 'Bose',
      title: 'SoundLink Flex (2nd Gen)',
      price: 149,
      discountPrice: 129,
      specifications: [
        { name: 'PositionIQ', value: 'Auto tuning' },
        { name: 'Durability', value: 'IP67' },
        { name: 'Battery', value: '12 hrs' },
      ],
    },
    {
      category: 'Audio',
      brand: 'JBL',
      title: 'Flip 6 Portable Speaker',
      price: 129,
      discountPrice: 99,
      specifications: [
        { name: 'Output', value: '20W' },
        { name: 'PartyBoost', value: 'Stereo pair' },
        { name: 'Durability', value: 'IP67' },
      ],
    },
    {
      category: 'Audio',
      brand: 'Apple',
      title: 'AirPods Pro (2nd gen) USB-C',
      price: 249,
      discountPrice: 229,
      specifications: [
        { name: 'Chip', value: 'H2' },
        { name: 'ANC', value: 'Adaptive Audio' },
        { name: 'Case', value: 'USB-C · Precision Finding' },
      ],
    },
    {
      category: 'Audio',
      brand: 'OnePlus',
      title: 'Buds 3 Wireless Earbuds',
      price: 99,
      discountPrice: 79,
      specifications: [
        { name: 'Driver', value: '10.4mm + 6mm dual' },
        { name: 'ANC', value: '49dB hybrid' },
        { name: 'Latency', value: 'Low-latency gaming mode' },
      ],
    },
    {
      category: 'Audio',
      brand: 'Nothing',
      title: 'Ear (a) Wireless Earbuds',
      price: 99,
      discountPrice: 89,
      specifications: [
        { name: 'Driver', value: '11mm' },
        { name: 'ANC', value: 'Hybrid' },
        { name: 'Transparency', value: 'High clarity' },
      ],
    },
    // Smart Watches
    {
      category: 'Smart Watches',
      brand: 'Apple',
      title: 'Apple Watch Series 10 (GPS) 46mm',
      price: 499,
      discountPrice: 469,
      specifications: [
        { name: 'Display', value: 'Always-On Retina' },
        { name: 'Health', value: 'ECG · sleep stages' },
        { name: 'Durability', value: '50m water resistance' },
      ],
    },
    {
      category: 'Smart Watches',
      brand: 'Samsung',
      title: 'Galaxy Watch7 44mm',
      price: 349,
      discountPrice: 299,
      specifications: [
        { name: 'Sensor', value: 'BioActive' },
        { name: 'Battery', value: 'Up to 40 hrs' },
        { name: 'OS', value: 'Wear OS' },
      ],
    },
    {
      category: 'Smart Watches',
      brand: 'Nothing',
      title: 'CMF Watch Pro',
      price: 69,
      discountPrice: 59,
      specifications: [
        { name: 'GPS', value: 'Multi-band' },
        { name: 'Battery', value: '13 days typical' },
        { name: 'Display', value: '1.96" AMOLED' },
      ],
    },
    {
      category: 'Smart Watches',
      brand: 'OnePlus',
      title: 'OnePlus Watch 2',
      price: 299,
      discountPrice: 269,
      specifications: [
        { name: 'Runtime', value: 'Up to 100 hrs' },
        { name: 'GPS', value: 'Dual-frequency' },
        { name: 'Durability', value: 'MIL-STD-810H' },
      ],
    },
    {
      category: 'Smart Watches',
      brand: 'Apple',
      title: 'Apple Watch Ultra 2',
      price: 799,
      discountPrice: null,
      specifications: [
        { name: 'Case', value: '49mm titanium' },
        { name: 'Action button', value: 'Customizable' },
        { name: 'Diving', value: '40m recreational' },
      ],
    },
    {
      category: 'Smart Watches',
      brand: 'Samsung',
      title: 'Galaxy Watch Ultra',
      price: 649,
      discountPrice: 599,
      specifications: [
        { name: 'Display', value: '450x450 sapphire' },
        { name: 'GPS', value: 'Dual-frequency' },
        { name: 'Battery', value: 'Endurance mode' },
      ],
    },
    {
      category: 'Smart Watches',
      brand: 'Samsung',
      title: 'Galaxy Fit3',
      price: 99,
      discountPrice: 79,
      specifications: [
        { name: 'Display', value: '1.6" AMOLED' },
        { name: 'Sleep', value: 'Snoring detection' },
        { name: 'Battery', value: 'Up to 13 days' },
      ],
    },
    {
      category: 'Smart Watches',
      brand: 'Apple',
      title: 'Apple Watch SE (GPS) 44mm',
      price: 299,
      discountPrice: 269,
      specifications: [
        { name: 'Chip', value: 'S8 SiP' },
        { name: 'Safety', value: 'Crash Detection' },
        { name: 'Fitness', value: 'Activity rings' },
      ],
    },
    // Monitors
    {
      category: 'Monitors',
      brand: 'Dell',
      title: 'UltraSharp U2723QE 27" 4K',
      price: 779,
      discountPrice: 699,
      specifications: [
        { name: 'Panel', value: 'IPS Black' },
        { name: 'Color', value: '98% DCI-P3' },
        { name: 'Hub', value: 'RJ45 · KVM' },
      ],
    },
    {
      category: 'Monitors',
      brand: 'ASUS',
      title: 'ProArt PA278CV 27" WQHD',
      price: 469,
      discountPrice: 429,
      specifications: [
        { name: 'Color', value: 'Calman verified' },
        { name: 'Ports', value: 'USB-C 65W' },
        { name: 'Ergonomics', value: 'Pivot · tilt · swivel' },
      ],
    },
    {
      category: 'Monitors',
      brand: 'Samsung',
      title: 'Odyssey OLED G8 34"',
      price: 1299,
      discountPrice: 1199,
      specifications: [
        { name: 'Panel', value: 'QD-OLED 175Hz' },
        { name: 'Curve', value: '1800R' },
        { name: 'HDR', value: 'True Black 400' },
      ],
    },
    {
      category: 'Monitors',
      brand: 'MSI',
      title: 'MAG 274QRF-QD 27" Rapid IPS',
      price: 399,
      discountPrice: 349,
      specifications: [
        { name: 'Refresh', value: '180Hz' },
        { name: 'Response', value: '1ms GtG' },
        { name: 'Quantum Dot', value: 'Yes' },
      ],
    },
    {
      category: 'Monitors',
      brand: 'HP',
      title: 'OMEN 27qs QHD Gaming',
      price: 449,
      discountPrice: 399,
      specifications: [
        { name: 'Refresh', value: '240Hz' },
        { name: 'Adaptive sync', value: 'AMD FreeSync Premium' },
        { name: 'HDR', value: 'HDR400' },
      ],
    },
    {
      category: 'Monitors',
      brand: 'Sony',
      title: 'INZONE M9 II 27" 4K',
      price: 1099,
      discountPrice: 999,
      specifications: [
        { name: 'Panel', value: 'IPS 160Hz' },
        { name: 'HDR', value: 'HDR600' },
        { name: 'PS5', value: 'Auto HDR tone map' },
      ],
    },
    {
      category: 'Monitors',
      brand: 'Lenovo',
      title: 'Legion R45w-30 45" Ultrawide',
      price: 1699,
      discountPrice: 1549,
      specifications: [
        { name: 'Resolution', value: '5120 x 1440' },
        { name: 'Refresh', value: '165Hz' },
        { name: 'Curve', value: '1500R' },
      ],
    },
    {
      category: 'Monitors',
      brand: 'ASUS',
      title: 'ROG Swift PG32UCDM 32" QD-OLED',
      price: 1299,
      discountPrice: 1199,
      specifications: [
        { name: 'Refresh', value: '240Hz' },
        { name: 'Response', value: '0.03ms GtG' },
        { name: 'Burn-in', value: '3-year OLED warranty' },
      ],
    },
    // Accessories
    {
      category: 'Accessories',
      brand: 'Apple',
      title: 'MagSafe Duo Charger',
      price: 129,
      discountPrice: 109,
      specifications: [
        { name: 'Charging', value: 'iPhone + Apple Watch' },
        { name: 'Foldable', value: 'Travel friendly' },
        { name: 'Cable', value: 'USB-C (sold separately adapter)' },
      ],
    },
    {
      category: 'Accessories',
      brand: 'Logitech',
      title: 'MX Brio 4K Webcam',
      price: 199,
      discountPrice: 179,
      specifications: [
        { name: 'Resolution', value: '4K 30fps' },
        { name: 'HDR', value: 'RightLight 5' },
        { name: 'FOV', value: 'Adjustable 65–90°' },
      ],
    },
    {
      category: 'Accessories',
      brand: 'Samsung',
      title: '45W Super Fast Charger 2.0',
      price: 49,
      discountPrice: 39,
      specifications: [
        { name: 'Output', value: '45W PD PPS' },
        { name: 'Ports', value: 'USB-C' },
        { name: 'Cable', value: '1m included' },
      ],
    },
    {
      category: 'Accessories',
      brand: 'Razer',
      title: 'Mouse Dock Pro',
      price: 79,
      discountPrice: 69,
      specifications: [
        { name: 'Charging', value: 'Magnetic pogo' },
        { name: 'Wireless', value: '4K Hz dongle ready' },
        { name: 'RGB', value: 'Chroma' },
      ],
    },
    {
      category: 'Accessories',
      brand: 'Bose',
      title: 'SoundLink Micro Bluetooth Speaker',
      price: 119,
      discountPrice: 99,
      specifications: [
        { name: 'Durability', value: 'IP67' },
        { name: 'Mount', value: 'Tear-resistant strap' },
        { name: 'Battery', value: '6 hrs' },
      ],
    },
    {
      category: 'Accessories',
      brand: 'ASUS',
      title: 'USB-C Universal Dock DC300',
      price: 249,
      discountPrice: 219,
      specifications: [
        { name: 'Display', value: 'Triple 4K60' },
        { name: 'Power', value: '100W PD pass-through' },
        { name: 'Ethernet', value: '2.5GbE' },
      ],
    },
    {
      category: 'Accessories',
      brand: 'HP',
      title: 'USB-C Mini Dock G5',
      price: 189,
      discountPrice: 169,
      specifications: [
        { name: 'Ports', value: 'HDMI · DP · USB-A' },
        { name: 'Power', value: '100W PD' },
        { name: 'Warranty', value: '1-year' },
      ],
    },
    {
      category: 'Accessories',
      brand: 'Lenovo',
      title: 'ThinkPad Thunderbolt 4 Workstation Dock',
      price: 419,
      discountPrice: 389,
      specifications: [
        { name: 'Thunderbolt', value: '4 ports' },
        { name: 'GPU', value: 'eGPU ready' },
        { name: 'Ethernet', value: '1GbE' },
      ],
    },
    // Keyboards
    {
      category: 'Keyboards',
      brand: 'Logitech',
      title: 'MX Keys S Wireless',
      price: 129,
      discountPrice: 109,
      specifications: [
        { name: 'Layout', value: 'Full-size' },
        { name: 'Backlight', value: 'Smart illumination' },
        { name: 'Multi-device', value: 'Easy-Switch' },
      ],
    },
    {
      category: 'Keyboards',
      brand: 'Razer',
      title: 'Huntsman V3 Pro',
      price: 249,
      discountPrice: 219,
      specifications: [
        { name: 'Switches', value: 'Analog optical' },
        { name: 'Polling', value: '8000Hz' },
        { name: 'Foam', value: 'Sound dampening' },
      ],
    },
    {
      category: 'Keyboards',
      brand: 'ASUS',
      title: 'ROG Azoth 75% Wireless',
      price: 249,
      discountPrice: 229,
      specifications: [
        { name: 'Mount', value: 'Gasket' },
        { name: 'OLED', value: '2" OLED display' },
        { name: 'Hot-swap', value: 'Yes' },
      ],
    },
    {
      category: 'Keyboards',
      brand: 'Apple',
      title: 'Magic Keyboard with Touch ID',
      price: 199,
      discountPrice: 179,
      specifications: [
        { name: 'Layout', value: 'Full-size' },
        { name: 'Connectivity', value: 'Bluetooth' },
        { name: 'Touch ID', value: 'For Apple silicon Mac' },
      ],
    },
    {
      category: 'Keyboards',
      brand: 'Dell',
      title: 'KB522 Wired Business Keyboard',
      price: 39,
      discountPrice: 29,
      specifications: [
        { name: 'Spill resistance', value: 'Yes' },
        { name: 'Ports', value: 'USB-A' },
        { name: 'Quiet keys', value: 'Chiclet' },
      ],
    },
    {
      category: 'Keyboards',
      brand: 'Logitech',
      title: 'G915 LIGHTSPEED TKL',
      price: 229,
      discountPrice: 199,
      specifications: [
        { name: 'Switches', value: 'GL Tactile' },
        { name: 'Wireless', value: 'LIGHTSPEED' },
        { name: 'Battery', value: '40 hrs' },
      ],
    },
    {
      category: 'Keyboards',
      brand: 'Razer',
      title: 'BlackWidow V4 75%',
      price: 189,
      discountPrice: 169,
      specifications: [
        { name: 'Hot-swap', value: '3/5-pin' },
        { name: 'Knob', value: 'Command dial' },
        { name: 'Foam', value: 'Tape + PCB' },
      ],
    },
    {
      category: 'Keyboards',
      brand: 'HP',
      title: '970 Programmable Wireless Keyboard',
      price: 149,
      discountPrice: 129,
      specifications: [
        { name: 'Programmable', value: '24 keys' },
        { name: 'Battery', value: 'Rechargeable' },
        { name: 'Connectivity', value: 'Bluetooth · dongle' },
      ],
    },
    // Mice
    {
      category: 'Mice',
      brand: 'Logitech',
      title: 'MX Master 3S',
      price: 99,
      discountPrice: 89,
      specifications: [
        { name: 'Sensor', value: '8000 DPI' },
        { name: 'Quiet clicks', value: '90% less sound' },
        { name: 'Scroll', value: 'MagSpeed electromagnetic' },
      ],
    },
    {
      category: 'Mice',
      brand: 'Razer',
      title: 'DeathAdder V3 Pro',
      price: 149,
      discountPrice: 129,
      specifications: [
        { name: 'Sensor', value: 'Focus Pro 30K' },
        { name: 'Weight', value: '63g' },
        { name: 'Polling', value: '4K Hz capable' },
      ],
    },
    {
      category: 'Mice',
      brand: 'Apple',
      title: 'Magic Mouse',
      price: 79,
      discountPrice: 69,
      specifications: [
        { name: 'Surface', value: 'Multi-touch' },
        { name: 'Connectivity', value: 'Bluetooth' },
        { name: 'Charging', value: 'USB-C to Lightning' },
      ],
    },
    {
      category: 'Mice',
      brand: 'Logitech',
      title: 'PRO X SUPERLIGHT 2',
      price: 159,
      discountPrice: 139,
      specifications: [
        { name: 'Weight', value: '60g' },
        { name: 'Sensor', value: 'HERO 2 32k' },
        { name: 'Battery', value: '95 hrs' },
      ],
    },
    {
      category: 'Mice',
      brand: 'ASUS',
      title: 'ROG Harpe Ace Aim Lab Edition',
      price: 149,
      discountPrice: 129,
      specifications: [
        { name: 'Weight', value: '54g' },
        { name: 'Sensor', value: '36k ROG AimPoint' },
        { name: 'Connectivity', value: 'Tri-mode' },
      ],
    },
    {
      category: 'Mice',
      brand: 'HP',
      title: '930 Creator Wireless Mouse',
      price: 119,
      discountPrice: 99,
      specifications: [
        { name: 'Programmable', value: '7 buttons' },
        { name: 'Sensor', value: '3000 DPI' },
        { name: 'Recharge', value: 'USB-C' },
      ],
    },
    {
      category: 'Mice',
      brand: 'Razer',
      title: 'Basilisk V3 Pro',
      price: 159,
      discountPrice: 139,
      specifications: [
        { name: 'Scroll', value: 'HyperScroll tilt' },
        { name: 'Charging', value: 'Qi / pogo dock' },
        { name: 'RGB', value: '11 zones' },
      ],
    },
    // Tablets
    {
      category: 'Tablets',
      brand: 'Apple',
      title: 'iPad Pro 13" M4 256GB',
      price: 1299,
      discountPrice: 1199,
      specifications: [
        { name: 'Display', value: 'Ultra Retina XDR tandem OLED' },
        { name: 'Apple Pencil', value: 'Pro support' },
        { name: 'Thickness', value: '5.1mm' },
      ],
    },
    {
      category: 'Tablets',
      brand: 'Samsung',
      title: 'Galaxy Tab S9 Ultra 512GB',
      price: 1199,
      discountPrice: 1099,
      specifications: [
        { name: 'Display', value: '14.6" Dynamic AMOLED 2X' },
        { name: 'S Pen', value: 'Included' },
        { name: 'Durability', value: 'IP68' },
      ],
    },
    {
      category: 'Tablets',
      brand: 'Lenovo',
      title: 'Tab P12 256GB',
      price: 399,
      discountPrice: 349,
      specifications: [
        { name: 'Display', value: '12.7" 3K' },
        { name: 'JBL', value: 'Quad speakers' },
        { name: 'Pen', value: 'Lenovo Tab Pen Plus' },
      ],
    },
    {
      category: 'Tablets',
      brand: 'OnePlus',
      title: 'OnePlus Pad 2',
      price: 549,
      discountPrice: 499,
      specifications: [
        { name: 'Display', value: '12.1" 144Hz' },
        { name: 'Chip', value: 'Snapdragon 8 Gen 3' },
        { name: 'Battery', value: '9510mAh · 67W' },
      ],
    },
    {
      category: 'Tablets',
      brand: 'Apple',
      title: 'iPad Air 11" M2 128GB',
      price: 599,
      discountPrice: 549,
      specifications: [
        { name: 'Display', value: 'Liquid Retina' },
        { name: 'Apple Pencil', value: 'Pro · USB-C' },
        { name: 'Colors', value: 'Blue · Purple · Starlight' },
      ],
    },
    {
      category: 'Tablets',
      brand: 'Samsung',
      title: 'Galaxy Tab S9 FE+ 128GB',
      price: 649,
      discountPrice: 579,
      specifications: [
        { name: 'Display', value: '12.4" 90Hz' },
        { name: 'Battery', value: '10090mAh' },
        { name: 'Durability', value: 'IP68' },
      ],
    },
    {
      category: 'Tablets',
      brand: 'Apple',
      title: 'iPad mini (A17 Pro) 128GB',
      price: 499,
      discountPrice: 469,
      specifications: [
        { name: 'Display', value: '8.3" Liquid Retina' },
        { name: 'Cellular', value: '5G option' },
        { name: 'USB', value: 'USB-C' },
      ],
    },
  ]

  const usedSlugs = new Set()

  return blueprint.map((row, index) => {
    const rand = mulberry32(10007 + index * 977)
    const stock = 8 + Math.floor(rand() * 520)
    const avg = Math.round((3.9 + rand() * 1.1) * 10) / 10
    const count = 40 + Math.floor(rand() * 5200)
    const featured = index < 10 || index % 9 === 0
    const trending = index % 3 === 0 || index % 7 === 2

    let baseSlug = slugify(`${row.brand} ${row.title}`)
    let slug = baseSlug
    let n = 1
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${n}`
      n += 1
    }
    usedSlugs.add(slug)

    const discountPrice =
      row.discountPrice != null && row.discountPrice > 0 && row.discountPrice < row.price
        ? row.discountPrice
        : null

    const effectivePrice = discountPrice ?? row.price

    return {
      title: row.title,
      slug,
      description: buildDescription(row),
      price: row.price,
      discountPrice,
      category: row.category,
      brand: row.brand,
      images: getCatalogImageUrls(row.category, index),
      stock,
      ratings: { average: avg, count },
      featured,
      trending,
      specifications: row.specifications,
      effectivePrice,
    }
  })
}
