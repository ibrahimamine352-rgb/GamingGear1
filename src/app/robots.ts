// src/app/robots.ts
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://gaminggeartn.tn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",

        // ❌ Block duplicate parameter URLs
        disallow: [
          "/*?*filterList=",
          "/*?*sort=",
          "/*?*minDt=",
          "/*?*maxDt=",
          "/*?*featured=",
          "/*?*prebuilt=",
        ],
      },
    ],

    // ✅ KEEP BOTH SITEMAPS
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-custom.xml`,
    ],
  };
}
