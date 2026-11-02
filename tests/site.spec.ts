import { expect, isMobile, test } from "./fixtures";

const ROUTES = [
  { label: "Plans", path: "/plans", heading: /care plans built/i },
  { label: "Dentists", path: "/dentists", heading: /hands behind the lab/i },
  { label: "Treatments", path: "/treatments", heading: /planned in pixels/i },
  { label: "About Us", path: "/about", heading: /clinic that became a lab/i },
];

test.describe("pages", () => {
  for (const r of ["/", ...ROUTES.map((x) => x.path), "/book"]) {
    test(`${r} renders with header, footer and no console errors`, async ({ page }) => {
      const res = await page.goto(r);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
      await expect(page.locator("footer")).toContainText("Lumina Dental");
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }

  test("unknown route shows the 404 page", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /scan found nothing/i })).toBeVisible();
    await page.getByRole("link", { name: "Back to the lab" }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("navigation", () => {
  test("every main nav link reaches its page", async ({ page, viewport }) => {
    await page.goto("/");
    const mobile = isMobile(viewport!.width);
    for (const r of ROUTES) {
      if (mobile) {
        await page.getByRole("button", { name: "Open menu" }).click();
        const menu = page.locator("#mobile-menu");
        if (r.label === "Dentists") {
          await menu.getByRole("button", { name: "Dentists" }).click();
          await menu.getByRole("link", { name: "All dentists" }).click();
        } else {
          await menu.getByRole("link", { name: r.label, exact: true }).click();
        }
      } else if (r.label === "Dentists") {
        await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Dentists" }).click();
        await page.getByRole("link", { name: "Meet all dentists" }).click();
      } else {
        await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: r.label, exact: true }).click();
      }
      await expect(page).toHaveURL(r.path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(r.heading);
      await expect(page.locator("#mobile-menu")).toHaveCount(0);
    }
  });

  test("Dentists dropdown opens on hover and deep-links to a specialty", async ({ page, viewport }) => {
    test.skip(isMobile(viewport!.width), "hover dropdown is desktop-only");
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Dentists" }).hover();
    await page.getByRole("link", { name: /Cosmetic/ }).click();
    await expect(page).toHaveURL("/dentists#cosmetic");
    await expect(page.locator("#cosmetic")).toBeInViewport();
  });

  test("Book Now CTA opens the booking page", async ({ page, viewport }) => {
    await page.goto("/plans");
    if (viewport!.width < 640) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.locator("#mobile-menu").getByRole("link", { name: "Book Now" }).click();
    } else {
      await page.getByTestId("nav-book").click();
    }
    await expect(page).toHaveURL("/book");
    await expect(page.getByTestId("booking-form")).toBeVisible();
  });

  test("mobile menu closes on Escape", async ({ page, viewport }) => {
    test.skip(!isMobile(viewport!.width), "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });
});

test.describe("live lab", () => {
  test("scrolling advances scan → design → finish → smile", async ({ page }) => {
    await page.goto("/");
    const lab = page.getByTestId("live-lab");
    await expect(lab).toHaveAttribute("data-stage", "scan");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/live lab/i);
    const box = await lab.evaluate((el) => ({ top: (el as HTMLElement).offsetTop, h: (el as HTMLElement).offsetHeight - window.innerHeight }));
    const expected = [
      ["design", "Modelling"],
      ["finish", "Polishing"],
      ["smile", "Scan complete"],
    ] as const;
    for (let i = 0; i < expected.length; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), box.top + (box.h * (i + 1.5)) / 4);
      await expect(lab).toHaveAttribute("data-stage", expected[i][0]);
      await expect(page.getByTestId("lab-status")).toHaveText(expected[i][1]);
    }
  });

  test("stage dots jump to a stage, and Ready pill links to booking", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: /Robotic Milling/ }).click();
    await expect(page.getByTestId("live-lab")).toHaveAttribute("data-stage", "finish");
    await page.getByRole("link", { name: "Ready", exact: true }).click();
    await expect(page).toHaveURL("/book");
  });
});

