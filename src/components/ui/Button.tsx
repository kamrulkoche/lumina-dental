import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "cyan" | "ink" | "ghost" | "outline-light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  cyan: "bg-cyan-glow text-navy-950 hover:bg-cyan-soft shadow-[0_0_0_0_rgb(79_216_255/0.6)] hover:shadow-glow",
  ink: "bg-ink text-white hover:bg-navy-800 shadow-card",
  ghost: "glass text-white hover:bg-white/12 hover:border-cyan-soft/50",
  "outline-light": "border border-ink/15 bg-white text-ink hover:border-ink/40",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function ButtonLink({ variant = "cyan", size = "md", className, children, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, VARIANTS[variant], SIZES[size], className)} {...rest}>
      <Shine />
      {children}
    </Link>
  );
}

export function Button({ variant = "cyan", size = "md", className, children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...rest}>
      <Shine />
      {children}
    </button>
  );
}

/** Light sweep across the pill on hover. */
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
    />
  );
}
