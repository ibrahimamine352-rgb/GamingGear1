// src/app/(storefront)/shop/page.tsx

import prismadb from '@/lib/prismadb'
import Sidebar from './_componenets/sideBar'
import { Metadata } from 'next'
import { Product } from '@/types'

import {
  HeadsetFilters,
  LaptopFilters,
  MicFilters,
  MouseFilters,
  MousepadFilters,
  casesFilters,
  coolingFilters,
  cpusFilters,
  gpusFilters,
  keyboardFilters,
  memoriesFilters,
  motherboardFilters,
  powersuppliesFilters,
  screensFilters,
  storagesFilters,
} from './_componenets/Filters'

import {
  addCaseFitlters,
  addCoolingFitlters,
  addHardDiskFitlters,
  addHeadsetFitlters,
  addKeyboardFitlters,
  addLaptopFitlters,
  addMicFitlters,
  addMouseFitlters,
  addMousepadFitlters,
  addPowerFitlters,
  addRamFitlters,
  addScreenFitlters,
  addcpuFitlters,
  addgpuitlters,
  addmotherboardFitlters,
  addCameraFitlters,
  addControllerFitlters,
} from './_componenets/FilterFunctions'

// 🔥 Force this route to be fully dynamic (fixes DYNAMIC_SERVER_USAGE in prod)
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const revalidate = 0

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

