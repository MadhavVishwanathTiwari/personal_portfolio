# Screenshots still to capture

Every file below currently renders a dark **CAPTURE PENDING** placeholder on
the live site. Replace the file at the exact path and the site picks it up on
the next build — no code change, no import to add.

**Format for all of them:** PNG, viewport capture (not full-page),
**2880 x 1800** (a 1440 x 900 viewport at 2x). Anything close to 16:10 works;
the frame crops from the top.

## Two ways to produce them

**Scripted (preferred).** One command, one browser session:

```bash
node scripts/capture.mjs --gated
```

A visible Chrome window opens with a tab per app. Sign in to each one, come
back to the terminal and press Enter, and it captures everything in that
same session. Signing in and capturing have to happen in one session —
signing in with one browser and capturing with another does not reliably
carry the session, which is exactly how a batch of login screens once got
written over these placeholders.

Nothing is written unless the page passes an auth check first: a capture
that lands on a login route, an identity provider, a page reading as a
sign-in screen, or a near-empty body is skipped with a reason and leaves
the placeholder alone.

Synapse targets point at `http://localhost:3002`, so start that app first if
you want those. If it is not running those three are skipped and everything
else still works.

Afterwards:

```bash
node scripts/redact-region.mjs && node scripts/optimize-shots.mjs
```

**By hand.** Take the screenshot yourself and save it over the placeholder at
the path listed below. The filename must match exactly.

---

## Outreach Ops CRM — done

Both shots are in: `01-pipeline-desktop.png` and `02-contacts-desktop.png`.
The pipeline board's Prospect column is pixelated by
`scripts/redact-region.mjs` because those rows are real businesses; every
other column is the seeded `example.com` demo data. The contacts capture was
taken against seeded records, so nothing on it is real and it needs no
redaction.

The case study deliberately shows only these two. `/write`, `/leads` and
`/queue` were dropped: two screens that carry the argument beat five that
repeat it.

## KFIQ Platform — one left

Nine shots are in, including the public certificate verifier, the CSV
curriculum import preview and the in-app debug overlay. One slot is still a
placeholder:

| Path | What to capture |
| --- | --- |
| `src/assets/shots/kfiq-platform/10-onboarding-desktop.png` | The four-step onboarding with the **parsed resume on screen**. Nothing in the set shows SharpAPI actually doing its job, and it is the only third-party integration here doing something non-trivial. Use the seeded `Test Intern` rather than a real student. |

Sources for the imported nine live in `_incoming/` and are re-runnable with
`node scripts/import-kfiq-shots.mjs`, which crops browser chrome and paints
out the dev-tools bubble.

**Not used from the batch, and why:** `linktaskgrptocohort.jpeg` carries a
hand-drawn annotation circle; `linktaskgrptocohort2.jpeg` is a partial crop;
`importcsv`, `importcsv2`, `confirmimport` and `importcomplete` are earlier
steps of the flow `importcsv3` already tells; `viewcert` and
`certificategenerated` duplicate the certificates shot.

## Synapse — capture, then delete the data

Synapse had no goals, no ledger and no training history, so there was nothing
to photograph. Its own seed scripts fill exactly that gap:

```bash
cd D:\Portfolio\synapse
npm run seed:goals && npm run seed:day && npm run seed:gym   # already run
npm run dev                                                   # already running on :3002
node scripts/capture-for-portfolio.mjs                        # you sign in, it shoots
node --env-file=.env.local scripts/teardown-seed.mjs          # removes the seed
```

`capture-for-portfolio.mjs` opens a visible window, waits at the terminal
while you sign in, and captures `/today`, `/goals/map`, `/dashboard` and
`/gym` in that same session. It refuses to write a file for any page that
still reads as signed out, so a failed login leaves the placeholders alone.

**`npm run wipe` is the wrong tool here and must not be used.** It empties
the account's whole history, which on this database also means the 2,499
rows in `nudge_evaluations` — real logged decisions, and the source of the
numbers this case study quotes — plus `calendar_accounts`, which holds the
live Google connection. `teardown-seed.mjs` deletes only the seven tables
the seeds filled, all verified empty beforehand, and prints the preserved
counts afterwards so you can see they came through.

Baseline before seeding, for reference:

| table | rows |
| --- | --- |
| nudge_evaluations | 2499 |
| nudge_deliveries | 20 |
| categories | 10 |
| exercises | 10 |
| nudge_rules | 7 |
| calendar_accounts | 1 |
| profiles | 1 |
| everything else | 0 |

## ICU Outcome Prediction — 2 shots

| Path | What to capture |
| --- | --- |
| `src/assets/shots/icu-outcome-prediction/01-dashboard-desktop.png` | The Streamlit dashboard, per-target metrics view |
| `src/assets/shots/icu-outcome-prediction/02-shap-desktop.png` | A SHAP attribution plot |

If the Streamlit app no longer runs, exporting the two plots as images at
2880 x 1800 on a white background is fine — the browser frame around them
does the rest. Do not ship a screenshot containing patient-level rows.

---

## Already captured

These came from the live sites and need nothing:

`autoreceptionist` (4) · `priya-tripathi` (6, including the WebGL pitch build)
· `kfiq` (5 public) · `p4-realty` (4).

Re-run `node scripts/capture.mjs` any time one of those sites changes.
