/**
 * One-off import of the ICU project's own artifacts.
 *
 * Three of the four are copied straight out of the project's `results/`
 * directory: they are the figures the pipeline produced, not illustrations
 * of it.
 *
 * The fourth is the first page of the IEEE-format manuscript. There is no
 * Word or LibreOffice on this machine to produce a PDF, so the .docx is
 * converted to HTML with mammoth and laid out in two columns by a headless
 * browser. Every word and every figure is the submitted document's own; the
 * typesetting is this script's. The case-study caption says so, because a
 * rendering presented as a published PDF would be a small lie about a real
 * piece of work.
 *
 *   node scripts/import-icu-shots.mjs
 */
import { mkdir, access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mammoth from "mammoth";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "assets", "shots", "icu-outcome-prediction");
const PROJECT = "D:/College/MinorProject";
const DOCS = "D:/College/MinorProjectDocs";
const DOCX = path.join(DOCS, "ICU_Outcome_Prediction_IEEE_Fixed (1) (1).docx");

const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

await mkdir(OUT, { recursive: true });

/** Figures produced by the pipeline, copied at the project's standard width. */
const FIGURES = [
  {
    from: path.join(PROJECT, "results/roc_curves_tuned/roc_tuned_mortality.png"),
    to: "02-roc-mortality-desktop.png",
  },
  {
    from: path.join(PROJECT, "results/shap/mortality_beeswarm.png"),
    to: "03-shap-mortality-desktop.png",
  },
  {
    from: path.join(DOCS, "mimic_iv_pipeline_phases_1_to_3.png"),
    to: "04-pipeline-desktop.png",
  },
];

for (const fig of FIGURES) {
  try {
    await access(fig.from);
  } catch {
    console.log(`  skip ${fig.to} (source missing)`);
    continue;
  }
  const out = path.join(OUT, fig.to);
  await sharp(fig.from)
    .resize({ width: 2200, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .png({ palette: true, quality: 82, effort: 10 })
    .toFile(out);
  console.log(`  ${path.basename(fig.from)} -> ${fig.to}`);
}

// ── The manuscript's first page ──────────────────────────────────────────
const { value: body } = await mammoth.convertToHtml(
  { buffer: await readFile(DOCX) },
  {
    convertImage: mammoth.images.imgElement(async (image) => {
      const buf = await image.read("base64");
      return { src: `data:${image.contentType};base64,${buf}` };
    }),
  },
);

const page1 = `<!doctype html><html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background: #fff; }
  .page {
    width: 1240px; height: 1600px; overflow: hidden;
    padding: 64px 72px; background: #fff; color: #111;
    font-family: 'Source Serif 4', Georgia, serif; font-size: 15px; line-height: 1.42;
  }
  /* column-fill:auto fills column one to the page height before starting
     column two, which is what a paper does. overflow:hidden clips the third
     column the overflow would otherwise start in the right margin. */
  .cols { column-count: 2; column-gap: 34px; column-fill: auto;
          height: 100%; overflow: hidden; }
  h1 { column-span: all; font-size: 30px; line-height: 1.2; text-align: center;
       font-weight: 700; margin: 0 0 18px; }
  h2 { font-size: 15px; font-weight: 700; margin: 16px 0 6px;
       text-transform: uppercase; letter-spacing: .04em; }
  h3 { font-size: 15px; font-weight: 600; font-style: italic; margin: 12px 0 4px; }
  p { margin: 0 0 9px; text-align: justify; hyphens: auto; }
  /* The first paragraphs are the author block and the supervisor line. */
  .cols > p:nth-of-type(1), .cols > p:nth-of-type(2), .cols > p:nth-of-type(3) {
    column-span: all; text-align: center; margin-bottom: 4px;
  }
  .cols > p:nth-of-type(1) { font-size: 16px; }
  .cols > p:nth-of-type(3) { margin-bottom: 22px; }
  img, table { max-width: 100%; }
  table { border-collapse: collapse; font-size: 12px; }
  td, th { border: 1px solid #bbb; padding: 3px 5px; }
</style></head><body><div class="page"><div class="cols">${body}</div></div></body></html>`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1240, height: 1600, deviceScaleFactor: 2 });
await page.setContent(page1, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({
  path: path.join(OUT, "01-paper-desktop.png"),
  captureBeyondViewport: false,
});
await browser.close();

console.log("  manuscript -> 01-paper-desktop.png");
