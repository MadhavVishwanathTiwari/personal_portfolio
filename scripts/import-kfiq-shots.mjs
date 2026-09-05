/**
 * One-off import of the KFIQ platform screenshots dropped in the repo root.
 *
 * Three things happen to each one:
 *
 *  1. The browser chrome is cropped off. Every shot already sits inside
 *     BrowserFrame on the case-study page, and a screenshot of a URL bar
 *     inside a drawn URL bar reads as a mistake.
 *  2. The Next dev-tools bubble in the bottom-right corner is painted over
 *     with the page's own background. It is an artifact of the dev build,
 *     not part of the product.
 *  3. JPEG becomes PNG at the project's standard width, so the whole asset
 *     pipeline (static import, blur placeholder, optimise pass) applies.
 *
 * Sources live in _incoming/, which is gitignored: they are the only
 * originals, and re-importing at a different crop later needs them. All the
 * data in them is the owner's own account or seeded test records.
 *
 *   node scripts/import-kfiq-shots.mjs
 */
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INCOMING = path.join(ROOT, "_incoming");
const OUT_DIR = path.join(ROOT, "src", "assets", "shots", "kfiq-platform");

/**
 * `chrome` is how many pixels of browser UI to take off the top. `right`
 * trims the scrollbar gutter. `badge` covers the dev-tools bubble.
 */
const IMPORTS = [
  // The first batch, already landed. Left here so a re-import reproduces the
  // whole set rather than half of it.
  { from: "img17.jpeg", to: "01-browse-desktop.png", chrome: 42, right: 8, badge: true },
  { from: "img4.jpeg", to: "02-tasks-desktop.png", chrome: 30, right: 14, badge: true },
  { from: "img12.jpeg", to: "03-submit-desktop.png", chrome: 0, right: 14, badge: true },
  { from: "img19.jpeg", to: "04-admin-applications-desktop.png", chrome: 40, right: 14, badge: true },
  { from: "img6.jpeg", to: "05-admin-submissions-desktop.png", chrome: 34, right: 8, badge: true },
  { from: "img8.jpeg", to: "06-certificates-desktop.png", chrome: 32, right: 14, badge: true },

  // The second batch. certverified is the one that matters: the public
  // verifier, on the real domain, showing a valid credential to someone with
  // no account.
  { from: "certverified.png", to: "07-verify-desktop.png", chrome: 92, right: 26, badge: true },
  { from: "importcsv3.jpeg", to: "08-import-desktop.png", chrome: 40, right: 14, badge: true },
  { from: "debugendpoint.png", to: "09-debug-desktop.png", chrome: 90, right: 22, badge: false },
  { from: "onboarding4.1.png", to: "10-onboarding-desktop.png", chrome: 96, right: 26, badge: true },
];

/** The apps are near-white; this matches their page background. */
const PAGE_BG = { r: 252, g: 252, b: 252 };
const BADGE = { width: 104, height: 52, marginRight: 0, marginBottom: 0 };

for (const item of IMPORTS) {
  const src = path.join(INCOMING, item.from);
  try {
    await access(src);
  } catch {
    console.log(`  skip ${item.from} (not found)`);
    continue;
  }

  const image = sharp(src);
  const { width = 0, height = 0 } = await image.metadata();

  const left = 0;
  const top = item.chrome;
  const w = width - left - (item.right ?? 0);
  const h = height - top - (item.bottom ?? 0);

  let pipeline = image.extract({ left, top, width: w, height: h });

  if (item.badge) {
    const cover = await sharp({
      create: {
        width: BADGE.width,
        height: BADGE.height,
        channels: 3,
        background: PAGE_BG,
      },
    })
      .png()
      .toBuffer();

    pipeline = sharp(await pipeline.png().toBuffer()).composite([
      {
        input: cover,
        left: w - BADGE.width - BADGE.marginRight,
        top: h - BADGE.height - BADGE.marginBottom,
      },
    ]);
  }

  const out = path.join(OUT_DIR, item.to);
  await pipeline.png({ palette: true, quality: 82, effort: 10 }).toFile(out);
  console.log(`  ${item.from} -> shots/kfiq/${item.to}  (${w}x${h})`);
}
