import { test as base, expect } from "@playwright/test";

/**
 * Skips the once-per-session intro loader and fails any test whose page logs a console error
 * or throws an uncaught exception.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(`${m.text()} @ ${m.location().url}`));
      page.on("pageerror", (e) => errors.push(e.message));
      // the 404 test requests a missing page on purpose
      const expected = (e: string) => e.includes("404") && e.includes("/no-such-page");
      await use(errors);
      expect(errors.filter((e) => !expected(e)), "console errors").toEqual([]);
    },
    { auto: true },
  ],
  page: async ({ page }, use) => {
    await page.addInitScript(() => sessionStorage.setItem("lumina-intro-seen", "1"));
    await use(page);
  },
});

export { expect };

export const isMobile = (w: number) => w < 1024;
