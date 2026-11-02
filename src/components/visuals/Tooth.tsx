import { useId } from "react";
import { cn } from "@/lib/cn";

type ToothProps = {
  className?: string;
  /** Adds the cyan polish glow the reel shows during the finish stage. */
  glow?: boolean;
};

/** Glossy molar rendered as SVG so it stays crisp at any size and needs no image request. */
export function Tooth({ className, glow = false }: ToothProps) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 240" className={cn("overflow-visible", className)} role="img" aria-label="3D tooth model">
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f1f5f8" />
          <stop offset="80%" stopColor="#c9d6e1" />
          <stop offset="100%" stopColor="#9fb1c1" />
        </radialGradient>
        <linearGradient id={`${id}-root`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9eef3" />
          <stop offset="100%" stopColor="#b7c6d3" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {glow && (
        <path
          d="M40 70 C40 35 60 20 78 28 C88 32 92 38 100 38 C108 38 112 32 122 28 C140 20 160 35 160 70 C160 100 152 116 150 128 L50 128 C48 116 40 100 40 70 Z"
          fill="#4fd8ff"
          opacity="0.55"
          filter={`url(#${id}-glow)`}
        />
      )}
      <path
        d="M40 70 C40 35 60 20 78 28 C88 32 92 38 100 38 C108 38 112 32 122 28 C140 20 160 35 160 70 C160 100 152 118 148 140 C144 165 142 200 132 222 C126 234 114 230 112 214 C110 196 108 172 100 168 C92 172 90 196 88 214 C86 230 74 234 68 222 C58 200 56 165 52 140 C48 118 40 100 40 70 Z"
        fill={`url(#${id}-body)`}
      />
      <path
        d="M52 140 C56 165 58 200 68 222 C74 234 86 230 88 214 C90 196 92 172 100 168 C108 172 110 196 112 214 C114 230 126 234 132 222 C142 200 144 165 148 140 Z"
        fill={`url(#${id}-root)`}
        opacity="0.85"
      />
      <path d="M70 48 C78 56 90 58 100 52 C110 58 122 56 130 48" stroke="#b4c4d2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="74" cy="62" rx="14" ry="22" fill="#ffffff" opacity="0.75" transform="rotate(-18 74 62)" />
      <ellipse cx="128" cy="92" rx="6" ry="16" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}
