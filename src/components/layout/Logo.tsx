import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <Link href="/" aria-label="Lumina Dental — home" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 place-items-center">
        <svg viewBox="0 0 32 32" className="size-8 transition-transform duration-500 group-hover:rotate-[8deg]" aria-hidden>
          <path
            d="M6 11c0-5 4-7 7-5.6 1.4.6 2 1 3 1s1.6-.4 3-1C22 4 26 6 26 11c0 4-1.4 6-2 9-.6 3-.8 7-2.6 8.6-1.2 1-2.4 0-2.6-2-.3-2.4-.6-5-2.8-5s-2.5 2.6-2.8 5c-.2 2-1.4 3-2.6 2C8.8 27 8.6 23 8 20c-.6-3-2-5-2-9Z"
            fill="none"
            stroke="#4fd8ff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute inset-0 rounded-full bg-cyan-glow/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
      </span>
      <span className={cn("font-display text-[15px] tracking-[0.14em]", tone === "light" ? "text-white" : "text-ink")}>
        <span className="font-extrabold">LUMINA</span> <span className="font-medium opacity-80">DENTAL</span>
      </span>
    </Link>
  );
}
