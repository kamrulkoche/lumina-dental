# Lumina Dental

A Next.js recreation of the "live dental lab" website shown in a Facebook reel: a pinned, scroll-driven
lab sequence (scan → design → finish → smile) that hands off to a light, frosted "engineered with precision" clinic site.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide · Playwright.

```bash
npm install
npm run dev            # http://localhost:3005
npm run build && npm run start
npm run lint           # tsc --noEmit
npm run test:e2e       # Playwright, real Chrome, desktop/tablet/mobile (starts the server if needed)
node tests/capture.mjs final-screenshots   # screenshots of every stage/route at 3 viewports
node tests/walkthrough.mjs                 # records walkthrough/lumina-{desktop,mobile}.webm
```

Port 3005 avoids the other workspace apps on 3000/3001.

## Layout

```
src/app/                 routes: / plans dentists treatments about book (+ api/book), template.tsx = page transitions
src/components/lab/      LiveLab — the pinned 4-stage scroll experience
src/components/home/     PrecisionHero carousel, treatment cards, stats, CTA
src/components/layout/   Navbar, Footer, ChatWidget, IntroLoader, PageHero, Logo
src/components/ui/       Button/ButtonLink, Reveal / Stagger / RevealText
src/components/visuals/  SVG Tooth, Smile, RobotArm, Drill, HoloPlatform
src/lib/content.ts       all copy and data (nav, stages, treatments, plans, dentists)
src/lib/booking.ts       booking validation shared by the form and the API route
reference-analysis/      reel analysis + design blueprint
tests/                   Playwright spec, fixtures, capture + walkthrough scripts
```

All clinic data in `src/lib/content.ts` is placeholder. The booking endpoint validates but does not persist anything.
