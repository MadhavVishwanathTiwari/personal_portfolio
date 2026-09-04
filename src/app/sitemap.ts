import type { MetadataRoute } from "next";
import { getFeatured } from "@/lib/projects";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: now, priority: 0.8 },
    ...getFeatured().map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
