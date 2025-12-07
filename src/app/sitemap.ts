// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import prismadb from "@/lib/prismadb";
import { slugify } from "@/lib/slugify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gaminggeartn.tn";

  // 🔹 Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/storefront`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/builds`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/full-setup`,
      lastModified: new Date(),
    },
  ];

  // 🔹 Dynamic product URLs
  const products = await prismadb.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      updatedAt: true,
    },
    where: {
      isArchived: false,
    },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => {
    const slug =
      (product as any).slug ??
      `${slugify(product.name)}-${product.id}`;

    return {
      url: `${baseUrl}/product/${slug}`,
      lastModified: product.updatedAt,
    };
  });

  return [...staticRoutes, ...productRoutes];
}
