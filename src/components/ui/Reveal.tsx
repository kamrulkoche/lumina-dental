"use client";

import { motion, type Variants } from "framer-motion";
import { Fragment, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into view once, when scrolled to. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Staggers direct `StaggerItem` children as the group enters the viewport. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/** Word-by-word masked text reveal. `highlight` words get the accent class. */
export function RevealText({
  text,
  className,
  highlight,
  highlightClass = "text-cyan-glow glow-text",
  delay = 0,
  animateOn = "view",
}: {
  text: string;
  className?: string;
  highlight?: string;
  highlightClass?: string;
  delay?: number;
  animateOn?: "view" | "mount";
}) {
  const words = text.split(" ");
  const trigger = animateOn === "view" ? { whileInView: "show" as const, viewport: { once: true } } : { animate: "show" as const };
  return (
    <motion.span className={className} initial="hidden" {...trigger} transition={{ staggerChildren: 0.06, delayChildren: delay }} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
            <motion.span
              className={`inline-block ${highlight && w.toLowerCase().includes(highlight.toLowerCase()) ? highlightClass : ""}`}
              variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.75, ease: EASE } } }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}
