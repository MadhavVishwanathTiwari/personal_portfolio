/**
 * Shrinks the screenshot sources in place.
 *
 * Two changes, neither of them visible on the site:
 *
 *  1. Cap the width at 2200px. The widest slot any shot renders into is about
 *     1100 CSS pixels, so 2200 is already 2x for a retina display and a
 *     2880px capture is carrying pixels nobody will ever see.
 *  2. Re-encode as a palette PNG *when the image is flat interface colour*.
 *     Screenshots quantise almost losslessly and it typically takes 80% off
 *     the file. Photographs do not: quantising to 256 colours is a lossy
 *     step, and next/image then encodes AVIF on top of it, so a photographic
 *     source would take two lossy generations where it shows most. Those
 *     keep full colour and only get the width cap.
 *
 * Nothing here changes what a visitor downloads. next.config.ts declares
 * AVIF and WebP, and next/image content-negotiates per request, so the PNGs
 * in this directory are build inputs and repo weight, never payload.
 *
 * Filenames and extensions are deliberately unchanged, so every import keeps
 * working and "drop a PNG over the placeholder" stays true.
 *
 *   node scripts/optimize-shots.mjs            optimise anything oversized
 *   node scripts/optimize-shots.mjs --dry-run  report only
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "src", "assets");

const MAX_WIDTH = 2200;

/**
 * Sources that are photographs rather than interface, listed rather than
 * detected. Detection was tried and does not work here: the test has to run
 * on the file as it stands, and a file that has already been through a
 * palette pass looks flat by construction, so the classifier agrees with
 * whatever the last run did. Six paths are cheaper to read than a heuristic
 * that is wrong in a way nobody notices.
 */
const PHOTOGRAPHIC = [
  "p4-realty",
  "priya-tripathi/01-hero",
  "priya-tripathi/05-hero",
  "priya-tripathi/06-webgl",
].map((p) => p.split("/").join(path.sep));
const DRY = process.argv.includes("--dry-run");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith(".png")) yield full;
  }
}

const mb = (n) => (n / 1048576).toFixed(2);
let before = 0;
let after = 0;

for await (const file of walk(ASSETS)) {
  const original = (await stat(file)).size;
  before += original;

  // Placeholders carry a marker chunk that placeholders.mjs looks for to
  // decide whether a file is safe to regenerate. Re-encoding would strip it
  // and make a placeholder look like a real capture, so leave them alone.
  const bytes = await readFile(file);
  if (bytes.includes("capture-pending")) {
    after += original;
    console.log(`  skip ${path.relative(ROOT, file)} (placeholder)`);
    continue;
  }

  // Re-encoding would strip the redaction marker too, and a later
  // redact-region run would then paint over an already-redacted file.
  if (bytes.includes("region-redacted")) {
    after += original;
    console.log(`  skip ${path.relative(ROOT, file)} (redacted)`);
    continue;
  }

  const image = sharp(file);
  const meta = await image.metadata();
  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);

  const photographic = PHOTOGRAPHIC.some((frag) => file.includes(frag));

  const out = await image
    .resize({ width, withoutEnlargement: true })
    .png(
      photographic
        ? { compressionLevel: 9, effort: 10 }
        : { palette: true, quality: 82, effort: 10 },
    )
    .toBuffer();

  // Never make a file bigger. A placeholder is already tiny and flat.
  if (out.length >= original) {
    after += original;
    console.log(`  skip ${path.relative(ROOT, file)} (${mb(original)} MB, already small)`);
    continue;
  }

  after += out.length;
  const pct = Math.round((1 - out.length / original) * 100);
  const mode = photographic ? "photo" : "flat";
  console.log(
    `  ${DRY ? "would" : "wrote"} ${path.relative(ROOT, file)}  ${mb(original)} -> ${mb(out.length)} MB  (-${pct}%, ${mode})`,
  );
  if (!DRY) await writeFile(file, out);
}

console.log(`\nTotal ${mb(before)} MB -> ${mb(after)} MB`);
