export interface Principle {
  title: string;
  body: string;
  /** The project that proves it. Must match a slug in data/projects. */
  evidenceSlug: string;
  evidenceLabel: string;
}

/**
 * The section that separates this site from a card grid. Each principle is
 * a claim, and each claim names the shipped system that backs it.
 */
export const principles: Principle[] = [
  {
    title: "Put the rule in the database, not the form",
    body: "A validation in a React component is a suggestion. On the consultancy site a testimonial cannot be published unless written permission was recorded, because that is a CHECK constraint. Draft posts are invisible to the public key because RLS hides them, so a forgotten WHERE clause cannot leak one. The app is then free to be wrong without being dangerous.",
    evidenceSlug: "priya-tripathi",
    evidenceLabel: "Priya S. Tripathi",
  },
  {
    title: "Make the wrong state impossible to reach",
    body: "In the outbound CRM nothing writes a lead's status; a trigger recomputes it from an append-only event log, and a second trigger rejects direct writes even from the service role. A lead whose timezone cannot be resolved is refused by the database, not filtered out by a query. Correctness you can bypass is a convention, not a guarantee.",
    evidenceSlug: "outreach-ops-crm",
    evidenceLabel: "Outreach Ops",
  },
  {
    title: "An AI feature needs a way to be caught lying",
    body: "The demo generator will only publish a fact it can quote verbatim from the client's own website; anything else degrades to a line saying the team will confirm. At runtime, if the agent claims it booked an appointment and the trace shows no calendar tool ran, the turn is thrown away and re-rolled. Generated output is not trusted just because it reads well.",
    evidenceSlug: "autoreceptionist",
    evidenceLabel: "AutoReceptionist",
  },
  {
    title: "Define every number exactly once",
    body: "In Synapse every metric is a Postgres view, read by both the dashboard and the Telegram bot, so the two can never disagree about the same day. Money is stored in integer paise and an ESLint rule bans parseFloat from the finance paths. The data export is built from the pg_class catalogue, so adding a table with no verdict makes the export refuse rather than quietly skip it.",
    evidenceSlug: "synapse",
    evidenceLabel: "Synapse",
  },
];
