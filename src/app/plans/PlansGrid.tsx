"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { PLANS } from "@/lib/content";
import { cn } from "@/lib/cn";

export function PlansGrid() {
  const [annual, setAnnual] = useState(false);
  return (
    <section className="bg-mist py-20 text-ink">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex justify-center">
          <div className="relative inline-flex rounded-full border border-ink/10 bg-white p-1 shadow-card" role="radiogroup" aria-label="Billing period">
            {(["Monthly", "Annual"] as const).map((label) => {
              const active = (label === "Annual") === annual;
              return (
                <button key={label} type="button" role="radio" aria-checked={active} onClick={() => setAnnual(label === "Annual")} className={cn("relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors", active ? "text-white" : "text-ink-soft hover:text-ink")}>
                  {active && <motion.span layoutId="billing-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  {label}
                  {label === "Annual" && <span className={cn("ml-1.5 text-[11px]", active ? "text-cyan-glow" : "text-cyan-deep")}>−15%</span>}
                </button>
              );
            })}
          </div>
        </div>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = annual ? Math.round(p.price * 0.85) : p.price;
            return (
              <StaggerItem key={p.name}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-3xl p-8",
                    p.featured ? "bg-navy-950 text-white shadow-[0_30px_80px_-30px_rgb(18_168_214/0.6)]" : "border border-ink/8 bg-white shadow-card",
                  )}
                  data-testid="plan-card"
                >
                  {p.featured && <div className="lab-grid absolute inset-0 opacity-50" aria-hidden />}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-extrabold uppercase tracking-wide">{p.name}</h2>
                      {p.featured && <span className="rounded-full bg-cyan-glow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-navy-950">Most chosen</span>}
                    </div>
                    <p className={cn("mt-1 text-sm", p.featured ? "text-steel-300" : "text-ink-soft")}>{p.tagline}</p>
                    <p className="mt-8 flex items-end gap-1">
                      <motion.span key={price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-extrabold tabular-nums" data-testid="plan-price">
                        ${price}
                      </motion.span>
                      <span className={cn("pb-1.5 text-sm", p.featured ? "text-steel-300" : "text-ink-soft")}>/ month{annual ? ", billed yearly" : ""}</span>
                    </p>
                    <ul className="mt-8 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-3 text-sm">
                          <Check className={cn("mt-0.5 size-4 shrink-0", p.featured ? "text-cyan-glow" : "text-cyan-deep")} aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative mt-auto pt-10">
                    <ButtonLink href={`/book?plan=${p.name.toLowerCase().replace(/\s+/g, "-")}`} variant={p.featured ? "cyan" : "ink"} className="w-full">
                      Join {p.name}
                    </ButtonLink>
                  </div>
                </motion.article>
              </StaggerItem>
            );
          })}
        </Stagger>
        <p className="mt-10 text-center text-sm text-ink-soft">Cancel any time. Plans renew monthly or yearly and include every family member listed at sign-up.</p>
      </div>
    </section>
  );
}
