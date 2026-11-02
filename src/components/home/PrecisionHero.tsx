"use client";

import { AnimatePresence, motion, useScroll, useTransform, type PanInfo } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Smile } from "@/components/visuals/Smile";
import { Tooth } from "@/components/visuals/Tooth";
import { HERO_SLIDES } from "@/lib/content";
import { cn } from "@/lib/cn";

const INTERVAL = 6500;
const SHADES = ["#fbfaf5", "#f4efe2", "#ece3cf", "#e2d6bd"];

/**
 * The reel's closing frame: a frosted card on a pale clinic backdrop —
 * smile on the left, "YOUR SMILE. ENGINEERED WITH [PRECISION]" on the right, a dark CTA pill and slide dots.
 */
export function PrecisionHero() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const go = useCallback((next: number) => {
    setDir(next > index || (index === HERO_SLIDES.length - 1 && next === 0) ? 1 : -1);
    setIndex((next + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [index]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const slide = HERO_SLIDES[index];
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(index + 1);
    else if (info.offset.x > 60) go(index - 1);
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-mist py-20 text-ink sm:py-28" aria-roledescription="carousel" aria-label="Featured treatments">
      <motion.div style={{ y: bgY }} aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#ffffff_0%,transparent_55%),radial-gradient(ellipse_at_85%_80%,#d9e4ec_0%,transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-white bg-white/60 shadow-card backdrop-blur-xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="absolute right-5 top-5 z-10 inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-[11px] font-medium text-ink-soft">
            <Plus className="size-3" aria-hidden /> {slide.kicker}
          </div>
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onDragEnd}
              className="grid cursor-grab items-center gap-8 px-6 py-12 active:cursor-grabbing sm:px-12 md:grid-cols-2 md:gap-4 md:py-16"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${HERO_SLIDES.length}`}
              data-testid="hero-slide"
            >
              <motion.div style={{ y: visualY }} className="relative mx-auto w-full max-w-md">
                <SlideVisual kind={slide.visual} />
              </motion.div>
              <div className="text-center md:text-left">
                <h2 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold uppercase leading-[1.02] tracking-tight">
                  {slide.headline.map((line, i) => (
                    <span key={line} className="block overflow-hidden">
                      <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}>
                        {i === slide.headline.length - 1 ? <Highlighted line={line} word={slide.highlight} /> : line}
                      </motion.span>
                    </span>
                  ))}
                </h2>
                <motion.p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft md:mx-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  {slide.body}
                </motion.p>
                <motion.div className="mt-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <ButtonLink href="/book?type=consultation" variant="ink" size="lg">
                    Book your consultation <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </ButtonLink>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="grid size-9 place-items-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-ink/40">
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.kicker}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}: ${s.kicker}`}
                aria-current={i === index}
                className={cn("relative h-1.5 overflow-hidden rounded-full bg-ink/15 transition-all duration-500", i === index ? "w-10" : "w-4 hover:bg-ink/30")}
              >
                {i === index && !paused && <motion.span key={`p${index}`} className="absolute inset-y-0 left-0 bg-ink" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: INTERVAL / 1000, ease: "linear" }} />}
                {i === index && paused && <span className="absolute inset-0 bg-ink" />}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="grid size-9 place-items-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-ink/40">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Highlighted({ line, word }: { line: string; word: string }) {
  const i = line.toLowerCase().lastIndexOf(word.toLowerCase());
  if (i < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, i)}
      <span className="relative inline-block bg-ink px-2 text-white">{line.slice(i, i + word.length)}</span>
      {line.slice(i + word.length)}
    </>
  );
}

function SlideVisual({ kind }: { kind: (typeof HERO_SLIDES)[number]["visual"] }) {
  if (kind === "tooth") {
    return (
      <div className="relative mx-auto aspect-square w-3/4">
        <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,#e3f8ff,transparent_70%)]" />
        <div className="absolute inset-[14%] animate-spin-slow rounded-full border border-dashed border-cyan-deep/40" />
        <Tooth className="relative mx-auto w-1/2 pt-[18%] drop-shadow-[0_20px_30px_rgb(13_23_38/0.2)]" />
      </div>
    );
  }
  if (kind === "aligner") {
    return (
      <div className="relative">
        <Smile outline={false} className="w-full drop-shadow-[0_18px_30px_rgb(13_23_38/0.18)]" />
        <div className="mt-6 flex justify-center gap-2" aria-label="Shade guide">
          {SHADES.map((c, i) => (
            <span key={c} className={cn("h-10 w-7 rounded-b-full rounded-t-md border border-ink/10 shadow-sm", i === 1 && "ring-2 ring-ink ring-offset-2")} style={{ background: c }} />
          ))}
        </div>
      </div>
    );
  }
  return <Smile outline={false} className="w-full drop-shadow-[0_18px_30px_rgb(13_23_38/0.18)]" />;
}
