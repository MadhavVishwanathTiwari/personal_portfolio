/**
 * Destroys regions of a screenshot that carry information which should not
 * be published.
 *
 * The redaction is real, not cosmetic. Each region is downscaled to a
 * fraction of its size and scaled back up before being composited over the
 * original, so the pixels that held the text no longer exist in the file. A
 * CSS overlay or a low-sigma blur would both leave the original recoverable.
 *
 * Regions are percentages of the image box, so a re-capture at a different
 * viewport size still lands correctly.
 *
 *   node scripts/redact-region.mjs            apply anything outstanding
 *   node scripts/redact-region.mjs --force    re-apply to an already-redacted file
 */
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "src", "assets");
const MARKER = "region-redacted";
const FORCE = process.argv.includes("--force");

/**
 * Keyed by path under src/assets. `mode` is "pixelate" (default) or "block".
 * `note` is why, and exists so a future reader does not undo it by accident.
 */
const REDACTIONS = {
  "shots/outreach-ops-crm/01-pipeline-desktop.png": [
    {
      // The Prospect column holds real imported businesses that are being
      // cold-emailed. Every other column on that board is the seeded demo
      // data on example.com and is safe to publish as-is.
      note: "Prospect column: real imported leads",
      top: 14.2,
      left: 0.4,
      width: 12.4,
      height: 85.5,
      mode: "pixelate",
    },
  ],

};

const pct = (value, total) => Math.round((value / 100) * total);

async function redact(relative, regions) {
  const file = path.join(ASSETS, relative);

  try {
    await stat(file);
  } catch {
    console.log(`  skip ${relative} (not on disk yet)`);
    return;
  }

  const buf = await readFile(file);
  if (buf.includes(MARKER) && !FORCE) {
    console.log(`  skip ${relative} (already redacted)`);
    return;
  }
  if (buf.includes("capture-pending")) {
    console.log(`  skip ${relative} (still a placeholder)`);
    return;
  }

  const base = sharp(buf);
  const { width = 0, height = 0 } = await base.metadata();

  const overlays = [];
  for (const r of regions) {
    const left = pct(r.left, width);
    const top = pct(r.top, height);
    const w = pct(r.width, width);
    const h = pct(r.height, height);

    if (r.mode === "block") {
      overlays.push({
        input: {
          create: { width: w, height: h, channels: 3, background: "#141a1c" },
        },
        left,
        top,
      });
      continue;
    }

    // Pixelate: crop, crush to a fraction of the size, scale back with
    // nearest-neighbour. The original pixels are gone, not hidden.
    const patch = await sharp(buf)
      .extract({ left, top, width: w, height: h })
      .resize({ width: Math.max(2, Math.round(w / 22)), kernel: "cubic" })
      .resize({ width: w, height: h, kernel: "nearest" })
      .blur(6)
      .toBuffer();

    overlays.push({ input: patch, left, top });
  }

  const out = await base.composite(overlays).png({ palette: true, quality: 82 }).toBuffer();
  await writeFile(file, Buffer.concat([out, Buffer.from(MARKER)]));
  console.log(`  redacted ${relative} — ${regions.map((r) => r.note).join("; ")}`);
}

for (const [relative, regions] of Object.entries(REDACTIONS)) {
  await redact(relative, regions);
}
