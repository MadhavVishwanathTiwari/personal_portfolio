/**
 * Produces the publishable copy of the internship certificate.
 *
 * The original carries a father's name and a full home address. Neither
 * belongs on a public site, and neither is what the certificate is being
 * shown for — the point is the issuer, the dates, the scope of work and the
 * verification number.
 *
 * The redaction is painted into a new PNG rather than layered in CSS: a CSS
 * overlay leaves the original bytes one "view source" away.
 *
 *   node scripts/redact-certificate.mjs
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "_incoming", "Internship_Certificate_Madhavendra_Tiwari-1.png");
const OUT_DIR = path.join(ROOT, "src", "assets", "credentials");
const OUT = path.join(OUT_DIR, "cannock-internship-certificate.png");

const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Source is 2339 x 1654. Work in percentages so a re-export at another size
// still lands correctly.
const W = 1400;
const H = Math.round((1654 / 2339) * W);

/** Bands to paint over, as percentages of the image box. */
const REDACTIONS = [
  // The "S/o <father's name>" line and the residential address directly
  // beneath the holder's name. The holder's own name stays: it is his site.
  { top: 43.9, left: 24, width: 52, height: 6.4 },
];

// Inlined rather than referenced: a headless page loaded via setContent has
// an about:blank origin and cannot read file:// URLs.
const dataUri =
  "data:image/png;base64," + (await readFile(SRC)).toString("base64");

const html = `<!doctype html><html><body style="margin:0">
<div style="position:relative;width:${W}px;height:${H}px;background:#0a0c0b">
  <img src="${dataUri}" style="width:100%;height:100%;display:block"/>
  ${REDACTIONS.map(
    (r) => `<div style="position:absolute;
      top:${r.top}%;left:${r.left}%;width:${r.width}%;height:${r.height}%;
      background:#141a33;
      display:flex;align-items:center;justify-content:center;
      color:#5f6d96;font:400 13px ui-monospace,monospace;
      letter-spacing:.14em;text-transform:uppercase">redacted</div>`,
  ).join("")}
</div></body></html>`;

await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--allow-file-access-from-files", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle0" });
await page.screenshot({ path: OUT, captureBeyondViewport: false });
await browser.close();

console.log(`wrote ${path.relative(ROOT, OUT)} (${W * 2} x ${H * 2})`);
