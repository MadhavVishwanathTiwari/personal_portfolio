/**
 * Ad-hoc: screenshot the local dev server at a real viewport width.
 *   node scripts/selfshot.mjs /work/synapse 1440 0 synapse
 */
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const OUT = "scripts/.self";
await mkdir(OUT, { recursive: true });

const [route = "/", widthArg = "1440", scrollArg = "0", name = "shot"] =
  process.argv.slice(2);
const reducedMotion = process.argv.includes("--reduced-motion");
const width = Number(widthArg);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({
  width,
  height: width < 700 ? 844 : 900,
  deviceScaleFactor: 1,
  isMobile: width < 700,
});
if (reducedMotion) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
}
await page.goto((process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:3000") + route, {
  waitUntil: "networkidle2",
  timeout: 90_000,
});
await page.evaluate(() => document.fonts.ready);
if (scrollArg.startsWith("@")) {
  // Selector form: node scripts/selfshot.mjs /work/kfiq 1440 @figure name
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`no match for ${sel}`);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90 });
  }, scrollArg.slice(1));
} else if (Number(scrollArg) > 0) {
  await page.evaluate((y) => window.scrollTo(0, y), Number(scrollArg));
}
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: OUT + "/" + name + ".png" });
console.log(OUT + "/" + name + ".png");
await browser.close();
