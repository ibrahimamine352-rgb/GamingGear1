import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://gaminggeartn.tn"

  // Fetch products with images
  const products = await prismadb.product.findMany({
    select: {
      slug: true,
      id: true,
      updatedAt: true,
      images: { select: { url: true } },
    },
  })

  const urls = products
    .map((p) => {
      const productUrl = `${baseUrl}/product/${p.slug ?? p.id}`

      const imagesXML = p.images
        .map(
          (img) => `
        <image:image>
          <image:loc>${img.url}</image:loc>
        </image:image>`
        )
        .join("")

      return `
      <url>
        <loc>${productUrl}</loc>
        <lastmod>${p.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
        ${imagesXML}
      </url>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  >
    ${urls}
  </urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
