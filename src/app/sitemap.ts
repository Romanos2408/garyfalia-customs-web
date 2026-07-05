import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// static export (GitHub Pages preview) requires this to be explicit
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/gallery", "/about", "/commission"];
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "/gallery" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/commission" ? 0.9 : 0.7,
  }));
}
