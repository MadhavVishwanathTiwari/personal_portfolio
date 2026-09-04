/**
 * Screenshot capture for the case studies.
 *
 * Two modes, because half the systems in this portfolio sit behind a login:
 *
 *   node scripts/capture.mjs              capture every public target
 *   node scripts/capture.mjs kfiq         capture one project's targets
 *   node scripts/capture.mjs --login      open a visible browser so you can
 *                                         sign in; the session is kept in
 *                                         .capture-profile/ for later runs
 *   node scripts/capture.mjs --gated      capture the logged-in targets using
 *                                         that saved session
 *
 * Captures are viewport-sized, never full-page: a 6000px-tall image destroys
 * the layout rhythm on the case-study page. Sections below the fold are
 * reached by `anchor` (a selector), never by a pixel offset, because a pixel
 * offset silently rots the moment the target site changes.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHOTS = path.join(ROOT, "src", "assets", "shots");
const PROFILE = path.join(ROOT, ".capture-profile");

const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };
const MOBILE = {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

const AR = "https://autoreceptionist.io/";
const PRIYA = "https://www.priyastripathi.co.in/";
const KFIQ = "https://kfiq.com/";
const P4 = "https://p4-reality-demo.vercel.app/";

const TARGETS = [
  // ── Public ───────────────────────────────────────────────────
  { project: "autoreceptionist", name: "01-hero", url: AR, viewport: DESKTOP },
  { project: "autoreceptionist", name: "02-roi", url: AR, viewport: DESKTOP, anchor: "#roi" },
  { project: "autoreceptionist", name: "03-features", url: AR, viewport: DESKTOP, anchor: "#features" },
  { project: "autoreceptionist", name: "04-hero", url: AR, viewport: MOBILE },

  { project: "priya-tripathi", name: "01-hero", url: PRIYA, viewport: DESKTOP },
  { project: "priya-tripathi", name: "02-services", url: PRIYA, viewport: DESKTOP, anchor: "#services" },
  { project: "priya-tripathi", name: "03-blog", url: `${PRIYA}blog`, viewport: DESKTOP },
  { project: "priya-tripathi", name: "04-testimonials", url: PRIYA, viewport: DESKTOP, anchor: "#testimonials" },
  { project: "priya-tripathi", name: "05-hero", url: PRIYA, viewport: MOBILE },

  { project: "kfiq", name: "01-hero", url: KFIQ, viewport: DESKTOP },
  { project: "kfiq", name: "02-odds", url: KFIQ, viewport: DESKTOP, anchor: "#odds" },
  { project: "kfiq", name: "03-fields", url: KFIQ, viewport: DESKTOP, anchor: "#fields" },
  { project: "kfiq", name: "04-apply", url: KFIQ, viewport: DESKTOP, anchor: "#apply" },
  { project: "kfiq", name: "05-hero", url: KFIQ, viewport: MOBILE },

  { project: "p4-realty", name: "01-hero", url: P4, viewport: DESKTOP },
  { project: "p4-realty", name: "02-properties", url: `${P4}properties`, viewport: DESKTOP },
  { project: "p4-realty", name: "03-insights", url: `${P4}insights`, viewport: DESKTOP },
  { project: "p4-realty", name: "04-hero", url: P4, viewport: MOBILE },

  { project: "priya-tripathi", name: "06-webgl-deck", url: "https://shivoham-universal-demo.vercel.app/", viewport: DESKTOP, settle: 7000 },

  // ── Behind a login: run --login once, then --gated ────────────
  { project: "outreach-ops-crm", name: "01-write", url: "https://crm.autoreceptionist.io/write", viewport: DESKTOP, gated: true },
  { project: "outreach-ops-crm", name: "02-leads", url: "https://crm.autoreceptionist.io/leads", viewport: DESKTOP, gated: true },
  { project: "outreach-ops-crm", name: "03-queue", url: "https://crm.autoreceptionist.io/queue", viewport: DESKTOP, gated: true },
  { project: "outreach-ops-crm", name: "04-pipeline", url: "https://crm.autoreceptionist.io/pipeline", viewport: DESKTOP, gated: true },

  { project: "kfiq", name: "06-intern-app", url: "https://kfiq-interns.vercel.app/", viewport: DESKTOP, gated: true },

  // Synapse has no public deployment. Run it locally on :3002 and sign in
  // during --login, then --gated picks these up.
  { project: "synapse", name: "01-today", url: "http://localhost:3002/today", viewport: DESKTOP, gated: true },
  { project: "synapse", name: "02-goals", url: "http://localhost:3002/goals/map", viewport: DESKTOP, gated: true },
  { project: "synapse", name: "03-dashboard", url: "http://localhost:3002/dashboard", viewport: DESKTOP, gated: true },
];

const LOGIN_URLS = [
  "https://crm.autoreceptionist.io/login",
  "https://kfiq-interns.vercel.app/",
  "http://localhost:3002/login",
];

function launch({ headless }) {
  return puppeteer.launch({
    executablePath: CHROME,
    headless,
    userDataDir: PROFILE,
    defaultViewport: null,
    args: ["--hide-scrollbars", "--disable-features=CalculateNativeWinOcclusion"],
  });
}

async function shoot(browser, t) {
  const dir = path.join(SHOTS, t.project);
  await mkdir(dir, { recursive: true });

  const page = await browser.newPage();
  try {
    await page.setViewport(t.viewport);
    await page.goto(t.url, { waitUntil: "networkidle2", timeout: 60_000 });

    if (t.anchor) {
      const found = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        // Offset for the target site's own sticky header.
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72 });
        return true;
      }, t.anchor);
      if (!found) throw new Error(`anchor ${t.anchor} not on page`);
    }

    // Fonts, lazy images and entrance animations.
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, t.settle ?? 2500));

    const device = t.viewport.isMobile ? "mobile" : "desktop";
    const file = path.join(dir, `${t.name}-${device}.png`);
    await page.screenshot({ path: file, captureBeyondViewport: false });
    console.log(`  ok   ${path.relative(ROOT, file)}`);
  } catch (err) {
    console.error(`  FAIL ${t.project}/${t.name} - ${err.message}`);
  } finally {
    await page.close();
  }
}

const args = process.argv.slice(2);

if (args.includes("--login")) {
  const browser = await launch({ headless: false });
  const [first] = await browser.pages();
  await (first ?? (await browser.newPage())).goto(LOGIN_URLS[0]);
  for (const url of LOGIN_URLS.slice(1)) {
    await (await browser.newPage()).goto(url);
  }
  console.log("Sign in to each tab, then close the browser window.");
  await new Promise((resolve) => browser.on("disconnected", resolve));
  console.log(`Session saved to ${path.relative(ROOT, PROFILE)}`);
  process.exit(0);
}

const gated = args.includes("--gated");
const only = args.find((a) => !a.startsWith("--"));
const queue = TARGETS.filter(
  (t) => Boolean(t.gated) === gated && (!only || t.project === only),
);

if (queue.length === 0) {
  console.log("Nothing matched.");
  process.exit(0);
}

console.log(`Capturing ${queue.length} target(s)${gated ? " (signed in)" : ""}...`);
const browser = await launch({ headless: gated ? true : "shell" });
for (const t of queue) await shoot(browser, t);
await browser.close();
