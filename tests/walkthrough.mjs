// Records a scripted browser walkthrough of the whole site to walkthrough/*.webm (desktop + mobile).
// Usage: node tests/walkthrough.mjs   (server must be running on BASE_URL, default http://localhost:3005)
import { chromium } from "@playwright/test";
import { mkdirSync, readdirSync, renameSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3005";
const OUT = "walkthrough";
mkdirSync(OUT, { recursive: true });

async function smoothScroll(page, to, ms = 2500) {
  await page.evaluate(async ({ to, ms }) => {
    const from = window.scrollY, start = performance.now();
    await new Promise((done) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / ms);
        window.scrollTo(0, from + (to - from) * (0.5 - Math.cos(Math.PI * t) / 2));
        t < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });
  }, { to, ms });
}

async function record(name, viewport, script) {
  const browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({ viewport, recordVideo: { dir: OUT, size: viewport } });
  const page = await ctx.newPage();
  await script(page);
  await ctx.close();
  await browser.close();
  const latest = readdirSync(OUT).filter((f) => f.endsWith(".webm") && !f.startsWith("lumina-")).pop();
  renameSync(`${OUT}/${latest}`, `${OUT}/lumina-${name}.webm`);
}

const tour = async (page, mobile) => {
  await page.goto(BASE + "/");
  await page.waitForTimeout(2600); // intro loader + hero entrance
  const lab = await page.getByTestId("live-lab").evaluate((el) => ({ top: el.offsetTop, h: el.offsetHeight - window.innerHeight }));
  for (let i = 1; i <= 4; i++) {
    await smoothScroll(page, lab.top + (lab.h * Math.min(i, 3.6)) / 4, 2200);
    await page.waitForTimeout(1400);
  }
  await smoothScroll(page, lab.top + lab.h + 200, 1500);
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "Next slide" }).click();
  await page.waitForTimeout(1500);
  await smoothScroll(page, await page.evaluate(() => document.body.scrollHeight), 4000);
  await page.getByTestId("chat-toggle").click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "Can I get a crown today?" }).click();
  await page.waitForTimeout(1800);
  await page.getByTestId("chat-toggle").click();
  if (mobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(1200);
    await page.locator("#mobile-menu").getByRole("link", { name: "Plans", exact: true }).click();
  } else {
    await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Dentists" }).hover();
    await page.waitForTimeout(1200);
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Plans", exact: true }).click();
  }
  await page.waitForTimeout(1200);
  await page.getByRole("radio", { name: /Annual/ }).click();
  await page.waitForTimeout(1200);
  await page.getByRole("link", { name: "Join Precision" }).click();
  await page.waitForTimeout(1200);
  await page.getByTestId("booking-form").getByText("Book a treatment").click();
  await page.getByLabel("Treatment", { exact: true }).selectOption("same-day-crowns");
  const d = new Date(); d.setDate(d.getDate() + 1); if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  await page.getByLabel("Preferred date").fill(d.toISOString().slice(0, 10));
  await page.getByText("11:30", { exact: true }).click();
  await page.getByLabel("Full name").pressSequentially("Alex Rivera", { delay: 40 });
  await page.getByLabel("Email").pressSequentially("alex@example.test", { delay: 30 });
  await page.getByLabel("Phone").pressSequentially("+1 415 555 0199", { delay: 30 });
  await page.getByRole("button", { name: "Request appointment" }).click();
  await page.waitForTimeout(2500);
};

await record("desktop", { width: 1440, height: 900 }, (p) => tour(p, false));
await record("mobile", { width: 390, height: 844 }, (p) => tour(p, true));
console.log("videos in", OUT);
