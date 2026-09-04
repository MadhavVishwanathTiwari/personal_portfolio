# Adding images and videos

Two places, two rules. Nothing else in the codebase needs to change to swap a
picture.

## Screenshots

Live in `src/assets/shots/<project-slug>/`, named `NN-<subject>-<device>.png`.
Inside `src`, not `public`, so a static import gives Next the intrinsic size
and a blur placeholder — which is the entire reason nothing on this site
reflows while images load.

**Replacing a placeholder.** Save the file over the existing path. The
filename must match exactly. No import to add, no data file to edit. See
`docs/pending-shots.md` for the ten still outstanding.

**Adding a new one.** Drop the file in, then add two lines to that project's
file in `src/data/projects/`:

```ts
import queue from "@/assets/shots/outreach-ops-crm/03-queue-desktop.png";

// …inside shots: []
{
  src: queue,
  alt: "The scheduled send queue",
  device: "desktop",
  chrome: "crm.autoreceptionist.io/queue",
  caption: "Optional. One sentence, and only if it adds something.",
  redacted: true, // set when data has been blurred or replaced
},
```

`device` picks the aspect box: `desktop` renders 16:10, `mobile` renders
390:844 and pairs up with other mobile shots in a row. `chrome` is the URL
printed in the frame's title bar.

**Sizes.** Desktop 2880 × 1800 (a 1440 × 900 viewport at 2x). Mobile
780 × 1688 (390 × 844 at 2x). Viewport captures, never full-page — a
6000px-tall image destroys the page rhythm.

**Redaction.** Anything with real names, emails, phone numbers or personal
finances gets blurred or replaced *in the file*, not with a CSS overlay: an
overlay leaves the original one "view source" away. Then set
`redacted: true` so the caption says so. `scripts/redact-certificate.mjs` is
a worked example of painting a redaction band into a new PNG.

## Videos

Each project takes at most one, rendered above "How it works" in the same
browser frame the screenshots use.

**Loom** — the preferred option, because nothing ships in the bundle:

```ts
video: {
  kind: "loom",
  src: "c2651aff76e744a2979787e8693a42b1", // the share id, not the full URL
  title: "The AutoReceptionist demo agent taking a call",
  chrome: "autoreceptionist.io / live demo",
  caption: "One sentence on what the viewer is about to watch.",
},
```

The share id is the last path segment of a `loom.com/share/<id>` URL.

**A local file** — put the mp4 in `public/media/` and reference it by path:

```ts
video: {
  kind: "file",
  src: "/media/outreach-write-flow.mp4",
  title: "Writing and queueing an email",
  chrome: "crm.autoreceptionist.io/write",
},
```

Keep local files under about 8 MB and encode as H.264 mp4 at 1440 × 900 or
1920 × 1080. Anything longer than roughly ninety seconds belongs on Loom
instead — a visitor will not watch it, and it will be the heaviest thing on
the page.

The player has no autoplay and no poster frame by design: a case study page
that starts making noise is a page people close.

## Credentials

At most one per project, and only where a third party signed the claim.

```ts
credential: {
  image: certificate,
  alt: "…",
  title: "…",
  issuer: "Cannock Private Limited, 13 August 2026",
  note: "Two or three sentences on why it is here.",
  reference: "CPL-INT-2026-011 / verifiable at cannock.in",
},
```

Certificates routinely carry home addresses and family names. Redact before
committing, and keep the unredacted original out of git — the `.gitignore`
already excludes `Internship_Certificate_*.png` for that reason.

## After any change

```bash
npm run typecheck && npm run build
```

The build fails loudly if an import path is wrong, which is the point of
keeping images inside `src`.
