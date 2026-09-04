import type { FeaturedProject } from "../types";
import hero from "@/assets/shots/autoreceptionist/01-hero-desktop.png";
import roi from "@/assets/shots/autoreceptionist/02-roi-desktop.png";
import features from "@/assets/shots/autoreceptionist/03-features-desktop.png";
import heroMobile from "@/assets/shots/autoreceptionist/04-hero-mobile.png";

export const autoreceptionist: FeaturedProject = {
  featured: true,
  order: 1,
  slug: "autoreceptionist",
  title: "AutoReceptionist",
  pitch:
    "An AI phone receptionist for US home-service businesses, and a pipeline that builds a working demo of it for every prospect overnight.",
  role: "Founder, sole engineer",
  year: "2025 to present",
  status: "live",
  links: [{ kind: "live", label: "autoreceptionist.io", href: "https://autoreceptionist.io/" }],
  summary:
    "My own product. An AI receptionist that answers calls, qualifies the caller and books into a real Google Calendar, sold to HVAC, plumbing, roofing and other home-service companies in the US. The interesting half is not the voice agent, it is the machine that sells it.",
  problem:
    "Cold outreach to a plumbing company in Texas gets deleted in two seconds. A generic demo does not survive that, and a hand-built demo per prospect does not scale past about five a week. The product needed a way for a prospect to click one link and hear an AI receptionist that already knows their trade, their service area, their after-hours policy and their pricing questions, with nobody having built it by hand.",
  approach: [
    "The site is a Next.js App Router application with an in-browser voice demo on the landing page: a web call through the Retell AI SDK, with a toll-free number and a QR code as fallbacks for people who would rather use a phone. The booking agent has six tools behind it, checking availability and creating, editing, cancelling and looking up appointments through n8n webhooks against a real calendar.",
    "The demo generator is a four-stage pipeline: scrape the prospect's site, extract the facts, verify them, then render a themed sandbox at /sandbox/<slug>. Only the extract stage calls a model, which is why a complete demo costs about a fifth of a cent. A GitHub Action runs the whole thing at 04:00 UTC against the outreach spreadsheet, with rotation logic so a backlog larger than the nightly limit does not starve the oldest rows, and sheet write-back deferred until the demos are verified and pushed.",
    "Each sandbox is themed to the prospect without ever painting their brand colour directly. Their colour picks the nearest of ten pre-validated presets by OKLCH hue and lightness, and the preset guarantees contrast. The theme contract is eleven tokens; the contrast rules are asserted by a unit test, so a new preset cannot be added that fails AA.",
  ],
  decisions: [
    {
      claim:
        "A fact only reaches a generated demo if it can be quoted verbatim from a page on the client's own domain.",
      why: "The pipeline writes copy about a business I have never spoken to, and the prospect reads it before they read anything I wrote. One invented service area or made-up price ends the conversation and deserves to. Anything without a verbatim source degrades to a line saying the team will confirm, and the build reports the provenance failures to a JSON file rather than shipping them. A clean exit code means the demo is safe to send unreviewed.",
      tag: "trust",
    },
    {
      claim:
        "If the agent claims it changed the calendar and the trace shows no calendar tool ran, the turn is thrown away and re-rolled.",
      why: "Small models will happily narrate a booking they never made, and a caller who hangs up believing they have an appointment is worse than a caller who got no answer at all. A guard inspects the tool trace before the turn is spoken and replaces it rather than appending a correction. Honest refusals are on an exemption list, so the agent saying a slot is unavailable is never re-rolled.",
      tag: "correctness",
    },
    {
      claim: "The assembled system prompt has a size ceiling, and a test fails the build if it is exceeded.",
      why: "The agent runs on small, cheap models to keep per-call cost viable, and those models silently drop instructions past a certain length. Nothing errors; the agent just quietly stops following the last rule you added. Making the ceiling a test turns an invisible degradation into a red build.",
      tag: "cost",
    },
    {
      claim: "The model is a ladder, not a choice: Claude Haiku 4.5, then GPT-4o-mini, then Gemini Flash.",
      why: "A prospect clicking a demo link at 2am in Arizona will not come back if the page errors. Provider incidents are routine, so the extraction and chat paths fall through a ladder rather than depending on one vendor being up. It also means the cheapest capable model gets first refusal on every call.",
      tag: "operability",
    },
  ],
  metrics: [
    { value: "67", label: "prospect demos generated" },
    { value: "~0.15¢", label: "model cost per demo" },
    { value: "6", label: "calendar tools on the agent" },
    { value: "17", label: "co-located test files" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Framer Motion"] },
    { layer: "AI / ML", items: ["Retell AI", "OpenRouter", "Claude Haiku 4.5", "GPT-4o-mini", "Gemini Flash"] },
    { layer: "Integrations", items: ["n8n", "Google Calendar", "Google Sheets", "Apollo"] },
    { layer: "Infra", items: ["Vercel", "GitHub Actions"] },
    { layer: "Testing", items: ["Vitest", "Provenance verifier", "Contrast assertions"] },
  ],
  video: {
    kind: "loom",
    src: "c2651aff76e744a2979787e8693a42b1",
    title: "The AutoReceptionist demo agent taking a call",
    chrome: "autoreceptionist.io / live demo",
    caption:
      "The agent on the landing page, taking a call end to end: qualifying the caller, checking real availability and booking the slot.",
  },
  shots: [
    { src: hero, alt: "The AutoReceptionist landing page", device: "desktop", chrome: "autoreceptionist.io", caption: "The landing page runs a live web call against the booking agent." },
    { src: features, alt: "The features section of autoreceptionist.io", device: "desktop", chrome: "autoreceptionist.io/#features" },
    { src: roi, alt: "The ROI calculator on autoreceptionist.io", device: "desktop", chrome: "autoreceptionist.io/#roi", caption: "The calculator prices the prospect's own missed calls back to them." },
    { src: heroMobile, alt: "AutoReceptionist on a phone", device: "mobile" },
  ],
  outcome:
    "Live and selling. The nightly pipeline has produced 67 prospect demos; the voice agent books into a real calendar today. It is a young product with a small customer base, so the honest claim is about what is built and running, not about revenue.",
};
