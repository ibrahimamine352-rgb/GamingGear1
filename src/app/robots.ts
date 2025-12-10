import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      "https://gaminggeartn.tn/sitemap.xml",
      "https://gaminggeartn.tn/sitemap-custom.xml",
    ],
  }
}
