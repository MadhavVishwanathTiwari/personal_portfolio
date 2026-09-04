import type { FeaturedProject } from "../types";
import hero from "@/assets/shots/priya-tripathi/01-hero-desktop.png";
import services from "@/assets/shots/priya-tripathi/02-services-desktop.png";
import blog from "@/assets/shots/priya-tripathi/03-blog-desktop.png";
import testimonials from "@/assets/shots/priya-tripathi/04-testimonials-desktop.png";
import heroMobile from "@/assets/shots/priya-tripathi/05-hero-mobile.png";
import webgl from "@/assets/shots/priya-tripathi/06-webgl-deck-desktop.png";

export const priyaTripathi: FeaturedProject = {
  featured: true,
  order: 3,
  slug: "priya-tripathi",
  title: "Priya S. Tripathi",
  pitch:
    "A consultancy site with a custom CMS the client runs herself, where publishing rules live in the database rather than in the admin UI.",
  role: "Sole engineer and designer",
  year: "2026",
  status: "live",
  client: "Shivoham Universal Sol",
  links: [
    { kind: "live", label: "priyastripathi.co.in", href: "https://www.priyastripathi.co.in/" },
    { kind: "demo", label: "the WebGL pitch build", href: "https://shivoham-universal-demo.vercel.app/" },
  ],
  summary:
    "A Vastu, numerology, astrology and healing practice with clients in India and abroad. The site is the practice's front door and its publishing system: she writes posts and adds testimonials herself, from a phone, without me.",
  problem:
    "Her previous site was a 2021 PHP build that had gone dark, taking a decade of copy, credentials and client testimonials with it. Rebuilding meant recovering that material first, then making sure she never depends on a developer to publish again. She is not technical, and the two failure modes that actually matter for a practice like hers are a half-written post going public and a client's words appearing without permission.",
  approach: [
    "The public site is server-rendered and cached, so a visitor never waits on a database. The admin at /admin is a small Tiptap editor that stores rich text as JSONB and renders it server-side into the article's own typography, which means a reader never downloads an editor to read a post. Images are downscaled to WebP in the browser before upload, and deleting a record deletes its file.",
    "Publishing does not require a deploy. Cached pages are tagged per post and per collection, and saving in the admin calls updateTag, so a new post is live in seconds without a build. An authenticated revalidate endpoint covers writes that happen outside the admin.",
    "The site was built twice. The first build was a pitch: a WebGL hero with the full 78-card tarot deck as a single instanced mesh, which won the work and, more usefully, was the vehicle for recovering the copy and testimonials from the dead PHP site. The production build then reuses that material with a warm cream and gold identity sampled from her own reference material.",
    "Two things are deliberately absent. The enquiry form has no backend at all: it composes a WhatsApp message with an email fallback and shows a UPI QR alongside the typed-out handle, because a visitor on a phone cannot scan their own screen. And the whole site is light-only, because a dark mode of a cream-and-gold identity is a different design, not a toggle.",
  ],
  decisions: [
    {
      claim: "A testimonial cannot be published unless written permission was recorded. That is a CHECK constraint.",
      why: "These are real clients describing health, money and family. Consent enforced by a checkbox in an admin form is enforced by whoever last edited that form. As a database constraint it holds for the admin UI, for a script, for a migration and for me. The rule outlives the code that currently implements it.",
      tag: "trust",
    },
    {
      claim: "Drafts are hidden by row-level security, not by a WHERE clause.",
      why: "Every public page reads with the anonymous key, and that key can only see published rows. A forgotten filter in a new query returns nothing instead of leaking a half-written post. The app is then free to be careless in a way that is merely broken rather than embarrassing.",
      tag: "correctness",
    },
    {
      claim: "Publishing is a cache tag invalidation, not a deployment.",
      why: "The client posts on her own schedule, sometimes from a phone. Tying that to a CI build means a five-minute wait, a build that can fail, and a dependency on me. Tagged caches give her the speed of a static site with the immediacy of a database.",
      tag: "operability",
    },
    {
      claim: "The database is kept awake by a heartbeat written from two directions.",
      why: "Cached public pages never touch Supabase, so a well-optimised site puts a free project to sleep after about a week and the first visitor after that gets an error. A Vercel cron pings an endpoint daily and pg_cron writes the same row from inside Postgres, so neither the app nor the platform being the sole liveness signal can take the site down.",
      tag: "operability",
    },
  ],
  metrics: [
    { value: "18+", label: "recovered client testimonials" },
    { value: "5", label: "hand-composed breakpoints" },
    { value: "9", label: "admin routes" },
    { value: "2021", label: "the PHP site the copy was rescued from" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"] },
    { layer: "Data", items: ["Supabase Postgres", "Row Level Security", "CHECK constraints", "Supabase Storage", "pg_cron"] },
    { layer: "UI", items: ["Tiptap", "Cormorant Garamond", "Allura", "Browser-side WebP encoding"] },
    { layer: "Infra", items: ["Vercel", "Vercel Cron", "Tagged caching"] },
  ],
  shots: [
    { src: hero, alt: "The homepage of priyastripathi.co.in", device: "desktop", chrome: "priyastripathi.co.in", caption: "Cream and gold, sampled from the client's own reference material." },
    { src: services, alt: "The services section", device: "desktop", chrome: "priyastripathi.co.in/#services" },
    { src: blog, alt: "The blog index, published from the custom CMS", device: "desktop", chrome: "priyastripathi.co.in/blog", caption: "Every post here was written and published by the client, with no deploy." },
    { src: testimonials, alt: "The testimonials section", device: "desktop", chrome: "priyastripathi.co.in/#testimonials", caption: "None of these can appear without recorded written permission." },
    { src: webgl, alt: "The WebGL tarot deck from the pitch build", device: "desktop", chrome: "shivoham-universal-demo.vercel.app", caption: "The pitch build: 78 cards as one instanced mesh, three draw calls." },
    { src: heroMobile, alt: "The site on a phone", device: "mobile" },
  ],
  outcome:
    "Live on her own domain and run by her. Recent commits are her copy edits rather than my features, which is the outcome I wanted. Two service pages are still flagged in the codebase as awaiting her sign-off on wording.",
};
