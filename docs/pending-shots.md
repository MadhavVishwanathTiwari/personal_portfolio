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

## Outreach Ops CRM — 4 shots

Prefer screens that are structurally interesting and data-light. Avoid
anything showing real prospect names, emails or phone numbers; if a screen
has to show rows, blur or replace them first. Each of these is already
marked `data redacted` in the case study.

| Path | What to capture |
| --- | --- |
| `src/assets/shots/outreach-ops-crm/01-write-desktop.png` | `/write` — the three-pane composer. This is the hero shot of the case study, so it matters most. |
| `src/assets/shots/outreach-ops-crm/02-leads-desktop.png` | `/leads` — the dense virtualised grid |
| `src/assets/shots/outreach-ops-crm/03-queue-desktop.png` | `/queue` — scheduled sends with their computed local times |
| `src/assets/shots/outreach-ops-crm/05-contacts-desktop.png` | `/contacts` — **type `example.com` into the search box first.** That box is a substring match over `work_email`, so it filters the directory down to exactly the seeded demo leads and nothing real. Unfiltered, this screen is 533 named individuals with employer and job title, which is the one screen in the app that must not be published as-is. `capture.mjs` does the filtering for you. |
| `src/assets/shots/outreach-ops-crm/04-pipeline-desktop.png` | `/pipeline` — the stage board. **The Prospect column holds real imported leads.** Drop the file, then run `node scripts/redact-region.mjs`, which pixelates that column. Every other column is the seeded `example.com` demo data and is safe as-is. |

## KFIQ intern platform — 1 shot

| Path | What to capture |
| --- | --- |
| `src/assets/shots/kfiq/06-intern-app-desktop.png` | `kfiq-interns.vercel.app` signed in — the intern dashboard or the task-group tree. A seeded demo account is better here than a real student. |

## Synapse — 3 shots

| Path | What to capture |
| --- | --- |
| `src/assets/shots/synapse/01-today-desktop.png` | `/today` — the fifteen-minute ledger, ideally on a day with visible planned/actual/unlogged variety |
| `src/assets/shots/synapse/02-goals-desktop.png` | `/goals/map` — the goal DAG |
| `src/assets/shots/synapse/03-dashboard-desktop.png` | `/dashboard` — the three adherence series over time |

Financial figures are personal. Either pick screens without them or blur the
amounts; the case study already declares these as redacted.

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
