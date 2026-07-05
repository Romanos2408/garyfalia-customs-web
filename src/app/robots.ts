import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// static export (GitHub Pages preview) requires this to be explicit
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
