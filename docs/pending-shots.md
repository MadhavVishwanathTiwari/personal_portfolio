# Screenshots

**Nothing is outstanding.** Every case study on the site carries real
captures; there are no `CAPTURE PENDING` placeholders left.

This file is kept as the record of how each set was produced and what was
redacted, because those are the decisions a future capture has to repeat.

## How captures are produced

```bash
node scripts/capture.mjs             # every public target
node scripts/capture.mjs --gated     # opens a window, waits for you to sign
                                     # in, then captures in the same session
node scripts/redact-region.mjs       # applies the redactions below
node scripts/optimize-shots.mjs      # width cap and re-encode
```

Gated captures are guarded: a page that lands on a login route, an identity
provider, or anything reading as a sign-in screen is skipped with a reason
and leaves its file alone. A capture that silently succeeds on a login page
is worse than a failure, because it writes a plausible file and reports
success — which is exactly what happened once before the guard existed.

Desktop is 1440 x 900 at 2x, mobile 390 x 844 at 2x, viewport captures only.
Sources live in `_incoming/`, which is gitignored: they are the only
originals, and re-importing at a different crop later needs them.

## What is redacted, and why

Configured in `scripts/redact-region.mjs`. The redaction is painted into the
PNG by downscaling and scaling back up, so the pixels holding the text stop
existing rather than being covered by something recoverable.

| Shot | Redacted | Why |
| --- | --- | --- |
| `outreach-ops-crm/01-pipeline` | The Prospect column | Real businesses currently being cold-emailed. Every other column is the seeded `example.com` demo data from migration 0037 and is safe as-is. |
| `synapse/03-goals` | One goal label | A private goal of the owner's, not third-party data. Delete the entry to show it. |

Two more captures avoid the problem instead of redacting it. The CRM
contacts directory is captured with `example.com` typed into its search box,
which filters it to seeded records only — unfiltered it is 533 real people
by name, employer and title, and is the one screen in that app that must
never be published. The KFIQ platform shots come from the test deployment
against seeded records and the owner's own account.

## Per-project imports

| Project | Source | Notes |
| --- | --- | --- |
| KFIQ site, P4 Realty, Priya, AutoReceptionist | `scripts/capture.mjs` | Public sites, captured live |
| KFIQ platform | `scripts/import-kfiq-shots.mjs` | Crops browser chrome, paints out the dev-tools bubble |
| Synapse | `scripts/import-synapse-shots.mjs` | Same, plus the portrait. Bubble sits bottom-left here and the cover colour is sampled from the sidebar |
| ICU | `scripts/import-icu-shots.mjs` | Pipeline figures copied from `results/`; the manuscript rendered from its .docx |

