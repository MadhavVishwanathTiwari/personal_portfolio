import type { FeaturedProject } from "../types";
import today from "@/assets/shots/synapse/01-today-desktop.png";
import goals from "@/assets/shots/synapse/02-goals-desktop.png";
import dashboard from "@/assets/shots/synapse/03-dashboard-desktop.png";

export const synapse: FeaturedProject = {
  featured: true,
  order: 7,
  slug: "synapse",
  title: "Synapse",
  pitch:
    "A personal operating system where every number on screen has exactly one definition, written once in SQL and read by everything.",
  role: "Sole engineer",
  year: "2026",
  status: "internal",
  links: [],
  summary:
    "A single-user system covering a goal graph, a fifteen-minute time ledger, calendar sync, envelope budgeting, gym tracking and a Telegram bot. Built for an audience of one, with no sign-up route, which is exactly what made it a good place to be strict.",
  problem:
    "Every tracking tool I had used produced numbers I could not defend. A Notion dashboard adds up whatever you put into it, so a week can look productive because you logged the good hours and skipped the bad ones. I wanted a system where missing data is itself data, where a metric means the same thing everywhere it appears, and where I could prove the whole thing exports and restores without loss.",
  approach: [
    "Time is a closed ledger. A day is ninety-six fifteen-minute slots, and inside the waking window every slot is planned, actual, or explicitly marked unlogged. A database constraint refuses any slot that is not aligned to the boundary, and everything is stored in UTC. Because unlogged is a value rather than an absence, a day with gaps reports honestly instead of flattering you.",
    "Goals form a directed graph rather than a tree, since one piece of work usually serves more than one goal. Contribution weights are constrained to sum to at most one per child so an ancestor rollup cannot double-count, a guard rejects cycles, and revisions are kept so a goal's history survives being reworded.",
    "Metrics are SQL and only SQL. Around sixty Postgres views and functions define adherence, pace, effort rollups, critical path, net worth and calibration, and both the dashboard and the Telegram bot read those same definitions. Neither can drift from the other, because there is no second implementation to drift.",
    "The export is verified rather than assumed. It is assembled from the Postgres catalogue, not from a hand-written list of tables, so adding a table without deciding how it exports makes the export refuse. A restore drill deletes the account inside a transaction, reloads the archive, recomputes every metric and compares: 178 values across 17 metrics, all matching. It returns its result by raising an exception, so the rollback cannot be quietly edited away.",
  ],
  decisions: [
    {
      claim: "Adherence is three orthogonal numbers, and they are never blended into one score.",
      why: "Coverage, fidelity and allocation answer different questions: how much of the day is accounted for, how closely the day matched the plan, and whether the time went where it was supposed to. Averaging them produces a single number that can stay flat while all three move, which is information destruction dressed up as a dashboard. Three numbers you can act on beat one you cannot.",
      tag: "correctness",
    },
    {
      claim: "Every metric is a Postgres view, read by both the dashboard and the bot.",
      why: "The moment a metric exists in TypeScript as well as in SQL, the web view and the nightly Telegram summary start disagreeing about the same day, and you lose trust in both. Defining each one exactly once makes the two surfaces physically incapable of disagreeing.",
      tag: "correctness",
    },
    {
      claim: "Money is stored in integer paise, and parseFloat is banned by lint in the finance paths.",
      why: "Floating-point drift in a budget is silent and cumulative, and by the time a total looks wrong you cannot tell which entry caused it. Integer minor units make the arithmetic exact, and the CSV export casts to text inside Postgres so no amount ever passes through a JavaScript number on its way out.",
      tag: "correctness",
    },
    {
      claim: "The data export is derived from the Postgres catalogue, so a new table with no verdict makes it fail.",
      why: "An export built from a hand-maintained list silently stops being complete the first time someone adds a table and forgets. Deriving it from the catalogue inverts the default: forgetting becomes an error rather than a quiet omission. The restore drill then proves the archive is sufficient instead of assuming it.",
      tag: "trust",
    },
    {
      claim: "Nudges were tuned from logged decisions, not from intuition.",
      why: "Every nudge evaluation is recorded, including the ones suppressed by cooldown or quiet hours. One representative day shows 224 cooldown suppressions and 160 quiet-hour suppressions against four actual messages. You cannot reason about a notification system's aggressiveness from how it feels; you can from its own log.",
      tag: "operability",
    },
  ],
  metrics: [
    { value: "96", label: "fifteen-minute slots per day" },
    { value: "~60", label: "Postgres views and functions" },
    { value: "27", label: "migrations" },
    { value: "178", label: "values verified by the restore drill" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"] },
    { layer: "Data", items: ["Supabase Postgres", "Row Level Security", "Views and functions", "pg_cron", "27 migrations"] },
    { layer: "Integrations", items: ["Google Calendar two-way sync", "Telegram Bot API", "Supabase Edge Functions (Deno)"] },
    { layer: "UI", items: ["TanStack Query", "Recharts", "Radix UI", "Luxon"] },
    { layer: "Testing", items: ["Vitest", "Restore drill", "Guarded destructive wipe"] },
  ],
  shots: [
    { src: today, alt: "The fifteen-minute time ledger", device: "desktop", chrome: "synapse / today", redacted: true },
    { src: goals, alt: "The goal graph", device: "desktop", chrome: "synapse / goals / map", redacted: true },
    { src: dashboard, alt: "Adherence over time", device: "desktop", chrome: "synapse / dashboard", redacted: true },
  ],
  outcome:
    "Finished and in daily use by one person: me. There is no public deployment and no sign-up, by design. It is in this portfolio because it is the clearest example of how I think about data correctness when nobody is forcing me to care.",
};