/* ----------------- SEO: generateMetadata (category + search + pagination canonicals + OG images) ----------------- */

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const baseUrl = 'https://gaminggeartn.tn'

  // Normalize params
  const searchRaw = searchParams['search'] ?? ''
  const categoryRaw = searchParams['categorie'] ?? ''
  const pageRaw = searchParams['page'] ?? '1'

  const search =
    Array.isArray(searchRaw) ? searchRaw[0].trim() : searchRaw.toString().trim()
  const categoryRawStr =
    Array.isArray(categoryRaw) ? categoryRaw[0].trim() : categoryRaw.toString().trim()
  const page =
    Array.isArray(pageRaw) ? pageRaw[0].trim() : pageRaw.toString().trim() || '1'

  // ✅ force category slug to lowercase for canonical (avoid /GPU vs /gpu duplicates)
  const categorySlug = categoryRawStr ? categoryRawStr.toLowerCase() : ''

  // Build canonical URL
  const url = new URL(baseUrl)

  if (categorySlug) {
    url.pathname = `/shop/${encodeURIComponent(categorySlug)}`
  } else {
    url.pathname = '/shop'
  }

  if (search) {
    url.searchParams.set('search', search)
  }
  // Only keep page in canonical if > 1
  if (page !== '1') {
    url.searchParams.set('page', page)
  }

  const canonical = url.toString()

  // 🖼️ OG image (shop/category default)
  const ogImage = `${baseUrl}/og/shop-default.png` // make sure this exists
  const ogImages = [{ url: ogImage }]

  try {
    // 1) Search page
    if (search.length > 0) {
      const title = `Résultats pour "${search}" | Gaming Gear TN`
      const description = `Découvrez les résultats pour "${search}" sur Gaming Gear TN : PC Gamer, PC portables, composants, écrans et accessoires en Tunisie.`

      return {
        metadataBase: new URL(baseUrl),
        title,
        description,
        alternates: {
          canonical,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          siteName: 'Gaming Gear TN',
          locale: 'fr_TN',
          type: 'website',
          images: ogImages,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [ogImage],
        },
        robots: {
          index: true,
          follow: true,
        },
      }
    }

    // 2) Category page
    if (categoryRawStr.length > 0) {
      const title = `${categoryRawStr} Tunisie – Prix & Achat | Gaming Gear TN`
      const description = `Achetez ${categoryRawStr} en Tunisie chez Gaming Gear TN : produits gaming, composants et accessoires avec livraison rapide et garantie locale.`

      const keywords: string[] = [
        `${categoryRawStr} Tunisie`,
        `Achat ${categoryRawStr} Tunisie`,
        `${categoryRawStr} gaming`,
        `Prix ${categoryRawStr} Tunisie`,
        'Gaming Gear TN',
        'PC Gamer Tunisie',
      ]

      return {
        metadataBase: new URL(baseUrl),
        title,
        description,
        keywords,
        alternates: {
          canonical,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          siteName: 'Gaming Gear TN',
          locale: 'fr_TN',
          type: 'website',
          images: ogImages,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [ogImage],
        },
        robots: {
          index: true,
          follow: true,
        },
      }
    }

    // 3) Default store page
    const defaultTitle =
      'Boutique Gaming Tunisie – PC Gamer, Laptops & Composants | Gaming Gear TN'
    const defaultDescription =
      'Découvrez notre boutique gaming en Tunisie : PC Gamer, PC portables, composants, écrans et périphériques. Livraison rapide et garantie locale chez Gaming Gear TN.'

    return {
      metadataBase: new URL(baseUrl),
      title: defaultTitle,
      description: defaultDescription,
      alternates: {
        canonical,
      },
      openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        url: canonical,
        siteName: 'Gaming Gear TN',
        locale: 'fr_TN',
        type: 'website',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: defaultTitle,
        description: defaultDescription,
        images: [ogImage],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch {
    // Safe fallback
    const canonicalFallback = `${baseUrl}/shop`

    const fallbackTitle =
      'Boutique Gaming Tunisie – PC Gamer, Laptops & Composants | Gaming Gear TN'
    const fallbackDescription =
      'PC Gamer, PC portables, composants, écrans et périphériques en Tunisie. Livraison rapide et garantie locale.'

    return {
      metadataBase: new URL(baseUrl),
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: {
        canonical: canonicalFallback,
      },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: canonicalFallback,
        siteName: 'Gaming Gear TN',
        locale: 'fr_TN',
        type: 'website',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: fallbackTitle,
        description: fallbackDescription,
        images: [ogImage],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  }
}

/* ----------------- Types & helpers ----------------- */

export type HomeFilter = {
  title: string
  data: any[]
}

export interface compFilter {
  type: string
  data: FilterList
}

export interface FilterList {
  [key: string]: { id: number; searchKey: string }[]
}

const stripAccents = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const norm = (s: string) => stripAccents(s).toLowerCase().trim()

const resolveCategoryKey = (label: string): string => {
  const k = norm(label)
  if (['gpu', 'gpus', 'graphics cards (gpu)'].includes(k)) return 'gpu'
  if (['cpu', 'cpus', 'processor', 'processors (cpu)'].includes(k)) return 'cpu'
  if (['ram', 'memory', 'memories', 'memory (ram)'].includes(k)) return 'ram'
  if (['storage', 'storages', 'disk', 'disks', 'harddisk', 'hard disk'].includes(k))
    return 'hardDisk'
  if (['motherboard', 'motherboards', 'carte mere', 'carte mére'].includes(k))
    return 'motherboard'
  if (['cases', 'case', 'pc case', 'pccase'].includes(k)) return 'case'
  if (['power', 'powersupply', 'power supply', 'power supplies', 'psu', 'psus'].includes(k))
    return 'power'
  if (['cooling', 'cooler', 'coolers'].includes(k)) return 'cooling'
  if (['monitor', 'monitors', 'screen', 'screens', 'display', 'displays'].includes(k))
    return 'screen'
  if (['laptop', 'laptops', 'all laptops'].includes(k)) return 'laptop'
  if (['keyboard', 'keyboards'].includes(k)) return 'keyboard'
  if (['headset', 'headsets', 'casque', 'casques'].includes(k)) return 'casque'
  if (['mouse', 'mice'].includes(k)) return 'mouse'
  if (['mousepad', 'mousepads', 'mouse pad', 'mouse pads'].includes(k)) return 'mousePad'
  if (['mic', 'microphone', 'microphones'].includes(k)) return 'mic'
  if (['camera', 'cameras', 'webcam', 'webcams'].includes(k)) return 'camera'
  if (['controller', 'controllers', 'gamepad', 'joystick'].includes(k)) return 'controller'
  return ''
}

/* ----------------- PAGE COMPONENT ----------------- */

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const whereClause: Record<string, any> = { isArchived: false }

  const page = searchParams['page'] ?? '1'
  const categoryy = (searchParams['categorie'] ?? '').toString()
  const search = (searchParams['search'] ?? '').toString()

  const sort = searchParams['sort'] ?? 'Prix : Croissant'
  const maxDt = searchParams['maxDt'] ?? ''
  const minDt = searchParams['minDt'] ?? ''
  const filterListParam = searchParams['filterList'] ?? ''

  // Prebuilt flag
  const prebuilt = (searchParams['prebuilt'] ?? '').toString().toLowerCase()
  if (prebuilt && prebuilt !== '0' && prebuilt !== 'false' && prebuilt !== 'off') {
    whereClause.PreBuiltPcmodel = { isNot: null }
  }

  // Featured flag
  const featured = (searchParams['featured'] ?? '').toString().toLowerCase()
  if (featured && featured !== '0' && featured !== 'false' && featured !== 'off') {
    whereClause.isFeatured = true
  }

  // --- text search ---
  const wordList = search.toString().split(' ')
  if (search.length > 0) {
    const words = wordList.map((w) => w.trim()).filter(Boolean)
    if (words.length > 0) {
      whereClause.AND = (whereClause.AND ?? []).concat(
        words.map((word) => ({
          name: { contains: word, mode: 'insensitive' },
        }))
      )
    } else {
      whereClause.name = { contains: search.toString(), mode: 'insensitive' }
    }
  }

  // --- price range (merge, don’t overwrite) ---
  const price: any = {}
  if (maxDt.toString().length > 0) price.lte = parseInt(maxDt.toString(), 10)
  if (minDt.toString().length > 0) price.gte = parseInt(minDt.toString(), 10)
  if (Object.keys(price).length)
    whereClause.price = { ...(whereClause.price || {}), ...price }

  // --- category mapping / categoryId resolve ---
  let catKey = ''
  if (categoryy.length > 0) {
    const label = categoryy.trim()
    const k = norm(label)

    // Which labels should be handled via relations instead of categoryId?
    const RELATION_ONLY_KEYS = [
      'mouse',
      'mice',
      'keyboard',
      'keyboards',
      'headset',
      'headsets',
      'casque',
      'casques',
      'mousepad',
      'mousepads',
      'mouse pad',
      'mouse pads',
      'mic',
      'microphone',
      'microphones',
      'camera',
      'cameras',
      'webcam',
      'webcams',
      'controller',
      'controllers',
      'gamepad',
      'joystick',
      'manette',
      'manettes',
    ]

    const isRelationOnly = RELATION_ONLY_KEYS.includes(k)

    // 1) If it's NOT a relation-only label, use categoryId
    if (!isRelationOnly) {
      const cat = await prismadb.category.findFirst({
        where: { name: { equals: label, mode: 'insensitive' } },
        select: { id: true, name: true },
      })
      if (cat) {
        whereClause.categoryId = cat.id
      }
    }

    // 2) Always apply the relation mapping for our "virtual" categories
    if (['mouse', 'mice'].includes(k)) whereClause.Mouse = { some: {} }
    else if (['keyboard', 'keyboards'].includes(k)) whereClause.keyboard = { some: {} }
    else if (['headset', 'headsets', 'casque', 'casques'].includes(k))
      whereClause.Headset = { some: {} }
    else if (['gpu', 'gpus'].includes(k)) whereClause.gpus = { some: {} }
    else if (['motherboard', 'motherboards'].includes(k))
      whereClause.motherboard = { some: {} }
    else if (['storage', 'storages', 'harddisk', 'hard disk', 'hard-disks'].includes(k))
      whereClause.storages = { some: {} }
    else if (
      [
        'power supplies',
        'power-supplies',
        'power supply',
        'powersupply',
        'powersupplies',
        'psu',
        'psus',
      ].includes(k)
    )
      whereClause.powersupplies = { some: {} }
    else if (['case', 'cases', 'pc case', 'pc cases', 'pccase'].includes(k))
      whereClause.cases = { some: {} }
    else if (['cooling', 'cooler', 'coolers'].includes(k)) whereClause.cooling = { some: {} }
    else if (['monitor', 'monitors', 'screen', 'screens', 'display', 'displays'].includes(k))
      whereClause.screens = { some: {} }
    else if (['mousepad', 'mousepads', 'mouse pad', 'mouse pads'].includes(k))
      whereClause.Mousepad = { some: {} }
    else if (['mic', 'microphone', 'microphones'].includes(k)) whereClause.Mic = { some: {} }
    else if (['camera', 'cameras', 'webcam', 'webcams'].includes(k))
      whereClause.Camera = { some: {} }
    else if (
      ['controller', 'controllers', 'gamepad', 'joystick', 'manette', 'manettes'].includes(k)
    )
      whereClause.Manette = { some: {} }

    // finally, decide which filter branch to use
    catKey = resolveCategoryKey(label)
  }

  // --- decode & apply FILTERS coming from UI (route param “filterList”) ---
  // --- decode & apply FILTERS coming from UI (route param “filterList”) ---
  let fList: FilterList | undefined = undefined

  if (filterListParam) {
    // Normalize to a single string
    const raw =
      Array.isArray(filterListParam) ? filterListParam[0] : filterListParam

    if (typeof raw === 'string' && raw.length > 0) {
      try {
        const decoded = JSON.parse(
          decodeURIComponent(raw)
        ) as compFilter

        fList = decoded.data

        const activeKey = catKey || resolveCategoryKey(categoryy)

        switch (activeKey) {
          case 'motherboard':
            whereClause.motherboard = addmotherboardFitlters(fList).data
            break
          case 'cpu':
            whereClause.cpus = addcpuFitlters(fList).data
            break
          case 'gpu':
            whereClause.gpus = addgpuitlters(fList).data
            break
          case 'ram':
            whereClause.memories = addRamFitlters(fList).data
            break
          case 'hardDisk':
            whereClause.storages = addHardDiskFitlters(fList).data
            break
          case 'cooling':
            whereClause.cooling = addCoolingFitlters(fList).data
            break
          case 'case':
            whereClause.cases = addCaseFitlters(fList).data
            break
          case 'power':
            whereClause.powersupplies = addPowerFitlters(fList).data
            break
          case 'screen':
            whereClause.screens = addScreenFitlters(fList).data
            break
          case 'laptop':
            whereClause.Laptop = addLaptopFitlters(fList).data
            break
          case 'keyboard':
            whereClause.keyboard = addKeyboardFitlters(fList).data
            break
          case 'mic':
            whereClause.Mic = addMicFitlters(fList).data
            break
          case 'casque':
            whereClause.Headset = addHeadsetFitlters(fList).data
            break
          case 'mouse':
            whereClause.Mouse = addMouseFitlters(fList).data
            break
          case 'mousePad':
            whereClause.Mousepad = addMousepadFitlters(fList).data
            break
          case 'camera':
            whereClause.Camera = addCameraFitlters(fList).data
            break
          case 'controller':
            whereClause.Manette = addControllerFitlters(fList).data
            break
          default:
            break
        }
      } catch (err) {
        // If filterList is invalid, just ignore it instead of crashing the page
        console.error('Invalid filterList param', raw, err)
        fList = undefined
      }
    }
  }


  // ---- sorting ----
  let orderByClause: Record<string, 'asc' | 'desc'> = {}
  switch (sort) {
    case 'Les plus populaires':
      orderByClause = { soldnumber: 'desc' }
      break
    case 'Les plus récents':
      orderByClause = { price: 'desc' }
      break
    case 'Prix : Croissant':
      orderByClause = { price: 'asc' }
      break
    case 'Prix : Décroissant':
      orderByClause = { price: 'desc' }
      break
    default:
      orderByClause = { price: 'asc' }
  }

  // ---- paging ----
  const perpage = 12
  const p = parseInt((page ?? '1').toString(), 10)
  const pageIndex = Number.isFinite(p) && p > 0 ? p : 1

  // ---- main query ----
  const prods = await prismadb.product.findMany({
    where: whereClause,
    include: {
      motherboard: true,
      cases: true,
      cooling: true,
      Headset: true,
      keyboard: true,
      Laptop: true,
      memories: true,
      Mic: true,
      Mouse: true,
      Mousepad: true,
      powersupplies: true,
      PreBuiltPcmodel: true,
      screens: true,
      storages: true,
      cpus: true,
      gpus: true,
      images: true,
      category: true,
      additionalDetails: true,
      Camera: true,
      Manette: true,
    },
    skip: perpage * (pageIndex - 1),
    take: perpage,
    orderBy: orderByClause,
  })

  const totalprod = await prismadb.product.count({ where: whereClause })

  // ---- categories box (left) ----
  const categorie = await prismadb.category.findMany({
    where: { products: { some: whereClause } },
    include: { _count: { select: { products: true } } },
    orderBy: { products: { _count: 'desc' } },
  })

  // ---- compute filters to display on the left ----
  const filterPromises: Array<Promise<HomeFilter>> = []
  if (prods.findIndex((e) => (e.motherboard?.length ?? 0) > 0) > -1)
    filterPromises.push(motherboardFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.cpus?.length ?? 0) > 0) > -1)
    filterPromises.push(cpusFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.gpus?.length ?? 0) > 0) > -1)
    filterPromises.push(gpusFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.Headset?.length ?? 0) > 0) > -1)
    filterPromises.push(HeadsetFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.Laptop?.length ?? 0) > 0) > -1)
    filterPromises.push(LaptopFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.Mic?.length ?? 0) > 0) > -1)
    filterPromises.push(MicFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.Mouse?.length ?? 0) > 0) > -1)
    filterPromises.push(MouseFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.Mousepad?.length ?? 0) > 0) > -1)
    filterPromises.push(MousepadFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.cases?.length ?? 0) > 0) > -1)
    filterPromises.push(casesFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.cooling?.length ?? 0) > 0) > -1)
    filterPromises.push(coolingFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.keyboard?.length ?? 0) > 0) > -1)
    filterPromises.push(keyboardFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.memories?.length ?? 0) > 0) > -1)
    filterPromises.push(memoriesFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.powersupplies?.length ?? 0) > 0) > -1)
    filterPromises.push(powersuppliesFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.screens?.length ?? 0) > 0) > -1)
    filterPromises.push(screensFilters() as unknown as Promise<HomeFilter>)
  if (prods.findIndex((e) => (e.storages?.length ?? 0) > 0) > -1)
    filterPromises.push(storagesFilters() as unknown as Promise<HomeFilter>)

  const filters = await Promise.all(filterPromises)

  // ✅ formatted products (normalized types)
  const formattedproducts: Product[] = prods.map((item: any) => ({
    id: item.id,
    name: item.name ?? '',
    images: item.images ?? [],
    discountPrice: Number(item.discountPrice ?? item.dicountPrice ?? 0),
    dicountPrice: Number(item.dicountPrice ?? item.discountPrice ?? 0),
    stock: Number(item.stock ?? 0),
    price: Number(item.price ?? 0),
    category: item.category ?? null,
    description: item.description ?? '',
    additionalDetails: item.additionalDetails ?? null,
  })) as unknown as Product[]

  const total = Math.ceil(totalprod / perpage)

  let header = 'Store'
  if (categoryy.length > 0) {
    header = categoryy.toString()
  } else if (prebuilt && !['0', 'false', 'off', 'no'].includes(prebuilt)) {
    header = 'Builds'
  }

  // ---------- SEO H1 text ----------
  let h1Title = 'Boutique gaming en Tunisie – PC Gamer & Composants'
  if (categoryy.length > 0) {
    h1Title = `Achat ${categoryy} en Tunisie – Gaming Gear TN`
  } else if (search.length > 0) {
    h1Title = `Résultats pour "${search}" – Boutique Gaming Gear TN`
  }

  // ---------- JSON-LD ItemList for this listing ----------
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: formattedproducts.map((prod, index) => ({
      '@type': 'ListItem',
      position: (pageIndex - 1) * perpage + index + 1,
      url: `https://gaminggeartn.tn/product/${prod.id}`,
      name: prod.name,
      image: prod.images?.[0]?.url ?? undefined,
    })),
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Visible H1 for SEO */}
      <div className="container mx-auto px-6 pt-8">
        <h1 className="text-2xl font-semibold mb-4">{h1Title}</h1>
      </div>

      <div className="container mx-auto px-6 pb-8">
        {/* JSON-LD for ItemList (category/search listing) */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />

        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)] glass-card p-6">
          <Sidebar
            hasNextPage={pageIndex < total}
            hasPrevPage={pageIndex > 1}
            pagetotal={total}
            perpage={12}
            selectfilterList={fList}
            pageindex={pageIndex}
            totalprod={totalprod}
            header={header}
            category={categoryy.toString()}
            filter={filters}
            isloadingg={false}
            categories={categorie}
            titlee={search.toString()}
            items={formattedproducts}
            sort={sort.toString()}
          />
        </div>
      </div>
    </main>
  )
}

export default Home
