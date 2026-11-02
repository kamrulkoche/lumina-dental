"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Crown, Drill, ScanLine, Sparkles, Sun, WandSparkles, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Treatment } from "@/lib/content";

const ICONS: Record<Treatment["icon"], LucideIcon> = { Crown, Sparkles, Wand: WandSparkles, Scan: ScanLine, Drill, Sun };

export function TreatmentCard({ t, href }: { t: Treatment; href?: string }) {
  const Icon = ICONS[t.icon];
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="h-full">
      <Link
        href={href ?? `/treatments#${t.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-[0_24px_60px_-20px_rgb(18_168_214/0.45)]"
        data-testid="treatment-card"
      >
        <div className="absolute -right-10 -top-10 size-36 rounded-full bg-[radial-gradient(circle,#dff6ff,transparent_70%)] transition-transform duration-500 group-hover:scale-150" aria-hidden />
        <div className="relative flex items-start justify-between">
          <span className="grid size-12 place-items-center rounded-2xl bg-mist text-cyan-deep transition-colors duration-300 group-hover:bg-ink group-hover:text-cyan-glow">
            <Icon className="size-5" aria-hidden />
          </span>
          <ArrowUpRight className="size-5 text-ink/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
        </div>
        <h3 className="relative mt-8 font-display text-lg font-bold leading-snug text-ink">{t.name}</h3>
        <p className="relative mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{t.summary}</p>
        <div className="relative mt-6 flex items-center justify-between border-t border-ink/8 pt-4 text-xs">
          <span className="text-ink-soft">{t.duration}</span>
          <span className="font-semibold text-ink">from ${t.from.toLocaleString("en-US")}</span>
        </div>
      </Link>
    </motion.div>
  );
}
