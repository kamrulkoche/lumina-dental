"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { HoloPlatform, Drill, RobotArm } from "@/components/visuals/LabRig";
import { Smile } from "@/components/visuals/Smile";
import { Tooth } from "@/components/visuals/Tooth";
import { LAB_STAGES, SCAN_CALLOUTS } from "@/lib/content";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;
const N = LAB_STAGES.length;

/**
 * The reel's core experience: a pinned, scroll-driven "live lab" that walks a tooth
 * through scan → design → finish → smile. Each stage occupies one viewport of scroll.
 */
export function LiveLab() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(N - 1, Math.floor(p * N * 0.999));
    setStage((s) => (s === next ? s : next));
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const barWidth = useTransform(progress, [0, 1], ["4%", "100%"]);

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (i + 0.15)) / N;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  const current = LAB_STAGES[stage];
  const inLab = stage > 0;

  return (
    <section ref={ref} aria-label="Live dental lab" className="relative bg-abyss" style={{ height: `${N * 100 + 40}svh` }} data-testid="live-lab" data-stage={current.id}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* ---------- Backgrounds ---------- */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#12304d_0%,#081627_55%,#050d18_100%)]" aria-hidden />
        <motion.div style={{ y: gridY }} className="lab-grid absolute -inset-y-[20%] inset-x-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#9db3c4_0%,#6b8599_38%,#3d5568_75%,#22323f_100%)]"
          initial={false}
          animate={{ opacity: inLab ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <LabRoom visible={inLab} />

        {/* ---------- Stage 0 headline (centred, as in the opening frames) ---------- */}
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div key="h0" className="absolute inset-x-0 top-[17%] z-20 px-6 text-center sm:top-[15%]" exit={{ opacity: 0, y: -30, filter: "blur(6px)" }} transition={{ duration: 0.5 }}>
              <motion.p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-soft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {current.eyebrow}
              </motion.p>
              <h1 className="font-display text-[clamp(1.9rem,5.2vw,4.4rem)] font-extrabold uppercase leading-[1.02] tracking-tight text-white">
                <StageWords lines={["What if your dental", "website was a"]} />
                <StageWords lines={["LIVE LAB?"]} className="text-cyan-glow glow-text" delay={0.35} />
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- Centre visual ---------- */}
        <div className="absolute inset-0 z-10 grid place-items-center">
          <div className="relative mt-[14svh] aspect-square w-[min(78vw,58svh)] sm:mt-[10svh]">
            {/* scan beam */}
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-[-60%] h-[110%] w-[18%] -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,rgb(79_216_255/0.55)_60%,rgb(155_234_255/0.9))] blur-[6px]"
              initial={false}
              animate={{ opacity: stage === 0 ? 1 : 0, scaleX: stage === 0 ? 1 : 0.2 }}
              transition={{ duration: 0.6 }}
            />
            <HoloPlatform className="absolute inset-x-[4%] bottom-[2%] h-[40%]" intensity={stage === 3 ? 0 : stage === 2 ? 0.25 : 1} />

            {/* pedestal for the finish stage */}
            <motion.div
              aria-hidden
              className="absolute bottom-[6%] left-1/2 h-[16%] w-[58%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_30%,#3a4a57,#141d25_70%)] shadow-[0_20px_40px_rgb(0_0_0/0.45)]"
              initial={false}
              animate={{ opacity: stage === 2 ? 1 : 0, y: stage === 2 ? 0 : 30 }}
              transition={{ duration: 0.6, ease: EASE }}
            />

            {/* robot arms flank the tooth during design, then retract for the drill */}
            <motion.div className="absolute -left-[30%] bottom-[4%] w-[52%] sm:-left-[44%] sm:w-[60%]" initial={false} animate={{ opacity: stage === 1 ? 1 : 0, x: stage === 1 ? 0 : -80 }} transition={{ duration: 0.8, ease: EASE }}>
              <RobotArm pose={stage === 1 ? 0.6 : 0} />
            </motion.div>
            <motion.div className="absolute -right-[30%] bottom-[4%] w-[52%] sm:-right-[44%] sm:w-[60%]" initial={false} animate={{ opacity: stage === 1 ? 1 : 0, x: stage === 1 ? 0 : 80 }} transition={{ duration: 0.8, ease: EASE }}>
              <RobotArm flip pose={0.4} />
            </motion.div>

            <Drill className="absolute left-1/2 top-[-30%] w-[9%] -translate-x-1/2" active={stage === 2} />

            {/* tooth */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2"
              initial={false}
              animate={{
                scale: stage === 0 ? 0.82 : stage === 3 ? 0.5 : 1,
                opacity: stage === 3 ? 0 : 1,
                y: stage === 2 ? "4%" : stage === 0 ? "10%" : "0%",
                rotate: stage === 1 ? -6 : 0,
              }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div className={cn(!reduce && "animate-float")}>
                <Tooth glow={stage === 2} className="w-full drop-shadow-[0_24px_40px_rgb(0_0_0/0.45)]" />
              </div>
              {stage === 2 && <Sparks />}
            </motion.div>

            {/* scan callouts */}
            <AnimatePresence>{stage === 0 && <Callouts />}</AnimatePresence>

            {/* smile */}
            <AnimatePresence>
              {stage === 3 && (
                <motion.div
                  key="smile"
                  className="absolute left-1/2 top-[40%] w-[min(140%,92vw)] -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <Smile className="w-full drop-shadow-[0_0_30px_rgb(79_216_255/0.35)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* MICRON label, design stage */}
            <AnimatePresence>
              {stage === 1 && (
                <motion.div key="micron" className="absolute -right-[4%] top-[54%] hidden text-left sm:block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 }}>
                  <p className="font-display text-2xl font-extrabold uppercase text-white">Micron</p>
                  <p className="max-w-[11rem] text-[11px] leading-snug text-white/75">Contours modelled to 0.02 mm against your live scan.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* READY / CONSULTATION pills, finish + smile stages */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div key="pills" className="absolute inset-x-0 bottom-[-2%] z-20 flex justify-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <div className="glass flex items-center gap-1 rounded-full p-1">
                    <Link href="/book" className="rounded-full bg-cyan-glow px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-navy-950 shadow-glow transition hover:bg-cyan-soft">
                      Ready
                    </Link>
                    <Link href="/book?type=consultation" className="group inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-white/10">
                      Consultation <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---------- Stage 1–3 title, bottom-left ---------- */}
        <AnimatePresence mode="wait">
          {stage > 0 && (
            <motion.div
              key={current.id}
              className={cn(
                // phones: title above the visual so it never collides with the pills; larger screens: bottom-left
                "pointer-events-none absolute left-0 top-[12svh] z-20 max-w-md px-6 sm:px-10 lg:top-auto lg:bottom-[17svh] lg:left-[max(0px,calc((100vw-80rem)/2))]",
                // the reel places "Precision Design" top-left, the later titles bottom-left
                stage === 1 && "lg:top-[17svh] lg:bottom-auto",
              )} exit={{ opacity: 0, y: -20, filter: "blur(6px)" }} transition={{ duration: 0.4 }}>
              <motion.p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-soft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {current.eyebrow}
              </motion.p>
              <h2 className="font-display text-[clamp(2rem,4.6vw,3.8rem)] font-extrabold uppercase leading-[0.95] text-white">
                <StageWords lines={[...current.title]} />
              </h2>
              <motion.p className="mt-4 hidden max-w-sm text-sm leading-relaxed text-white/80 sm:block" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
                {current.body}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <Ruler stage={stage} />

        {/* ---------- Status bar (the reel's white "SCAN COMPLETE" band) ---------- */}
        <div className="absolute inset-x-0 bottom-0 z-30">
          <div className="mx-auto mb-4 flex max-w-3xl items-center justify-center gap-2" role="tablist" aria-label="Lab stages">
            {LAB_STAGES.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === stage}
                aria-label={`Go to ${s.eyebrow}`}
                onClick={() => jumpTo(i)}
                className={cn("h-1.5 rounded-full transition-all duration-500", i === stage ? "w-8 bg-cyan-glow shadow-glow" : "w-3 bg-white/40 hover:bg-white/70")}
              />
            ))}
          </div>
          <div className="relative bg-white/95 backdrop-blur">
            <motion.div className="absolute left-0 top-0 h-[3px] bg-cyan-deep shadow-glow" style={{ width: barWidth }} aria-hidden />
            <div className="relative mx-auto flex h-12 max-w-7xl items-center justify-between px-6 sm:h-14">
              <span className="hidden font-display text-[10px] font-bold uppercase tracking-[0.25em] text-ink-soft sm:block">Lumina Live Lab</span>
              <AnimatePresence mode="wait">
                <motion.span key={current.status} className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink sm:text-base" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} data-testid="lab-status">
                  {current.status}
                </motion.span>
              </AnimatePresence>
              <span className="hidden font-display text-[10px] font-bold tabular-nums tracking-[0.25em] text-ink-soft sm:block">
                {String(stage + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <AnimatePresence>
          {stage === 0 && (
            <motion.button type="button" onClick={() => jumpTo(1)} className="absolute bottom-24 left-1/2 z-30 -translate-x-1/2 text-white/70 transition hover:text-white" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 6, 0] }} exit={{ opacity: 0 }} transition={{ y: { repeat: Infinity, duration: 1.8 }, opacity: { delay: 1.6 } }} aria-label="Start the lab sequence">
              <ChevronDown className="size-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function StageWords({ lines, className, delay = 0 }: { lines: readonly string[]; className?: string; delay?: number }) {
  return (
    <>
      {lines.map((line, li) => (
        <span key={line} className={cn("block overflow-hidden pb-[0.06em]", className)}>
          <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.8, ease: EASE, delay: delay + li * 0.1 }}>
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

function Callouts() {
  return (
    <>
      {SCAN_CALLOUTS.map((c, i) => {
        const left = c.side === "left";
        return (
          <motion.div
            key={`${c.label}-${i}`}
            className={cn("absolute flex items-center", left ? "right-[64%] flex-row" : "left-[64%] flex-row-reverse")}
            style={{ top: c.top }}
            initial={{ opacity: 0, x: left ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
          >
            <span className="glass rounded-md px-2 py-1 font-display text-[9px] font-bold uppercase tracking-[0.15em] text-cyan-soft sm:px-3 sm:text-[11px]">{c.label}</span>
            <span className="h-px w-6 bg-cyan-glow/70 sm:w-14" />
            <span className="size-1.5 rounded-full bg-cyan-glow shadow-glow" />
          </motion.div>
        );
      })}
    </>
  );
}

const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { x: Math.cos(a) * (40 + (i % 3) * 18), y: Math.sin(a) * (30 + (i % 4) * 10) - 40, d: (i % 5) * 0.18 };
});

function Sparks() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[18%]" aria-hidden>
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-cyan-soft shadow-glow"
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: s.d, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/** Ceiling light + wall panels that appear once we move "inside" the lab. */
function LabRoom({ visible }: { visible: boolean }) {
  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0" initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.9 }}>
      <div className="absolute left-1/2 top-[9%] h-10 w-[38vw] max-w-lg -translate-x-1/2 rounded-[50%] bg-white/90 shadow-[0_0_80px_30px_rgb(255_255_255/0.35)]" />
      <div className="absolute inset-x-[6%] top-[24%] bottom-[30%] grid grid-cols-6 gap-3 opacity-25">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-lg border border-white/40" />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#1d2a35] to-transparent" />
    </motion.div>
  );
}

/** Vertical measuring scale on the right edge (visible in the reel's later frames). */
function Ruler({ stage }: { stage: number }) {
  return (
    <div className="pointer-events-none absolute right-5 top-1/2 z-20 hidden h-[40svh] -translate-y-1/2 flex-col justify-between md:flex" aria-hidden>
      {Array.from({ length: 21 }, (_, i) => (
        <span key={i} className={cn("h-px bg-white/50", i % 5 === 0 ? "w-4" : "w-2")} />
      ))}
      <motion.span className="absolute -left-2 h-2 w-2 rotate-45 bg-cyan-glow shadow-glow" initial={false} animate={{ top: `${(stage / (N - 1)) * 100}%` }} transition={{ type: "spring", stiffness: 80, damping: 16 }} />
    </div>
  );
}
