import type { SecondaryProject } from "../types";

/**
 * Smaller work. These carry no case study on purpose: one interesting fact
 * each is the whole point, and padding them out would dilute the seven.
 */

export const arLeadFinder: SecondaryProject = {
  featured: false,
  order: 8,
  slug: "ar-lead-finder",
  title: "Lead Finder",
  pitch: "Internal lead sourcing and enrichment for AutoReceptionist.",
  note: "Upload a CSV or scrape Google Maps, then enrich through Clay and export for outreach. The queue is drained by pg_cron using FOR UPDATE SKIP LOCKED, so several workers can pull from it at once without a job being handed out twice, and results come back matched by correlation id.",
  role: "Sole engineer",
  year: "2025",
  status: "internal",
  links: [],
  stack: [
    { layer: "Framework", items: ["Next.js", "TypeScript"] },
    { layer: "Data", items: ["Supabase Postgres", "pg_cron", "SKIP LOCKED queue"] },
    { layer: "Integrations", items: ["Clay", "Apify"] },
  ],
};

export const endoleExtractor: SecondaryProject = {
  featured: false,
  order: 9,
  slug: "endole-extractor",
  title: "Endole Extractor",
  pitch: "A UK company-data scraper with a human in the loop.",
  note: "Paste a list URL, get the raw HTML on disk, then a CSV of every column. It opens a real browser rather than a headless one specifically so a person can clear the bot check, which is the difference between a scraper that works and one that works twice.",
  role: "Sole engineer",
  year: "2025",
  status: "internal",
  links: [],
  stack: [
    { layer: "Framework", items: ["Python", "Selenium", "BeautifulSoup"] },
    { layer: "UI", items: ["Next.js local console"] },
    { layer: "Testing", items: ["Doctor command", "Unit tests"] },
  ],
};

export const kfiqProgressTracker: SecondaryProject = {
  featured: false,
  order: 10,
  slug: "kfiq-progress-tracker",
  title: "KFIQ Daily Progress",
  pitch: "A standup tracker for the KFIQ core team.",
  note: "Three questions a day, an admin overview and a leaderboard. Sign-in is passwordless against a five-address allowlist checked before an OTP is ever sent, and a trigger provisions the profile with the right role on first login. Built in one sitting; it has needed nothing since.",
  role: "Sole engineer",
  year: "2025",
  status: "internal",
  client: "Cannock Private Limited",
  links: [],
  stack: [
    { layer: "Framework", items: ["Next.js", "Server Actions", "TypeScript"] },
    { layer: "Data", items: ["Supabase Postgres", "Row Level Security", "Email OTP"] },
  ],
};

export const shivohamWebgl: SecondaryProject = {
  featured: false,
  order: 11,
  slug: "shivoham-webgl",
  title: "Shivoham WebGL Deck",
  pitch: "The pitch build that won the consultancy site.",
  note: "A full 78-card tarot deck that deals itself into a wave, turns toward the pointer and re-gathers on scroll. All 78 cards are one instanced mesh drawn in three calls from two textures, with faces sampled out of an atlas by a patched vertex shader, and an invisible proxy mesh owns the pointer events so hovering cannot chase itself.",
  role: "Sole engineer",
  year: "2026",
  status: "live",
  client: "Shivoham Universal Sol",
  links: [
    {
      kind: "demo",
      label: "shivoham-universal-demo.vercel.app",
      href: "https://shivoham-universal-demo.vercel.app/",
    },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js 16", "React Three Fiber", "three.js"] },
    { layer: "UI", items: ["Instanced rendering", "Custom vertex shader", "Framer Motion"] },
    { layer: "Data", items: ["Python asset pipeline"] },
  ],
};