test.describe("home interactions", () => {
  test("precision carousel moves with next / prev / dots", async ({ page }) => {
    await page.goto("/");
    // During the exit animation the outgoing slide is briefly still mounted, so target the incoming one.
    const slide = (n: number) => page.locator(`[data-testid="hero-slide"][aria-label="${n} of 3"]`);
    const dot = (n: number) => page.getByRole("button", { name: new RegExp(`Show slide ${n}`) });
    await slide(1).scrollIntoViewIfNeeded();
    await expect(dot(1)).toHaveAttribute("aria-current", "true");
    await page.getByRole("button", { name: "Next slide" }).click();
    await expect(slide(2)).toBeVisible();
    await expect(dot(2)).toHaveAttribute("aria-current", "true");
    await page.getByRole("button", { name: "Previous slide" }).click();
    await expect(slide(1)).toBeVisible();
    await dot(3).click();
    await expect(slide(3)).toBeVisible();
    await expect(dot(3)).toHaveAttribute("aria-current", "true");
  });

  test("treatment cards link to their treatment", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("treatment-card").first().click();
    await expect(page).toHaveURL("/treatments#same-day-crowns");
  });

  test("chat widget answers a quick question and links onward", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("chat-toggle").click();
    const chat = page.getByRole("dialog", { name: /chat with lumina/i });
    await expect(chat).toBeVisible();
    await chat.getByRole("button", { name: "What do plans cost?" }).click();
    await expect(chat).toContainText("$29/month");
    await chat.getByRole("link", { name: /Compare plans/ }).click();
    await expect(page).toHaveURL("/plans");
  });
});

test.describe("plans", () => {
  test("annual billing applies the discount", async ({ page }) => {
    await page.goto("/plans");
    const prices = page.getByTestId("plan-price");
    await expect(prices).toHaveText(["$29", "$59", "$99"]);
    await page.getByRole("radio", { name: /Annual/ }).click();
    await expect(prices).toHaveText(["$25", "$50", "$84"]);
  });

  test("Join plan pre-selects it on the booking form", async ({ page }) => {
    await page.goto("/plans");
    await page.getByRole("link", { name: "Join Precision" }).click();
    await expect(page).toHaveURL("/book?plan=precision");
    await expect(page.getByLabel("Membership plan (optional)")).toHaveValue("precision");
  });
});

test.describe("booking", () => {
  const tomorrowMonday = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  test("empty submit shows field errors", async ({ page }) => {
    await page.goto("/book");
    await page.getByRole("button", { name: "Request appointment" }).click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Pick a time slot.")).toBeVisible();
  });

  test("valid treatment booking succeeds with a reference", async ({ page }) => {
    await page.goto("/book?treatment=clear-aligners");
    await expect(page.getByLabel("Treatment", { exact: true })).toHaveValue("clear-aligners");
    await page.getByLabel("Preferred date").fill(tomorrowMonday());
    await page.getByText("10:00", { exact: true }).click();
    await page.getByLabel("Full name").fill("Test Patient");
    await page.getByLabel("Email").fill("patient@example.test");
    await page.getByLabel("Phone").fill("+1 415 555 0100");
    await page.getByRole("button", { name: "Request appointment" }).click();
    const done = page.getByTestId("booking-success");
    await expect(done).toBeVisible();
    await expect(done).toContainText("Clear Aligners");
    await expect(done).toContainText(/Ref LD-[A-Z0-9]+/);
  });

  test("API rejects invalid bookings", async ({ request }) => {
    const res = await request.post("/api/book", { data: { type: "consultation", name: "x" } });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(Object.keys(body.errors)).toEqual(expect.arrayContaining(["name", "email", "phone", "date", "time"]));
  });
});

test("intro loader runs once on first visit", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByTestId("intro-loader")).toBeVisible();
  await expect(page.getByTestId("intro-loader")).toHaveCount(0, { timeout: 5000 });
  await page.reload();
  await expect(page.getByTestId("intro-loader")).toHaveCount(0);
  await ctx.close();
});
