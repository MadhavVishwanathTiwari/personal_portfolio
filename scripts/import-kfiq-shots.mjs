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
 * Sources are 1600px wide screenshots of the test deployment. All the data
 * in them is the owner's own account or seeded test records.
 *
 *   node scripts/import-kfiq-shots.mjs
 */
import { access, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "src", "assets", "shots", "kfiq");

/**
 * `chrome` is how many pixels of browser UI to take off the top. `right`
 * trims the scrollbar gutter. `badge` covers the dev-tools bubble.
 */
const IMPORTS = [
  { from: "img17.jpeg", to: "06-browse-desktop.png", chrome: 42, right: 8, badge: true },
  { from: "img4.jpeg", to: "07-tasks-desktop.png", chrome: 30, right: 14, badge: true },
  { from: "img12.jpeg", to: "08-submit-desktop.png", chrome: 0, right: 14, badge: true },
  { from: "img19.jpeg", to: "09-admin-applications-desktop.png", chrome: 40, right: 14, badge: true },
  { from: "img6.jpeg", to: "10-admin-submissions-desktop.png", chrome: 34, right: 8, badge: true },
  { from: "img8.jpeg", to: "11-certificates-desktop.png", chrome: 32, right: 14, badge: true },
];

/** The apps are near-white; this matches their page background. */
const PAGE_BG = { r: 252, g: 252, b: 252 };
const BADGE = { width: 104, height: 52, marginRight: 0, marginBottom: 0 };

for (const item of IMPORTS) {
  const src = path.join(ROOT, item.from);
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

// The placeholder this set replaces.
const stale = path.join(OUT_DIR, "06-intern-app-desktop.png");
try {
  await access(stale);
  await unlink(stale);
  console.log("  removed the 06-intern-app placeholder");
} catch {
  /* already gone */
}
