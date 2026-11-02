"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "lumina-intro-seen";

/** Short "calibrating lab" loader, shown once per browser session. */
export function IntroLoader() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(KEY) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sessionStorage.setItem(KEY, "1");
    setShow(true);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / 1300) * 100);
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-abyss"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          data-testid="intro-loader"
        >
          <div className="lab-grid absolute inset-0 opacity-50" aria-hidden />
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative size-28">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle cx="50" cy="50" r="44" stroke="rgb(79 216 255 / 0.15)" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="44" stroke="#4fd8ff" strokeWidth="2.5" fill="none" strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - pct / 100)} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-xl font-bold text-white tabular-nums">{Math.round(pct)}%</span>
            </div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-soft">Calibrating live lab</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
