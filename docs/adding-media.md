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
import contacts from "@/assets/shots/outreach-ops-crm/02-contacts-desktop.png";

// …inside shots: []
{
  src: contacts,
  alt: "The contacts directory",
  device: "desktop",
  chrome: "crm.autoreceptionist.io/contacts",
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

**Format.** Always drop a PNG. It is not what gets served: `next.config.ts`
declares `formats: ["image/avif", "image/webp"]`, and `next/image`
content-negotiates per request, so a visitor gets AVIF where the browser
takes it and WebP otherwise. The PNG is a build input and repo weight, never
payload — which is why the source format question is about not losing
information rather than about bytes on the wire.

`optimize-shots.mjs` caps width at 2200 and re-encodes. Interface screenshots
become palette PNGs, which is lossy in principle and invisible in practice on
flat colour. Photographs are listed explicitly in that script's
`PHOTOGRAPHIC` array and keep full colour instead, because quantising to 256
colours and *then* encoding AVIF stacks two lossy generations exactly where
banding shows. Add to that list when you add a photographic source.

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

ffmpeg is installed on this machine. Two commands cover it:

```bash
# H.264, capped at 1440 wide, yuv420p so every browser decodes it.
# faststart moves the index to the front so playback starts before the
# download finishes — without it a visitor waits for the whole file.
ffmpeg -i raw.mov -vf "scale=1440:-2" -c:v libx264 -crf 23 -preset slow   -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/media/walkthrough.mp4

# A poster frame, so the player is not a black rectangle before play.
ffmpeg -i public/media/walkthrough.mp4 -ss 00:00:02 -frames:v 1   src/assets/shots/<slug>/poster.png
```

`-crf 23` is the quality dial: lower is better and bigger, 18 is close to
visually lossless, 28 starts to show. Check the output size before committing;
if it is over 8 MB, shorten the clip rather than raising the CRF.

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
