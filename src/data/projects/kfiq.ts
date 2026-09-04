import type { FeaturedProject } from "../types";
import certificate from "@/assets/credentials/cannock-internship-certificate.png";
import hero from "@/assets/shots/kfiq/01-hero-desktop.png";
import odds from "@/assets/shots/kfiq/02-odds-desktop.png";
import fields from "@/assets/shots/kfiq/03-fields-desktop.png";
import apply from "@/assets/shots/kfiq/04-apply-desktop.png";
import heroMobile from "@/assets/shots/kfiq/05-hero-mobile.png";
import internApp from "@/assets/shots/kfiq/06-intern-app-desktop.png";

export const kfiq: FeaturedProject = {
  featured: true,
  order: 4,
  slug: "kfiq",
  title: "KFIQ",
  pitch:
    "A free mentored internship programme: the public site, the intern platform behind it, and certificates a recruiter can verify.",
  role: "Full-stack developer",
  year: "2025 to 2026",
  status: "live",
  client: "Cannock Private Limited",
  links: [
    { kind: "live", label: "kfiq.com", href: "https://kfiq.com/" },
    { kind: "live", label: "kfiq-interns.vercel.app", href: "https://kfiq-interns.vercel.app/" },
  ],
  summary:
    "Students apply, get real tasks matched to a career track, submit work, receive human feedback, and finish with a certificate that points at what they actually built. Two applications: a marketing site that has to convert a sceptical student, and a platform that has to run the programme.",
  problem:
    "Free internship programmes have a credibility problem before they have a product problem. A student has been burned by certificate mills, so the site has to be unusually plain about what is and is not promised. Behind it, the programme needs applications, cohorts, referral tracking, task assignment, submission review and certification to be one coherent system rather than five spreadsheets, and it needs to work on the first cohort with no operational slack.",
  approach: [
    "The public site is a single long page in thirteen composed sections, with all copy in one content module so the team can revise wording without touching components. The application form serves two roles, intern and campus ambassador, from one endpoint: a honeypot field and a per-IP rate limiter in front, then a single Postgres transaction that resolves the active cohort, resolves a referral code to the ambassador who owns it, and dedupes on email and phone with typed error codes rather than a generic failure.",
    "The platform is the larger half. A four-step onboarding parses the student's uploaded resume through an external API and lets them confirm it. Task groups contain subgroups contain tasks; interns apply per task, work, and submit markdown with attachments. Admins approve, reject, and leave threaded feedback. When every task is approved, a certificate image is generated with a QR code pointing at a public verifier, so a recruiter can check it without an account.",
    "It is the second version. The first platform used hand-rolled bcrypt and JWT cookie sessions and a single monolithic schema file that had drifted out of sync with production. The rewrite moved authentication to Supabase Auth, replaced the schema file with numbered tracked migrations, and added certificates, the public verifier and CSV bulk import. Same product, a foundation that can be changed safely.",
    "Because the programme launches with real students and no room to be down, the platform ships its own observability: a health endpoint reporting the live commit SHA and build time, a deep status endpoint that checks database, schema, auth and storage and answers 200 or 503, a readable debug page behind a token, and a post-deploy smoke test.",
  ],
  decisions: [
    {
      claim: "The application is one Postgres transaction that resolves cohort, referral and duplicates together.",
      why: "Sign-up touches four things that must agree: which cohort is open, which ambassador gets the referral credit, whether this person already applied, and the record itself. Doing that as four calls means a partially-created student when the third one fails, and a student who has already given up on you by the time anyone notices. Typed error codes come back out so the form can say which field is the problem rather than 'something went wrong'.",
      tag: "correctness",
    },
    {
      claim: "Certificates are verified by a stranger, not by the holder.",
      why: "A certificate a student can only show as an image is worth nothing to the recruiter reading their CV. Each one carries a QR code to a public verification route that needs no login and shows what the work actually was. Revocation is supported for the same reason: a credential nobody can withdraw is a credential nobody should trust.",
      tag: "trust",
    },
    {
      claim: "The v1 schema file was retired in favour of numbered migrations before any new feature was added.",
      why: "The single schema file had drifted from production and was missing a table that the running application depended on. Every feature built on top of it would have inherited that uncertainty. Migrations made the database's history the source of truth, which is what made the certificate and verifier work safe to build afterwards.",
      tag: "operability",
    },
    {
      claim: "The platform reports its own build SHA and dependency health over HTTP.",
      why: "The first cohort is real students on a schedule. When something looks wrong, the first question is always whether the deployed code is the code you think it is, and the second is which dependency is down. Answering both from a URL turns a debugging session into a page load.",
      tag: "operability",
    },
  ],
  metrics: [
    { value: "54", label: "API route handlers" },
    { value: "21", label: "tables" },
    { value: "8", label: "career tracks" },
    { value: "~15k", label: "lines of TypeScript" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js", "React 19", "TypeScript", "Tailwind CSS v4", "Server Actions"] },
    { layer: "Data", items: ["Supabase Postgres", "Drizzle ORM", "Numbered migrations", "Triggers", "Views"] },
    { layer: "Integrations", items: ["Supabase Auth", "Supabase Storage", "SharpAPI resume parsing", "TextLink SMS OTP", "MarkupGo", "n8n", "nodemailer"] },
    { layer: "Infra", items: ["Vercel", "Health and status endpoints", "Post-deploy smoke tests"] },
  ],
  shots: [
    { src: hero, alt: "The KFIQ homepage", device: "desktop", chrome: "kfiq.com", caption: "Monochrome by constraint: no gradients, no neon, nothing that reads as a certificate mill." },
    { src: odds, alt: "The acceptance-odds calculator", device: "desktop", chrome: "kfiq.com/#odds" },
    { src: fields, alt: "The eight career tracks", device: "desktop", chrome: "kfiq.com/#fields" },
    { src: apply, alt: "The dual-role application form", device: "desktop", chrome: "kfiq.com/#apply", caption: "One endpoint, two roles, one transaction." },
    { src: internApp, alt: "The intern platform dashboard", device: "desktop", chrome: "kfiq-interns.vercel.app", redacted: true },
    { src: heroMobile, alt: "KFIQ on a phone", device: "mobile" },
  ],
  credential: {
    image: certificate,
    alt: "Certificate of internship completion issued by Cannock Private Limited",
    title: "The platform issued this, and then issued one to me.",
    issuer: "Cannock Private Limited, 13 August 2026",
    note:
      "I built the certificate generator, the QR verification and the public verifier route, and then finished the engagement holding one of its own certificates. The wording on it is the client's, not mine: an internship management platform covering onboarding, task allocation, work submissions and automated certificate issuance with public verification.",
    reference: "CPL-INT-2026-011 / verifiable at cannock.in",
  },
  outcome:
    "Both applications are deployed and the platform is production-hardened. The programme is pre-launch, so the traction figures on the public site are deliberate placeholders until the first cohort completes. The numbers above are build facts; there are no user numbers to quote yet, and I would rather say that than round one up.",
};
