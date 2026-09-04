# Portfolio

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion.
Fully static, no database, deployed on Vercel.

```bash
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
npm run build
```

Set `NEXT_PUBLIC_SITE_URL` in the Vercel project once a real domain is
attached. Everything canonical, OG and sitemap-related reads from
`src/lib/seo.ts`.

## Content

Everything on the site comes from `src/data/`. There is no CMS and no
component holds copy.

| File | What it holds |
| --- | --- |
| `data/profile.ts` | Name, contact, booking link, availability, bio |
| `data/principles.ts` | The four "How I work" tenets and the project each cites |
| `data/capabilities.ts` | The stack matrix |
| `data/projects/*.ts` | One file per project |
| `data/projects/index.ts` | The barrel. A project is not on the site until it is here |

### Adding a project

1. Copy an existing file in `src/data/projects/`.
2. Set `featured: true` for a full case study, `false` for a small card.
3. Add it to the array in `data/projects/index.ts`.

A featured project **cannot compile** without a `problem`, at least three
`decisions`, and at least one screenshot. That is deliberate: it is what lets
`app/work/[slug]/page.tsx` render every case study with no conditional
sections. If `npm run typecheck` complains, the project is genuinely
incomplete.

## Screenshots

Images live in `src/assets/shots/<slug>/`, named `NN-<subject>-<device>.png`.
They are inside `src`, not `public`, so a static import gives Next the
intrinsic size and a blur placeholder, which is the whole layout-shift story.

Captures are viewport-sized, never full-page: desktop 1440x900 at DPR 2,
mobile 390x844 at DPR 2.

```bash
node scripts/capture.mjs             # every public target
node scripts/capture.mjs kfiq        # one project
node scripts/capture.mjs --login     # sign in once, session kept in .capture-profile/
node scripts/capture.mjs --gated     # the logged-in targets
```

Targets are declared at the top of `scripts/capture.mjs`. Sections below the
fold are reached by CSS selector (`anchor`), never by a pixel offset, because
a pixel offset silently rots the moment the target site changes.

After adding captures, shrink them:

```bash
node scripts/optimize-shots.mjs           # caps width at 2200, palette PNG
node scripts/optimize-shots.mjs --dry-run
```

Filenames never change, so imports keep working. It skips placeholders (they
carry a marker chunk) and refuses to make any file larger.

### Placeholders

`scripts/placeholders.mjs` generates a stand-in image at the exact path and
pixel size a pending capture will have, so replacing one is a file drop with
no code change. Re-running it never overwrites a real screenshot: it checks
for a marker appended to the placeholder file.

Any image currently reading **CAPTURE PENDING** on the site is one of these.
See `docs/pending-shots.md` for the list.

## Videos and credentials

`docs/adding-media.md` covers both: Loom embeds by share id, local mp4s from
`public/media/`, and the redaction rule for anything carrying personal data.
`scripts/redact-certificate.mjs` paints the redaction into a new PNG rather
than layering it in CSS, because a CSS overlay leaves the original one
"view source" away.

## Claims

Nothing on this site states a number it cannot support.
`docs/icu-sota-verification.md` is the worked example: a CV claim about
beating the state of the art was checked against all twelve targets and the
literature, did not hold, and is therefore not on the site. If you add a
metric, be able to point at where it comes from.

## Design system

Tokens are in the `@theme` block of `src/app/globals.css`. Cool green-black
canvas, one volt accent, and a monospace that does real work: kickers, status
labels, metric values, stack chips, browser-frame URLs, decision numbers.

Rules worth keeping:

- Volt appears at most twice per viewport.
- Cards are `bg-panel` with a hairline border and no shadow.
- Radii are 4px everywhere except chips.
- Uppercase mono labels use the `mono-label` utility, never ad-hoc sizes.
- No `<img>` anywhere in `src/` — `ShotFigure` owns image rendering.
