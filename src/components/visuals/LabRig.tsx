"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/cn";

const steel = "#e9eef2";
const jointFill = "#2b3a47";

/**
 * CSS rotation pivoting on a point in SVG user space (`transform-box: view-box`), so nested
 * links stay attached to their joints while the transition animates.
 */
function joint(angle: number, cx: number, cy: number): React.CSSProperties {
  return {
    transform: `rotate(${angle}deg)`,
    transformOrigin: `${cx}px ${cy}px`,
    transformBox: "view-box",
    transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
  };
}

/** Articulated robot arm. `pose` (0–1) swings it between the rest and working positions. */
export function RobotArm({ className, flip = false, pose = 0 }: { className?: string; flip?: boolean; pose?: number }) {
  const id = useId().replace(/:/g, "");
  const shoulder = joint(-14 - pose * 16, 70, 262);
  const elbow = joint(58 + pose * 20, 70, 140);
  const wrist = joint(48 + pose * 26, 70, 44);
  return (
    <svg viewBox="0 0 320 320" className={cn("overflow-visible", className)} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#b8c5cf" />
        </linearGradient>
      </defs>
      <rect x="22" y="268" width="96" height="40" rx="10" fill={`url(#${id}-steel)`} />
      <g style={shoulder}>
        <rect x="56" y="140" width="28" height="124" rx="14" fill={`url(#${id}-steel)`} />
        <g style={elbow}>
          <rect x="58" y="44" width="24" height="98" rx="12" fill={steel} />
          <g style={wrist}>
            <rect x="62" y="-6" width="16" height="50" rx="6" fill={`url(#${id}-steel)`} />
            <rect x="58" y="-18" width="24" height="14" rx="4" fill={jointFill} />
            <rect x="68" y="-34" width="4" height="18" fill="#9beaff" />
          </g>
          <circle cx="70" cy="44" r="17" fill={jointFill} />
        </g>
        <circle cx="70" cy="140" r="22" fill={jointFill} />
        <circle cx="70" cy="140" r="9" fill="#4fd8ff" opacity="0.9" />
      </g>
      <circle cx="70" cy="262" r="26" fill={jointFill} />
    </svg>
  );
}

/** Spindle that descends onto the tooth during the finish stage. */
export function Drill({ className, active }: { className?: string; active: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 60 220"
      className={cn("overflow-visible", className)}
      initial={false}
      animate={{ y: active ? 0 : -60, opacity: active ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 16 }}
      aria-hidden
    >
      <rect x="8" y="0" width="44" height="110" rx="10" fill="#dfe6ec" />
      <rect x="14" y="20" width="32" height="6" rx="3" fill="#2b3a47" />
      <rect x="14" y="34" width="32" height="6" rx="3" fill="#2b3a47" />
      <rect x="20" y="110" width="20" height="40" rx="4" fill="#a9b8c4" />
      <rect x="27" y="150" width="6" height="58" fill="#cfd9e1" />
      <circle cx="30" cy="210" r="5" fill="#4fd8ff" />
    </motion.svg>
  );
}

/** Holographic scanning platform — concentric rotating rings with a scan beam. */
export function HoloPlatform({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div className={cn("pointer-events-none", className)} style={{ opacity: intensity }} aria-hidden>
      <div className="absolute inset-x-0 bottom-0 mx-auto aspect-[3/1] w-full [perspective:600px]">
        <div className="absolute inset-0 [transform:rotateX(72deg)]">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-glow/80 shadow-glow" />
          <div className="absolute inset-[9%] animate-spin-slow rounded-full border border-dashed border-cyan-soft/70" />
          <div className="absolute inset-[20%] animate-spin-rev rounded-full border-[3px] border-cyan-glow/60 border-t-transparent" />
          <div className="absolute inset-[32%] rounded-full bg-cyan-glow/25 blur-md" />
          <div className="absolute inset-0 animate-pulse-ring rounded-full border border-cyan-glow/60" />
        </div>
      </div>
    </div>
  );
}
