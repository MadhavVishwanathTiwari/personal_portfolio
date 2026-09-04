import type { Metadata } from "next";
import { profile } from "@/data/profile";

/**
 * Set NEXT_PUBLIC_SITE_URL in the Vercel project once the real domain is
 * attached. Everything canonical, OG and sitemap-related reads from here.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://madhavendra.vercel.app";

export const SITE_NAME = `${profile.name} · ${profile.role}`;

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: profile.name,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
