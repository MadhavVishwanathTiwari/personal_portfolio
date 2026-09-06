/**
 * One-off import of the Synapse captures and the profile photograph.
 *
 * The Synapse shots were taken against seeded acceptance data which was
 * deleted immediately afterwards, so nothing in them describes a real day.
 * The case study says so.
 *
 * Three of the four have no browser chrome to crop; the gym capture does.
 * The dev-tools bubble sits bottom-left in this app rather than bottom-right,
 * which is why the cover offset differs from import-kfiq-shots.
 *
 *   node scripts/import-synapse-shots.mjs
 */
import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INCOMING = path.join(ROOT, "_incoming");
const SHOTS = path.join(ROOT, "src", "assets", "shots", "synapse");
const ASSETS = path.join(ROOT, "src", "assets");

/**
 * Synapse is dark, so the bubble cover has to match its canvas rather than
 * white. Sampled from the sidebar rather than guessed: #0a0a0a read as a
 * black square against it.
 */
const PAGE_BG = { r: 32, g: 32, b: 32 };
const BUBBLE = { width: 92, height: 92, marginLeft: 0, marginBottom: 0 };

const IMPORTS = [
  { from: "synapse-dashboard.png", to: "01-dashboard-desktop.png", chrome: 0, right: 18 },
  { from: "synapse-week.png", to: "02-week-desktop.png", chrome: 0, right: 18 },
  { from: "synapse-goal-map.png", to: "03-goals-desktop.png", chrome: 0, right: 18 },
  { from: "synapse-gym2.png", to: "04-gym-desktop.png", chrome: 52, right: 22 },
];

await mkdir(SHOTS, { recursive: true });

for (const item of IMPORTS) {
  const src = path.join(INCOMING, item.from);
  try {
    await access(src);
  } catch {
    console.log(`  skip ${item.from} (not found)`);
    continue;
  }

  const base = sharp(src);
  const { width = 0, height = 0 } = await base.metadata();
  const w = width - item.right;
  const h = height - item.chrome;

  const cover = await sharp({
    create: {
      width: BUBBLE.width,
      height: BUBBLE.height,
      channels: 3,
      background: PAGE_BG,
    },
  })
    .png()
    .toBuffer();

  const cropped = await base
    .extract({ left: 0, top: item.chrome, width: w, height: h })
    .png()
    .toBuffer();

  await sharp(cropped)
    .composite([
      { input: cover, left: BUBBLE.marginLeft, top: h - BUBBLE.height - BUBBLE.marginBottom },
    ])
    .png({ palette: true, quality: 82, effort: 10 })
    .toFile(path.join(SHOTS, item.to));

  console.log(`  ${item.from} -> shots/synapse/${item.to}  (${w}x${h})`);
}

// The portrait. Left as a JPEG: it is a photograph, and next/image
// re-encodes it to AVIF or WebP per request anyway, so a lossless source
// would only cost repo weight. 640px is twice the largest slot it renders in.
const portrait = path.join(INCOMING, "profile-picture.jpg");
try {
  await access(portrait);
  await sharp(portrait)
    .resize({ width: 640, height: 640, fit: "cover" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ASSETS, "portrait.jpg"));
  console.log("  profile-picture.jpg -> assets/portrait.jpg  (640x640)");
} catch {
  console.log("  skip portrait (not found)");
}
