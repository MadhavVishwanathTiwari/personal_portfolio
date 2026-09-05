import type { FeaturedProject } from "../types";
import hero from "@/assets/shots/kfiq-site/01-hero-desktop.png";
import apply from "@/assets/shots/kfiq-site/02-apply-desktop.png";
import heroMobile from "@/assets/shots/kfiq-site/03-hero-mobile.png";

/**
 * The marketing site only. The platform it feeds is a separate repo, a
 * separate deployment and a separate case study — see kfiq-platform.ts.
 */
export const kfiqSite: FeaturedProject = {
  featured: true,
  order: 6,
  slug: "kfiq-site",
  title: "KFIQ",
  pitch:
    "The front door for a free internship programme, written for a student whose first assumption is that it is a scam.",
  role: "Sole engineer",
  year: "2025",
  status: "live",
  client: "Cannock Private Limited",
  links: [
    { kind: "live", label: "kfiq.com", href: "https://kfiq.com/" },
    { kind: "writeup", label: "The platform behind it", href: "/work/kfiq-platform" },
  ],
  summary:
    "One long page in thirteen composed sections, plus the application endpoint behind it. It has to explain a free programme to an audience that has been sold a paid one before, and then take applications for two different roles without losing any of them.",
  problem:
    "Free internship programmes have a credibility problem before they have a product problem. The student reading this page has seen certificate mills, and every visual convention those use — gradients, badges, big round numbers — is a signal they have learned to distrust. So the design constraints are unusually tight, and the copy has to be plain about what is and is not promised. The form behind it then has to resolve four things that must agree with each other, on the first cohort, with no operational slack.",
  approach: [
    "The page is thirteen sections composed from one content module, so the team can rewrite the wording of the programme without touching a component. Every claim on it is meant to be checkable: what the tasks are, who reviews them, what the certificate says, and what it costs, which is nothing.",
    "The application form serves interns and campus ambassadors from a single endpoint. A honeypot field and a per-IP rate limiter sit in front, both cheap and both before the database is touched. Then one Postgres transaction resolves the active cohort, resolves a referral code to the campus ambassador who owns it, and dedupes on email and phone.",
    "Failures come back as typed error codes rather than a generic message, so the form can say which field is the problem. Submissions are forwarded to per-role n8n webhooks, and a confirmation email goes out through hand-built HTML templates rather than a third-party template service.",
  ],
  decisions: [
    {
      claim:
        "One endpoint serves both roles, and a single Postgres transaction resolves cohort, referral and duplicates together.",
      why: "Sign-up touches four things that have to agree: which cohort is open, which ambassador earns the referral, whether this person already applied, and the record itself. As four separate calls, a failure on the third leaves a half-created student, and the student is gone before anyone notices. As one transaction it either all happens or none of it does, and the typed error codes coming back out mean the form names the bad field instead of shrugging.",
      tag: "correctness",
    },
    {
      claim: "No gradients, no neon, no colour. The palette is a hard rule in the repo.",
      why: "The audience's prior is that this is a scam, and the visual language of the things that scammed them is exactly the language a landing page reaches for by default. Monochrome is not a taste preference here, it is the argument: the page looks like a document rather than a pitch. Writing it down as a constraint in the repo is what stops it eroding one accent colour at a time.",
      tag: "trust",
    },
    {
      claim: "The traction numbers are visible placeholders, not plausible inventions.",
      why: "The programme has not run a cohort yet, so there are no students placed and no testimonials to show. The content module ships literal bracketed markers where those numbers will go. Inventing them would have been trivial and unfalsifiable, and it would have made the page exactly the thing it is arguing against. A page that says it does not have the number yet is the only version of this page worth publishing.",
      tag: "trust",
    },
  ],
  metrics: [
    { value: "13", label: "composed landing sections" },
    { value: "1", label: "endpoint, two roles" },
    { value: "5/min", label: "per-IP rate limit before the database" },
    { value: "~3,050", label: "lines of TypeScript" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Motion"] },
    { layer: "Data", items: ["Supabase Postgres", "Direct pg transaction", "Typed error codes"] },
    { layer: "Integrations", items: ["n8n webhooks", "nodemailer", "Hand-built HTML email"] },
    { layer: "Infra", items: ["Vercel", "Honeypot", "In-memory IP rate limiter"] },
  ],
  shots: [
    {
      src: hero,
      alt: "The KFIQ homepage",
      device: "desktop",
      chrome: "kfiq.com",
      caption:
        "Monochrome by constraint. Nothing here uses the visual language of the certificate mills this audience has already been burned by.",
    },
    {
      src: apply,
      alt: "The dual-role application form",
      device: "desktop",
      chrome: "kfiq.com/#apply",
      caption:
        "One endpoint, two roles, and one transaction resolving the cohort, the referral and the duplicate check together.",
    },
    { src: heroMobile, alt: "KFIQ on a phone", device: "mobile" },
  ],
  outcome:
    "Live at kfiq.com and taking applications. The programme is pre-launch, so the traction figures on the page are deliberate placeholders until the first cohort completes — the numbers above are build facts, and there are no user numbers to quote yet. The platform those applications feed into is a separate piece of work.",
};
