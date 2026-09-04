/**
 * Generates stand-in images for screenshots that need a signed-in session.
 *
 * Each placeholder is written at the exact path and pixel size the real
 * capture will have, so replacing one is a file drop with no code change.
 * Re-running this overwrites ONLY files that are still placeholders (it
 * checks for the marker chunk), so a real screenshot is never clobbered.
 */
import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHOTS = path.join(ROOT, "src", "assets", "shots");
const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const PENDING = [
  { project: "synapse", file: "01-today-desktop.png", label: "/today — the fifteen-minute ledger" },
  { project: "synapse", file: "02-goals-desktop.png", label: "/goals/map — the goal DAG" },
  { project: "synapse", file: "03-dashboard-desktop.png", label: "/dashboard — adherence over time" },
  { project: "icu-outcome-prediction", file: "01-dashboard-desktop.png", label: "Streamlit — per-target metrics" },
  { project: "icu-outcome-prediction", file: "02-shap-desktop.png", label: "SHAP — feature attributions" },
];

const html = (label, file) => `<!doctype html><html><body style="margin:0">
<div style="width:1440px;height:900px;background:#101312;color:#7a8880;
  font:400 15px ui-monospace,monospace;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:18px;
  background-image:linear-gradient(rgba(232,236,233,.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(232,236,233,.03) 1px,transparent 1px);
  background-size:48px 48px">
  <div style="letter-spacing:.14em;font-size:11px;color:#8fae37">CAPTURE PENDING</div>
  <div style="font-size:19px;color:#9aa39d">${label}</div>
  <div style="font-size:12px">${file}</div>
</div></body></html>`;

async function isPlaceholder(p) {
  try {
    await access(p);
  } catch {
    return true; // absent counts as replaceable
  }
  const buf = await readFile(p);
  return buf.includes(Buffer.from("capture-pending"));
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "shell" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

for (const { project, file, label } of PENDING) {
  const dir = path.join(SHOTS, project);
  await mkdir(dir, { recursive: true });
  const out = path.join(dir, file);
  if (!(await isPlaceholder(out))) {
    console.log(`  keep ${project}/${file} (real capture)`);
    continue;
  }
  await page.setContent(html(label, file), { waitUntil: "load" });
  const png = await page.screenshot({ captureBeyondViewport: false });
  // Marker so a re-run can tell a placeholder from a real screenshot.
  await writeFile(out, Buffer.concat([png, Buffer.from("capture-pending")]));
  console.log(`  made ${project}/${file}`);
}

await browser.close();
