/**
 * Shrinks the screenshot sources in place.
 *
 * Two changes, neither of them visible on the site:
 *
 *  1. Cap the width at 2200px. The widest slot any shot renders into is about
 *     1100 CSS pixels, so 2200 is already 2x for a retina display and a
 *     2880px capture is carrying pixels nobody will ever see.
 *  2. Re-encode as a palette PNG. Screenshots are mostly flat interface
 *     colour, which quantises almost losslessly, and it typically takes 80%
 *     off the file.
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

  const out = await image
    .resize({ width: Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
    .png({ palette: true, quality: 82, effort: 10 })
    .toBuffer();

  // Never make a file bigger. A placeholder is already tiny and flat.
  if (out.length >= original) {
    after += original;
    console.log(`  skip ${path.relative(ROOT, file)} (${mb(original)} MB, already small)`);
    continue;
  }

  after += out.length;
  const pct = Math.round((1 - out.length / original) * 100);
  console.log(
    `  ${DRY ? "would" : "wrote"} ${path.relative(ROOT, file)}  ${mb(original)} -> ${mb(out.length)} MB  (-${pct}%)`,
  );
  if (!DRY) await writeFile(file, out);
}

console.log(`\nTotal ${mb(before)} MB -> ${mb(after)} MB`);
