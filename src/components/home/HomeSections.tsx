"use client";

import { animate, motion, useInView } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealText, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Tooth } from "@/components/visuals/Tooth";
import { CLINIC, STATS, TREATMENTS } from "@/lib/content";
import { TreatmentCard } from "./TreatmentCard";

export function TreatmentsRow() {
  return (
    <section className="bg-mist pb-24 text-ink" aria-labelledby="treatments-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-deep">Treatments</p>
            </Reveal>
            <h2 id="treatments-heading" className="mt-3 max-w-xl font-display text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
              <RevealText text="Every treatment starts in the lab" highlight="lab" highlightClass="text-cyan-deep" />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <ButtonLink href="/treatments" variant="outline-light">
              All treatments <ArrowRight className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.slice(0, 3).map((t) => (
            <StaggerItem key={t.slug}>
              <TreatmentCard t={t} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="border-y border-ink/8 bg-cloud text-ink" aria-label="Lab in numbers">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-5 py-14 sm:px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl font-extrabold tabular-nums sm:text-5xl">
              <Counter to={s.value} decimals={"decimals" in s ? s.decimals : 0} />
              <span className="text-cyan-deep">{s.suffix}</span>
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

export function BookingCta() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24" aria-labelledby="cta-heading">
      <div className="lab-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 id="cta-heading" className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold uppercase leading-[1.02] text-white">
            <RevealText text="Step inside the live lab" highlight="lab" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-md text-steel-300">Book a free 20-minute consultation and watch your own 3D scan build in real time.</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book" size="lg">
              Book Now <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href={CLINIC.phoneHref} variant="ghost" size="lg">
              <Phone className="size-4" /> {CLINIC.phone}
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative mx-auto aspect-square w-64 sm:w-80">
          <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-cyan-glow/40" />
          <div className="absolute inset-[12%] animate-spin-rev rounded-full border-2 border-cyan-glow/50 border-r-transparent" />
          <div className="absolute inset-[28%] rounded-full bg-cyan-glow/20 blur-2xl" />
          <motion.div className="absolute inset-[22%]" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <Tooth glow className="size-full" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
