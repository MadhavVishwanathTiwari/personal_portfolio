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

## KFIQ — done

Nine shots: two from the marketing site, six from the platform, one mobile.
The platform set came from the test deployment (`kfiq-test.vercel.app`)
against seeded records and the owner's own account, imported and de-chromed
by `scripts/import-kfiq-shots.mjs`. Browser chrome is cropped off because
every shot already sits inside a drawn `BrowserFrame`, and the Next
dev-tools bubble is painted out.

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
