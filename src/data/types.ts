import type { StaticImageData } from "next/image";

export type ProjectStatus =
  /** Publicly reachable. */
  | "live"
  /** Built and deployed, still being finished. */
  | "wip"
  /** In production but behind auth — no public link. */
  | "internal"
  /** Academic or non-deployed research. */
  | "research";

export type LinkKind = "live" | "demo" | "repo" | "writeup";

export interface ProjectLink {
  kind: LinkKind;
  /** What the reader sees, e.g. "autoreceptionist.io". */
  label: string;
  href: string;
}

export type StackLayer =
  | "Framework"
  | "Data"
  | "AI / ML"
  | "Integrations"
  | "Infra"
  | "Testing"
  | "UI";

export interface StackGroup {
  layer: StackLayer;
  items: string[];
}

/**
 * The rhetorical unit of the whole site: a claim plus the reason it holds.
 * Everything else on a case-study page exists to give these context.
 */
export interface Decision {
  /** Stated as a decision, not a feature. No hedging. */
  claim: string;
  /** The failure it prevents or the cost it buys. Two to four sentences. */
  why: string;
  tag?: "correctness" | "cost" | "latency" | "trust" | "operability" | "performance";
}

/** A number that survives scrutiny. Never invent one. */
export interface Metric {
  value: string;
  label: string;
}

export interface Shot {
  /** Static import, so width, height and blurDataURL come for free. */
  src: StaticImageData;
  alt: string;
  caption?: string;
  device: "desktop" | "mobile";
  /** URL printed in the fake browser bar. */
  chrome?: string;
  /** The capture needed a signed-in session and data has been replaced. */
  redacted?: boolean;
}

/**
 * A walkthrough. `loom` embeds by share id; `file` plays an mp4 from
 * /public/media. Either way the player sits in the same browser frame the
 * screenshots use, so it does not read as a different kind of object.
 */
export interface Video {
  kind: "loom" | "file";
  /** Loom share id, or a path under /public for a file. */
  src: string;
  title: string;
  caption?: string;
  /** Shown in the frame's URL bar. */
  chrome?: string;
}

/**
 * Third-party proof. Used sparingly: a claim the client signed is worth more
 * than another paragraph from me.
 */
export interface Credential {
  image: StaticImageData;
  alt: string;
  title: string;
  issuer: string;
  /** Why it is here, in one or two sentences. */
  note: string;
  reference?: string;
}

interface ProjectBase {
  slug: string;
  title: string;
  /** One prospect-facing line. Used on cards and in <title>. */
  pitch: string;
  role: string;
  year: string;
  status: ProjectStatus;
  /** Omitted for his own products. */
  client?: string;
  links: ProjectLink[];
  stack: StackGroup[];
  /** Ordering on the landing page and in prev/next navigation. */
  order: number;
}

/**
 * A featured project cannot compile without a problem statement, at least
 * three decisions and at least one screenshot. That is what lets the
 * case-study template render every project with no conditional sections.
 */
export interface FeaturedProject extends ProjectBase {
  featured: true;
  summary: string;
  problem: string;
  approach: string[];
  decisions: [Decision, Decision, Decision, ...Decision[]];
  metrics: Metric[];
  shots: [Shot, ...Shot[]];
  /** A walkthrough, when one says more than a still can. */
  video?: Video;
  /** Third-party proof, when it exists. */
  credential?: Credential;
  /** The honest close: shipped state, caveats, what is next. */
  outcome: string;
}

export interface SecondaryProject extends ProjectBase {
  featured: false;
  /** Two sentences: the one technically interesting fact. */
  note: string;
}

export type Project = FeaturedProject | SecondaryProject;

export const isFeatured = (p: Project): p is FeaturedProject => p.featured;

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  wip: "In progress",
  internal: "Internal",
  research: "Research",
};
