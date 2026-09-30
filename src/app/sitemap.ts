import type { MetadataRoute } from "next";
import { pages } from "@/content/pages";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages
    .filter((p) => p.status === "live")
    .map((p) => ({ url: `${siteUrl}${p.path === "/" ? "" : p.path}` }));
}
