// Visual walkthrough: captures each home-page lab stage and every route at desktop / tablet / mobile.
// Usage: node tests/capture.mjs [outDir]   (server must be running on BASE_URL, default http://localhost:3005)
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3005";
const OUT = process.argv[2] ?? "final-screenshots";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];
const ROUTES = ["/plans", "/dentists", "/treatments", "/about", "/book"];

const browser = await chromium.launch({ channel: "chrome" });
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => sessionStorage.setItem("lumina-intro-seen", "1"));
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const lab = page.getByTestId("live-lab");
  const { top, height } = await lab.evaluate((el) => ({ top: el.offsetTop, height: el.offsetHeight }));
  const scrollable = height - vp.height;
  for (let i = 0; i < 4; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), top + (scrollable * (i + 0.5)) / 4);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/${vp.name}-home-stage${i + 1}.png` });
  }
  await page.evaluate((y) => window.scrollTo(0, y), top + height);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${vp.name}-home-precision.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/${vp.name}-home-footer.png` });
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    // trigger every scroll-reveal before the full-page capture
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${vp.name}${r.replace("/", "-")}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log("captured to", OUT);
