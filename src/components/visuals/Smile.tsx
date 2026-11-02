import { useId } from "react";
import { cn } from "@/lib/cn";

const UPPER = [
  { x: 52, w: 26, h: 30 },
  { x: 80, w: 30, h: 38 },
  { x: 112, w: 34, h: 46 },
  { x: 148, w: 30, h: 52 },
  { x: 180, w: 40, h: 60 },
  { x: 222, w: 40, h: 60 },
  { x: 264, w: 30, h: 52 },
  { x: 296, w: 34, h: 46 },
  { x: 332, w: 30, h: 38 },
  { x: 364, w: 26, h: 30 },
];

/** Stylised smile with a holographic outline — the reel's "Smile complete" frame. */
export function Smile({ className, outline = true }: { className?: string; outline?: boolean }) {
  const id = useId().replace(/:/g, "");
  const mouth = "M30 88 Q221 40 412 88 Q221 200 30 88 Z";
  return (
    <svg viewBox="0 0 442 200" className={cn("overflow-visible", className)} role="img" aria-label="Restored smile">
      <defs>
        <linearGradient id={`${id}-lip`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7867f" />
          <stop offset="55%" stopColor="#c9544f" />
          <stop offset="100%" stopColor="#9b3433" />
        </linearGradient>
        <linearGradient id={`${id}-tooth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dfe7ee" />
        </linearGradient>
        <clipPath id={`${id}-mouth`}>
          <path d={mouth} />
        </clipPath>
        <filter id={`${id}-glow`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* lips */}
      <path d="M4 86 Q90 18 180 36 Q221 46 262 36 Q352 18 438 86 Q221 60 4 86 Z" fill={`url(#${id}-lip)`} />
      <path d="M4 86 Q221 236 438 86 Q221 196 4 86 Z" fill={`url(#${id}-lip)`} />
      {/* mouth */}
      <path d={mouth} fill="#3a0f14" />
      <g clipPath={`url(#${id}-mouth)`}>
        {UPPER.map((t) => (
          <rect key={`u${t.x}`} x={t.x} y={46} width={t.w} height={t.h} rx={t.w / 3} fill={`url(#${id}-tooth)`} />
        ))}
        {UPPER.slice(1, -1).map((t) => (
          <rect key={`l${t.x}`} x={t.x + 2} y={128 - t.h * 0.2} width={t.w - 4} height={60} rx={t.w / 3} fill={`url(#${id}-tooth)`} opacity="0.92" />
        ))}
        <path d="M30 88 Q221 40 412 88" stroke="#c9544f" strokeWidth="10" fill="none" opacity="0.5" />
      </g>
      <ellipse cx="150" cy="44" rx="70" ry="6" fill="#ffffff" opacity="0.25" />
      {outline && (
        <path
          d="M4 86 Q90 18 180 36 Q221 46 262 36 Q352 18 438 86 Q221 236 4 86 Z"
          fill="none"
          stroke="#9beaff"
          strokeWidth="2.5"
          filter={`url(#${id}-glow)`}
          opacity="0.9"
        />
      )}
    </svg>
  );
}
