// src/app/sitemap.ts
import { MetadataRoute } from "next"
import prismadb from "@/lib/prismadb"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gaminggeartn.tn"

  // 1️⃣ Categories
  const categories = await prismadb.category.findMany({
    select: { name: true, updatedAt: true },
  })

  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/shop?categorie=${encodeURIComponent(c.name)}`,
    lastModified: c.updatedAt,
  }))

  // 2️⃣ Products
  const products = await prismadb.product.findMany({
    select: { slug: true, id: true, updatedAt: true },
  })

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug ?? p.id}`,
    lastModified: p.updatedAt,
  }))

  // 3️⃣ Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/build-pc`,
      lastModified: new Date(),
    },
  ]

  return [...staticUrls, ...categoryUrls, ...productUrls]
}
