# Browser test report

**Run:** 2026-11-03 · production build (`next build` + `next start -p 3005`) · Google Chrome via Playwright
(`channel: "chrome"`) · 3 projects: desktop 1440×900, tablet 820×1180 (touch), mobile Pixel 7.

**Result: 63 passed, 3 skipped, 0 failed.** The 3 skips are by design: the hover dropdown runs on desktop only,
and Escape-closes-menu is skipped on desktop, which has no mobile menu.

Every test also fails if the page logs a console error or throws an uncaught exception (`tests/fixtures.ts`).

| Area | Covered |
|---|---|
| Pages | `/`, `/plans`, `/dentists`, `/treatments`, `/about`, `/book` return 200 with nav, footer and h1; 404 page and its link home |
| Navigation | every main nav link (desktop bar, or mobile menu incl. the Dentists accordion); hover dropdown → `/dentists#cosmetic` scrolls into view; Book Now; Escape closes the mobile menu |
| Live lab | scrolling advances scan → design → finish → smile with matching status text; stage dots jump; Ready pill → `/book` |
| Home | carousel next/prev/dots; treatment card deep link; chat quick-reply answer and CTA navigation |
| Plans | annual toggle shows discounted prices ($25 / $50 / $84); Join Precision preselects the plan on `/book` |
| Booking | empty submit shows field errors; full treatment booking succeeds with an `LD-…` reference; API returns 422 with field errors for bad input |
| Loader | intro loader shows once per session, not on reload |

## Issues found during testing and fixed

1. **Missing favicon → 404 on every page.** Added `src/app/icon.svg`.
2. **`cn()` didn't resolve conflicting Tailwind classes.** As a result the mobile Book Now pill showed when it
   should be hidden and the holo platform got the wrong `position`. Switched to `tailwind-merge`.
3. **The custom `text-glow` utility was read as a text colour by tailwind-merge**, which stripped the cyan from
   "LIVE LAB?". Renamed it to `glow-text`.
4. **Robot-arm links came apart.** Framer Motion resolves SVG `originX/Y` against each group's bounding box.
   The joints now use CSS rotations with `transform-box: view-box`.
5. **Clicking "Dentists" with a mouse opened the menu on hover and then the click closed it.** Mouse clicks
   now keep it open; keyboard activation still toggles.
6. **On tablet and phone, the lab stage title covered the Ready/Consultation pills** (visually and for taps).
   The title is now `pointer-events: none` and sits above the visual on screens under 1024 px.
7. **Word-reveal headings joined words with `&nbsp;`**, which affected copy/paste and text matching. They now
   use real spaces.

## Not verified

- Real Safari/Firefox (Chromium only), real touch devices, and Lighthouse/perf scores were not run.
- The booking API validates and returns a reference **but stores nothing and sends no email**. See `src/app/api/book/route.ts`.
