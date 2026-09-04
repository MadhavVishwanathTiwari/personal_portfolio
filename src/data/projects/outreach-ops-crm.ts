import type { FeaturedProject } from "../types";
import write from "@/assets/shots/outreach-ops-crm/01-write-desktop.png";
import leads from "@/assets/shots/outreach-ops-crm/02-leads-desktop.png";
import queue from "@/assets/shots/outreach-ops-crm/03-queue-desktop.png";
import pipeline from "@/assets/shots/outreach-ops-crm/04-pipeline-desktop.png";
import contacts from "@/assets/shots/outreach-ops-crm/05-contacts-desktop.png";

export const outreachOpsCrm: FeaturedProject = {
  featured: true,
  order: 2,
  slug: "outreach-ops-crm",
  title: "Outreach Ops",
  pitch:
    "The cold-email CRM that runs AutoReceptionist's outbound. Event-sourced, timezone-correct, and built so the wrong state cannot be written.",
  role: "Sole engineer",
  year: "2025",
  status: "internal",
  links: [],
  summary:
    "An internal CRM for two operators sending about forty hand-written emails a day. It replaced a Google Sheet. It is not a general CRM and was never meant to be one: it does exactly the pipeline it was built for, and it refuses to be put into a state that pipeline cannot recover from.",
  problem:
    "Blast tools send a thousand identical emails and get a thousand identical non-replies. A mail client makes you pick the send time yourself, forty times a day, in the prospect's timezone, while remembering which mailbox already has a thread with them. The work that actually converts is writing one email to one business, and everything around that work was eating the day.",
  approach: [
    "The whole product is one screen. /write is three panes: the leads you have claimed, the composer, and everything worth knowing about the business you are writing to. You type, press Ctrl+Enter, and the next lead loads. You never choose a send time, because the app computes the prospect-local slot and queues it. That single omission is the difference between the tool and a mail client.",
    "Status is event-sourced. Nothing in the application writes a lead's status; a trigger recomputes it from an append-only event log, and a second trigger rejects direct writes to the protected columns, binding the service role as well as the app. Human judgment lives in a separate stage field that anyone can move in any direction, so the machine-derived truth and the salesperson's opinion never fight over one column.",
    "The send path is written on the assumption that the process will be killed mid-flight. A row is marked sending before Gmail is called, so a killed function leaves a visibly stuck row rather than one that quietly sends twice. Claiming takes a transaction-scoped advisory lock per mailbox, because a session-scoped one leaks on a pooled connection. The reaper fails stalled sends and never retries them. A dry-run flag gates the entire path.",
    "Scheduling runs on pg_cron rather than Vercel cron, because the dispatcher needs twelve invocations an hour and the Hobby plan allows one a day. The app is pinned to Vercel's Tokyo region to sit next to its Supabase project; running from Virginia added about 180ms per database call and made the composer take three seconds to advance.",
  ],
  decisions: [
    {
      claim: "Nothing writes a lead's status. A trigger derives it, and another trigger rejects the write.",
      why: "Status drift is how a spreadsheet-shaped CRM dies: two code paths disagree, someone patches one, and six months later nobody can say what 'contacted' means. Deriving status from an append-only event log makes it reproducible from history. Guarding the column at the database means a future script, a migration, or me at 1am cannot shortcut it.",
      tag: "correctness",
    },
    {
      claim: "A lead whose timezone cannot be resolved is refused by the database, not filtered by a query.",
      why: "Sending a cold email at 3am local is worse than not sending it. Coordinates decide the zone; single-zone states can fall back to the state; states that a timezone boundary runs through resolve only from a named city, or not at all. Making that a trigger rather than a WHERE clause means a bad import fails loudly at the door instead of leaking rows that quietly never send.",
      tag: "correctness",
    },
    {
      claim: "An email leaves from its own operator's mailbox, and a lead with any prior send is pinned to that mailbox forever.",
      why: "The obvious design routes to whichever mailbox has capacity. That breaks threading, because a Gmail thread id only exists inside the account that created it, so the follow-up starts a new conversation and reads like a different company. Capacity is the cheaper problem to solve.",
      tag: "correctness",
    },
    {
      claim: "The app asks Gmail for send and readonly scope, never modify.",
      why: "The same mailboxes are being warmed by another tool. Without modify scope this application is structurally incapable of touching that mail, so a bug in my reply-poller cannot damage the warmup. Choosing the narrower scope cost nothing and removed a whole category of incident.",
      tag: "trust",
    },
  ],
  metrics: [
    { value: "39", label: "migrations" },
    { value: "17", label: "tables" },
    { value: "41", label: "RLS policies" },
    { value: "180ms", label: "per-call latency removed by the region move" },
  ],
  stack: [
    { layer: "Framework", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"] },
    { layer: "Data", items: ["Supabase Postgres", "Row Level Security", "Triggers", "pg_cron", "Advisory locks"] },
    { layer: "Integrations", items: ["Gmail API", "Google OAuth", "Supabase Realtime", "Telegram", "ntfy"] },
    { layer: "UI", items: ["TanStack Table", "TanStack Virtual", "Zod v4", "Luxon"] },
    { layer: "Infra", items: ["Vercel (Tokyo)", "geo-tz"] },
    { layer: "Testing", items: ["Vitest", "Template lint parity tests"] },
  ],
  shots: [
    { src: write, alt: "The three-pane composer", device: "desktop", chrome: "crm.autoreceptionist.io/write", caption: "The composer. You write; the app decides when it goes out.", redacted: true },
    { src: leads, alt: "The virtualised lead grid", device: "desktop", chrome: "crm.autoreceptionist.io/leads", redacted: true },
    { src: queue, alt: "The scheduled send queue", device: "desktop", chrome: "crm.autoreceptionist.io/queue", redacted: true },
    { src: pipeline, alt: "The pipeline board", device: "desktop", chrome: "crm.autoreceptionist.io/pipeline", redacted: true },
    { src: contacts, alt: "The contacts directory", device: "desktop", chrome: "crm.autoreceptionist.io/contacts", caption: "Who a person is lives here; what the machine should do with them lives on Leads.", redacted: true },
  ],
  outcome:
    "In daily use and not publicly reachable, so there is no link to click here. It replaced the spreadsheet completely and has run the outbound pipeline since. Screenshots are from the live application with prospect data removed.",
};
