/**
 * Curated Unsplash CDN URLs for deterministic catalog seeding.
 * Same aspect ratio (1200×900) for consistent cards and galleries.
 * @see https://unsplash.com/license
 */
const Q = 'auto=format&fit=crop&w=1200&h=900&q=82'

/** @param {string} id `photo-…` slug from images.unsplash.com */
function u(id) {
  return `https://images.unsplash.com/${id}?${Q}`
}

const DEFAULT_POOL = [
  u('photo-1496181133206-80ce9b88a853'),
  u('photo-1511707171634-5f897ff02aa9'),
  u('photo-1505740420920-2020a001a226'),
  u('photo-1525547719571-a2d4ac8944e2'),
  u('photo-1593640408182-f31b450a3b28'),
  u('photo-1546435776-a629e426bfcd'),
]

const POOLS = {
  Smartphones: [
    u('photo-1511707171634-5f897ff02aa9'),
    u('photo-1510557880182-3d4d3bba35cb'),
    u('photo-1592750475338-74b7b21085ab'),
    u('photo-1601972602237-8c79241f076a'),
    u('photo-1565849904464-1e39edd8ff1a'),
    u('photo-1592899679489-886765c74445'),
  ],
  Laptops: [
    u('photo-1496181133206-80ce9b88a853'),
    u('photo-1525547719571-a2d4ac8944e2'),
    u('photo-1541807084-5c138b2d33f0'),
    u('photo-1588872657578-948eaf6e80e4'),
    u('photo-1611186871348-b1a84bf84911'),
    u('photo-1517336714734-49f27b84b3c6'),
  ],
  Gaming: [
    u('photo-1542751371-adc38448a05e'),
    u('photo-1591488320449-011701bb6704'),
    u('photo-1593640408182-f31b450a3b28'),
    u('photo-1511512578047-dfb367046420'),
    u('photo-1606144042614-24141e773f8'),
    u('photo-1593305841991-05cd297b31b8'),
  ],
  Audio: [
    u('photo-1505740420920-2020a001a226'),
    u('photo-1546435776-a629e426bfcd'),
    u('photo-1484704849700-f032a568e944'),
    u('photo-1524678606370-a47ad25cb52d'),
    u('photo-1572569511254-d8f925fe2cbb'),
    u('photo-1545127398-14699f92334b'),
  ],
  'Smart Watches': [
    u('photo-1523275335684-37898b6b31f0'),
    u('photo-1579586337278-3befd40fd17a'),
    u('photo-1434493789849-df2c6de9ccf9'),
    u('photo-1508685096489-7aacd43fd3b0'),
    u('photo-1617043786392-f809dcf13c3f'),
    u('photo-1526406915894-7bcd65f30d67'),
  ],
  Monitors: [
    u('photo-1527443224154-c499a4b10bb2'),
    u('photo-1616763358408-9e9ee0af1bc8'),
    u('photo-1550745165-9bc0b252726f'),
    u('photo-1591238372338-36aa8057a477'),
    u('photo-1586281380119-7127e30326ec'),
    u('photo-1614644142888-ac396a9e1f4d'),
  ],
  Accessories: [
    u('photo-1587825145173-6f7d8ba7f5d2'),
    u('photo-1625948511311-b12d5ca8e3ae'),
    u('photo-1609091839311-d5365f9ff1c5'),
    u('photo-1583394838336-acd9787f2d79'),
    u('photo-1622434641406-a158123450f9'),
    u('photo-1611532736597-de2d4265fba3'),
  ],
  Keyboards: [
    u('photo-1587829741301-d6435802e637'),
    u('photo-1618384887929-16ec33cfb9e1'),
    u('photo-1595225476254-87a45b30c013'),
    u('photo-1541140532154-b024d705b0b6'),
    u('photo-1511467687858-23d96c32e420'),
    u('photo-1555617981-dac3880dd37f'),
  ],
  Mice: [
    u('photo-1527814050087-3793815479db'),
    u('photo-1615663245857-ac93bb7c39e7'),
    u('photo-1527864550417-7fd91fc51a46'),
    u('photo-1563297003-aefa3b3b4f43'),
    u('photo-1550009158-9f3fddf843ad'),
    u('photo-1575986712617-6c2ca518a2c8'),
  ],
  Tablets: [
    u('photo-1544244015-0df4b3ffc6b0'),
    u('photo-1561154464-82e9adf32764'),
    u('photo-1585790050230-3dd667c2f9cd'),
    u('photo-1623123278166-4b3d00fe7b9a'),
    u('photo-1611532736597-de2d4265fba3'),
    u('photo-1542751110-97427bbecfca'),
  ],
}

/**
 * @param {string} category
 * @param {number} catalogIndex
 * @returns {string[]}
 */
export function getCatalogImageUrls(category, catalogIndex) {
  const pool = POOLS[category] ?? DEFAULT_POOL
  const i = Math.abs(catalogIndex) % pool.length
  const a = pool[i]
  const b = pool[(i + 1) % pool.length]
  const c = pool[(i + 2) % pool.length]
  return [a, b, c]
}
