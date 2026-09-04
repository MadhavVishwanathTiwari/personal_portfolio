/**
 * Screenshot capture for the case studies.
 *
 *   node scripts/capture.mjs              capture every public target
 *   node scripts/capture.mjs kfiq         capture one project's targets
 *   node scripts/capture.mjs --gated      capture the targets behind a login
 *
 * Captures are viewport-sized, never full-page: a 6000px-tall image destroys
 * the layout rhythm on the case-study page. Sections below the fold are
 * reached by `anchor` (a selector), never by a pixel offset, because a pixel
 * offset silently rots the moment the target site changes.
 *
 * Two things this script learned the hard way:
 *
 *  1. Signing in with one browser and capturing with another does not work
 *     reliably — the session lives in a profile that a second launch may not
 *     read back. So `--gated` opens ONE visible browser, waits for you to
 *     sign in, and captures in that same session without ever closing it.
 *
 *  2. A capture that silently succeeded on a login page is worse than a
 *     failure, because it writes a plausible-looking file over a placeholder
 *     and reports "ok". Every gated capture is now checked for signs of a
 *     signed-out page and refuses to write the file if it finds any.
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
const CRM = "https://crm.autoreceptionist.io";
const SYNAPSE = "http://localhost:3002";

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
  { project: "priya-tripathi", name: "06-webgl-deck", url: "https://shivoham-universal-demo.vercel.app/", viewport: DESKTOP, settle: 7000 },

  { project: "kfiq", name: "01-hero", url: KFIQ, viewport: DESKTOP },
  { project: "kfiq", name: "02-odds", url: KFIQ, viewport: DESKTOP, anchor: "#odds" },
  { project: "kfiq", name: "03-fields", url: KFIQ, viewport: DESKTOP, anchor: "#fields" },
  { project: "kfiq", name: "04-apply", url: KFIQ, viewport: DESKTOP, anchor: "#apply" },
  { project: "kfiq", name: "05-hero", url: KFIQ, viewport: MOBILE },

  { project: "p4-realty", name: "01-hero", url: P4, viewport: DESKTOP },
  { project: "p4-realty", name: "02-properties", url: `${P4}properties`, viewport: DESKTOP },
  { project: "p4-realty", name: "03-insights", url: `${P4}insights`, viewport: DESKTOP },
  { project: "p4-realty", name: "04-hero", url: P4, viewport: MOBILE },

  // ── Behind a login: node scripts/capture.mjs --gated ──────────
  { project: "outreach-ops-crm", name: "01-pipeline", url: `${CRM}/pipeline`, viewport: DESKTOP, gated: true },

  // The contacts directory is a list of real named people, so it is captured
  // filtered to example.com, which is exactly the set of seeded demo leads
  // from migration 0037 and nothing else. The search box is a substring match
  // over work_email, so this is a hard filter rather than a visual one.
  {
    project: "outreach-ops-crm",
    name: "02-contacts",
    url: `${CRM}/contacts`,
    viewport: DESKTOP,
    gated: true,
    fill: { selector: 'input[type="search"]', value: "example.com" },
  },

  { project: "kfiq", name: "06-intern-app", url: "https://kfiq-interns.vercel.app/", viewport: DESKTOP, gated: true },

  // Synapse has no public deployment. Start it locally on :3002 first.
  { project: "synapse", name: "01-today", url: `${SYNAPSE}/today`, viewport: DESKTOP, gated: true },
  { project: "synapse", name: "02-goals", url: `${SYNAPSE}/goals/map`, viewport: DESKTOP, gated: true },
  { project: "synapse", name: "03-dashboard", url: `${SYNAPSE}/dashboard`, viewport: DESKTOP, gated: true },
];

/** One page per distinct app to sign into, opened as tabs to work through. */
const LOGIN_URLS = [`${CRM}/login`, "https://kfiq-interns.vercel.app/", `${SYNAPSE}/login`];

const SIGNED_OUT_TEXT =
  /continue with google|sign in to|sign in with|create your account|enter your email to sign in|log ?in to/i;

