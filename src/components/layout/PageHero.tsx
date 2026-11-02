import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { RevealText, Reveal } from "@/components/ui/Reveal";

/** Dark lab-grid banner used at the top of every inner page, so they share the home page's identity. */
export function PageHero({ eyebrow, title, highlight, body, crumb }: { eyebrow: string; title: string; highlight?: string; body: string; crumb: string }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#12304d_0%,#081627_60%,#050d18_100%)] pb-20 pt-36 sm:pt-40">
      <div className="lab-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_20%,black,transparent_70%)]" aria-hidden />
      <div className="absolute left-1/2 top-24 size-[36rem] -translate-x-1/2 rounded-full bg-cyan-glow/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-6">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6 inline-flex items-center gap-1.5 text-xs text-steel-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-white">{crumb}</span>
          </nav>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-soft">{eyebrow}</p>
        </Reveal>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold uppercase leading-[1.02] text-white">
          <RevealText text={title} highlight={highlight} animateOn="mount" delay={0.1} />
        </h1>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-5 max-w-xl text-steel-300">{body}</p>
        </Reveal>
      </div>
    </section>
  );
}
