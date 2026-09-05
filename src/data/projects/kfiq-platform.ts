import type { FeaturedProject } from "../types";
import certificate from "@/assets/credentials/cannock-internship-certificate.png";
import browse from "@/assets/shots/kfiq-platform/01-browse-desktop.png";
import tasks from "@/assets/shots/kfiq-platform/02-tasks-desktop.png";
import submit from "@/assets/shots/kfiq-platform/03-submit-desktop.png";
import applications from "@/assets/shots/kfiq-platform/04-admin-applications-desktop.png";
import submissions from "@/assets/shots/kfiq-platform/05-admin-submissions-desktop.png";
import certificates from "@/assets/shots/kfiq-platform/06-certificates-desktop.png";
import verify from "@/assets/shots/kfiq-platform/07-verify-desktop.png";
import importCsv from "@/assets/shots/kfiq-platform/08-import-desktop.png";
import debugOverlay from "@/assets/shots/kfiq-platform/09-debug-desktop.png";

/**
 * The application. The marketing site that feeds it is a separate repo and a
 * separate case study — see kfiq-site.ts.
 */
export const kfiqPlatform: FeaturedProject = {
  featured: true,
  order: 4,
  slug: "kfiq-platform",
  title: "KFIQ Platform",
  pitch:
    "The application that runs the internship: onboarding, task assignment, work review, and certificates a recruiter can verify without an account.",
  role: "Full-stack developer",
  year: "2025 to 2026",
  status: "live",
  client: "Cannock Private Limited",
  links: [
    { kind: "live", label: "kfiq-interns.vercel.app", href: "https://kfiq-interns.vercel.app/" },
    { kind: "writeup", label: "The site that feeds it", href: "/work/kfiq-site" },
  ],
  summary:
    "Students onboard with an AI-parsed resume, browse task groups matched to a career track, apply for the tasks they want, submit work as markdown, and receive human feedback. Admins run cohorts, build the curriculum from CSV, review submissions, and the system issues a verifiable certificate when every approved-for task is approved.",
  problem:
    "The programme needs applications, cohorts, referral tracking, a task hierarchy, submission review and certification to behave as one system rather than five spreadsheets that disagree. Harder than any of those individually: the certificate at the end has to mean something to a recruiter who has never heard of KFIQ, has no account, and has every reason to assume a free internship certificate is worthless.",
  approach: [
    "Onboarding is four steps: set a password, upload a resume, have it parsed by an external API, then confirm what it extracted. Each step unlocks the next, and the parse has explicit pending, processing and failed states rather than a spinner that can lie.",
    "The curriculum is a hierarchy: task groups contain subgroups contain tasks, linked to a cohort. Admins build it by CSV import with a preview that reports exactly what will be created before anything is written. Interns then browse, pick the tasks they want, and apply; admins approve and assign only the ones they agree to, so both sides of that negotiation are explicit.",
    "Work is submitted as markdown with a live preview and PDF attachments, reviewed in full by an admin, and answered with threaded feedback. When every task an intern was approved for is approved, a certificate image is generated and a QR code is minted against a public verification route.",
    "It is the second version. The first used hand-rolled bcrypt and JWT cookie sessions, and a single monolithic schema file that had drifted out of sync with production — it was missing a table the running application depended on. The rewrite moved authentication to Supabase Auth, replaced the schema file with numbered tracked migrations, and only then added certificates, the verifier and CSV import.",
  ],
  decisions: [
    {
      claim: "Certificates are verified by a stranger, not by the holder.",
      why: "A certificate a student can only show as an image is worth nothing to the recruiter reading their CV, because the recruiter has no way to tell it from an image anyone could make. Each one carries a QR code and a code that both resolve to a public route needing no login, showing the programme, the field, the skills and the issue date. Revocation exists for the same reason: a credential nobody can withdraw is a credential nobody should trust.",
      tag: "trust",
    },
    {
      claim: "Later tasks stay locked until the earlier ones are approved.",
      why: "A track that hands out all its tasks at once is a track that can be farmed: submit ten things at once, get a certificate, learn nothing. Sequencing the unlock means the certificate attests to a progression that actually happened in order, which is the only claim it is making. It also means a reviewer's feedback lands while it can still change what the intern does next.",
      tag: "trust",
    },
    {
      claim: "The v1 schema file was retired for numbered migrations before any new feature was added.",
      why: "The single schema file had drifted from production and was missing a table the application was already using, so nobody could say with confidence what the database actually looked like. Every feature built on top of that would have inherited the uncertainty. Making the migration history the source of truth first is what made the certificate and verifier work safe to build at all.",
      tag: "operability",
    },
    {
      claim: "Admin access needs an allowlist row and a matching email domain, not either one.",
      why: "This is a system where an admin can approve work and issue credentials. A single check is a single mistake away from minting one: an allowlist row added to the wrong address, or a domain check defeated by anyone who can receive mail at that domain. Requiring both means neither error is sufficient on its own.",
      tag: "correctness",
    },
    {
      claim: "The platform reports its own build SHA and dependency health over HTTP.",
      why: "The first cohort is real students on a schedule. When something looks wrong the first question is always whether the deployed code is the code you think it is, and the second is which dependency is down. A health endpoint returning the live commit SHA and a status endpoint that checks database, schema, auth and storage answer both from a URL, which turns a debugging session into a page load.",
      tag: "operability",
    },
  ],
  metrics: [
    { value: "54", label: "API route handlers" },
    { value: "21", label: "tables" },
    { value: "18", label: "page routes" },
    { value: "~15k", label: "lines of TypeScript" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js", "React 19", "TypeScript", "Tailwind CSS v4", "Server Actions"] },
    { layer: "Data", items: ["Supabase Postgres", "Drizzle ORM", "Numbered migrations", "Triggers", "Views"] },
    { layer: "Integrations", items: ["Supabase Auth", "Supabase Storage", "SharpAPI resume parsing", "TextLink SMS OTP", "MarkupGo certificates", "QR verification"] },
    { layer: "Infra", items: ["Vercel", "Health and status endpoints", "Post-deploy smoke tests", "CSV bulk import"] },
  ],
  shots: [
    {
      src: verify,
      alt: "The public certificate verifier showing a valid credential",
      device: "desktop",
      chrome: "kfiq-interns.vercel.app/verify/KFIQ-2026-UBPSZG",
      caption:
        "The whole point of the certificate, on a route with no login: programme, field, skills, issue date and the rendered credential, checked against the record.",
    },
    {
      src: browse,
      alt: "An intern browsing a task group",
      device: "desktop",
      chrome: "kfiq-interns / dashboard / browse",
      caption:
        "Interns pick the tasks they want. Admins assign only the ones they approve, so both sides of that negotiation are explicit.",
    },
    {
      src: tasks,
      alt: "An intern's assigned tasks with progress",
      device: "desktop",
      chrome: "kfiq-interns / dashboard / tasks",
      caption:
        "Later tasks stay locked until the earlier ones are approved, which is what stops a track from being farmed for a certificate.",
    },
    {
      src: submit,
      alt: "Submitting work as markdown",
      device: "desktop",
      chrome: "kfiq-interns / submit work",
      caption:
        "Markdown with a live preview and PDF attachments, so what the reviewer reads is what the intern wrote.",
    },
    {
      src: applications,
      alt: "The admin applications queue",
      device: "desktop",
      chrome: "kfiq-interns / admin / applications",
      caption: "Approve and assign in one action, or reject with a note.",
    },
    {
      src: submissions,
      alt: "An admin reviewing a submission",
      device: "desktop",
      chrome: "kfiq-interns / admin / submissions",
      caption:
        "The reviewer sees the rendered submission in full, and the certificate issues automatically once every approved-for task is approved.",
    },
    {
      src: importCsv,
      alt: "The CSV curriculum import preview",
      device: "desktop",
      chrome: "kfiq-interns / admin / task-groups / import",
      caption:
        "One CSV builds a whole curriculum, and the preview says exactly what it will create before anything is written. The column contract is documented on the page rather than in a wiki.",
    },
    {
      src: certificates,
      alt: "An earned certificate with its verification code",
      device: "desktop",
      chrome: "kfiq-interns / dashboard / certificates",
      caption: "The holder's view of the same credential the verifier resolves.",
    },
    {
      src: debugOverlay,
      alt: "The in-app debug log overlay showing live request timings",
      device: "desktop",
      chrome: "kfiq-interns / dashboard / browse?debug=1",
      caption:
        "A client-side log overlay behind a query flag, showing every request and its timing. Not the health endpoint, which answers separately over HTTP with the live commit SHA.",
    },
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
    "Deployed and production-hardened, with health and status endpoints, a debug page and a post-deploy smoke test. The screenshots here are from the test deployment against seeded records and my own account rather than a live cohort, because the programme has not run one yet. The certificate in the verifier shot is real and the route is public: the code resolves.",
};
