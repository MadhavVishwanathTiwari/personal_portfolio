import type { FeaturedProject } from "../types";
import hero from "@/assets/shots/p4-realty/01-hero-desktop.png";
import properties from "@/assets/shots/p4-realty/02-properties-desktop.png";
import insights from "@/assets/shots/p4-realty/03-insights-desktop.png";
import heroMobile from "@/assets/shots/p4-realty/04-hero-mobile.png";

export const p4Realty: FeaturedProject = {
  featured: true,
  order: 5,
  slug: "p4-realty",
  title: "P4 Realty",
  pitch:
    "A dark editorial property site for a Noida advisory, built on spec to win the account.",
  role: "Sole engineer and designer",
  year: "2026",
  status: "wip",
  client: "P4 Realty, Noida",
  links: [{ kind: "demo", label: "p4-reality-demo.vercel.app", href: "https://p4-reality-demo.vercel.app/" }],
  summary:
    "A property advisory in Noida and Greater Noida West with more than two decades of local experience and a website that did not say so. I built the site before there was a contract, because for this kind of client a working site is a more persuasive pitch than a deck.",
  problem:
    "Real estate sites default to volume: hundreds of listings, filters nobody uses, and a form that goes nowhere. This business does the opposite, taking on few clients and advising them for months, so the site had to feel like an advisory rather than a portal. The conversion also happens on WhatsApp, not email, which changes what the whole page is for.",
  approach: [
    "The identity is dark editorial: a near-black ink, warm cream text, a restrained gold, a serif display face, and a film-grain overlay to stop large flat areas looking digital. Smooth scrolling is scripted rather than native, so the long homepage reads as one continuous movement instead of a series of jumps.",
    "Listings and insight articles are typed data files rather than a CMS. With eight properties and five articles, a CMS is infrastructure to maintain in exchange for nothing; when the client wants to edit listings themselves, the same content shape moves behind an admin without touching the pages.",
    "Every call to action is a WhatsApp deep link with the message already written for the page you are on, so a visitor on a property page starts the conversation about that property rather than typing an introduction. A floating button keeps that one action reachable from anywhere on the page.",
  ],
  decisions: [
    {
      claim: "Built and deployed before the client agreed to pay for it.",
      why: "A proposal asks a business owner to imagine a website. A live URL on their phone, with their properties and their testimonials in it, does not. The cost of being wrong is a weekend; the cost of a deck that does not land is the account. This is also why it is in this portfolio as work in progress rather than as a finished delivery.",
      tag: "trust",
    },
    {
      claim: "No CMS, and no database, for eight listings.",
      why: "A CMS for thirteen content items is a login, a schema, a hosting dependency and a migration path bought in exchange for editing convenience nobody has asked for yet. Typed data files give the same content model with compile-time errors, and the shape is designed so it can move behind an admin later without the pages knowing.",
      tag: "cost",
    },
    {
      claim: "Scroll-reveal animation was removed from the images above the fold.",
      why: "The reveal wrappers held the largest images back until they had been scrolled into view, which is exactly the wrong behaviour for the hero and the story section: the page looked empty during the moment that decides whether a visitor stays. Perceived speed beat the animation, so the animation lost.",
      tag: "performance",
    },
  ],
  metrics: [
    { value: "8", label: "curated listings" },
    { value: "5", label: "insight articles" },
    { value: "23+", label: "years of experience the site has to convey" },
    { value: "0", label: "database rows" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"] },
    { layer: "UI", items: ["Motion", "Lenis smooth scroll", "Fraunces", "Blur placeholders"] },
    { layer: "Integrations", items: ["WhatsApp deep links"] },
    { layer: "Infra", items: ["Vercel"] },
  ],
  shots: [
    { src: hero, alt: "The P4 Realty homepage", device: "desktop", chrome: "p4-reality-demo.vercel.app", caption: "Dark editorial, film grain, and a single gold accent." },
    { src: properties, alt: "The curated property listings", device: "desktop", chrome: "p4-reality-demo.vercel.app/properties" },
    { src: insights, alt: "The insights articles", device: "desktop", chrome: "p4-reality-demo.vercel.app/insights" },
    { src: heroMobile, alt: "P4 Realty on a phone", device: "mobile" },
  ],
  outcome:
    "Deployed as a demo and genuinely unfinished: the README is still the framework default and there is no admin yet. It is here because a half-built thing you can click beats a finished thing you have to imagine, and because I would rather show the state of a live negotiation than dress it up.",
};