function launch({ headless }) {
  return puppeteer.launch({
    executablePath: CHROME,
    headless,
    userDataDir: PROFILE,
    defaultViewport: null,
    args: ["--hide-scrollbars", "--disable-features=CalculateNativeWinOcclusion"],
  });
}

/**
 * True when the page is almost certainly an auth wall. Deliberately eager:
 * a false positive costs a re-run, a false negative publishes a login page
 * as though it were the product.
 */
async function looksSignedOut(page) {
  const url = page.url();
  if (/\/(login|signin|sign-in|auth)(\/|\?|$)/i.test(url)) return "redirected to a login route";
  if (/accounts\.google\.com|vercel\.com\/(login|sso)/i.test(url)) return "sitting on an identity provider";

  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 1200) ?? "");
  if (SIGNED_OUT_TEXT.test(text)) return "page reads as a sign-in screen";
  if (text.trim().length < 40) return "page is essentially empty";
  return null;
}

function waitForEnter(message) {
  process.stdout.write(message);
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.pause();
      resolve();
    });
  });
}

async function shoot(browser, t, { guard }) {
  const dir = path.join(SHOTS, t.project);
  await mkdir(dir, { recursive: true });

  const page = await browser.newPage();
  try {
    await page.setViewport(t.viewport);
    await page.goto(t.url, { waitUntil: "networkidle2", timeout: 60_000 });

    if (guard) {
      const reason = await looksSignedOut(page);
      if (reason) {
        console.error(`  SKIP ${t.project}/${t.name} - ${reason}; placeholder left in place`);
        return false;
      }
    }

    if (t.fill) {
      await page.waitForSelector(t.fill.selector, { timeout: 20_000 });
      await page.click(t.fill.selector);
      await page.type(t.fill.selector, t.fill.value, { delay: 12 });
      await new Promise((r) => setTimeout(r, 800));
    }

    if (t.anchor) {
      const found = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72 });
        return true;
      }, t.anchor);
      if (!found) throw new Error(`anchor ${t.anchor} not on page`);
    }

    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, t.settle ?? 2500));

    const device = t.viewport.isMobile ? "mobile" : "desktop";
    const file = path.join(dir, `${t.name}-${device}.png`);
    await page.screenshot({ path: file, captureBeyondViewport: false });
    console.log(`  ok   ${path.relative(ROOT, file)}`);
    return true;
  } catch (err) {
    console.error(`  FAIL ${t.project}/${t.name} - ${err.message}`);
    return false;
  } finally {
    await page.close();
  }
}

const args = process.argv.slice(2);
const gated = args.includes("--gated") || args.includes("--login");
const only = args.find((a) => !a.startsWith("--"));

const queue = TARGETS.filter(
  (t) => Boolean(t.gated) === gated && (!only || t.project === only),
);

if (queue.length === 0) {
  console.log("Nothing matched.");
  process.exit(0);
}

// Public targets run headless. Gated targets run in a visible window,
// because signing in and capturing have to happen in the same session.
const browser = await launch({ headless: gated ? false : "shell" });

if (gated) {
  const [first] = await browser.pages();
  const page = first ?? (await browser.newPage());
  await page.goto(LOGIN_URLS[0]).catch(() => {});
  for (const url of LOGIN_URLS.slice(1)) {
    await (await browser.newPage()).goto(url).catch(() => {});
  }
  console.log(
    "\nA browser window is open. Sign in to each tab that shows a login screen.",
  );
  console.log(
    "Synapse is on localhost:3002 — if it is not running, that tab will error and its three shots will be skipped.\n",
  );
  await waitForEnter("Press Enter here when you are signed in... ");
  console.log("");
}

console.log(`Capturing ${queue.length} target(s)${gated ? " (signed in)" : ""}...`);

let ok = 0;
for (const t of queue) {
  if (await shoot(browser, t, { guard: gated })) ok += 1;
}

await browser.close();

console.log(`\n${ok} of ${queue.length} captured.`);
if (ok < queue.length) {
  console.log("Anything skipped kept its placeholder. Re-run once signed in.");
}
if (ok > 0) {
  console.log("Next: node scripts/redact-region.mjs && node scripts/optimize-shots.mjs");
}
