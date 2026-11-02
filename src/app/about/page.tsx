import { ArrowRight, Cpu, HeartHandshake, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { StatsBand } from "@/components/home/HomeSections";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CLINIC } from "@/lib/content";

export const metadata: Metadata = { title: "About Us", description: "Lumina Dental puts a digital dental lab inside the clinic, so restorations are made while you wait." };

const VALUES = [
  { icon: Cpu, title: "Lab inside the clinic", body: "Scanners, CAD design and milling sit down the hall from the chair — no outsourcing, no two-week wait." },
  { icon: ShieldCheck, title: "Measured, not guessed", body: "Every restoration is verified against your scan before fitting. If it isn't within 20 microns, we remake it." },
  { icon: HeartHandshake, title: "Calm by design", body: "Shorter visits, no impression putty, and a screen that shows you exactly what is happening and why." },
];

const TIMELINE = [
  { year: "2014", text: "Founded as a two-chair practice in San Francisco." },
  { year: "2018", text: "Opened our in-house digital lab and first milling unit." },
  { year: "2021", text: "Introduced robotic finishing for same-day crowns." },
  { year: "2025", text: "Passed 12,000 restorations designed and made on site." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero crumb="About Us" eyebrow="Our story" title="A clinic that became a lab" highlight="lab" body="We rebuilt the dental visit around one idea: make the restoration while the patient is still in the chair." />
      <section className="bg-mist py-20 text-ink">
        <Stagger className="mx-auto grid max-w-6xl gap-5 px-5 sm:px-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <StaggerItem key={v.title}>
              <article className="h-full rounded-3xl border border-ink/8 bg-white p-7 shadow-card">
                <span className="grid size-12 place-items-center rounded-2xl bg-ink text-cyan-glow">
                  <v.icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-6 font-display text-lg font-bold uppercase">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <StatsBand />
      <section className="bg-mist py-20 text-ink" aria-labelledby="timeline-h">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <Reveal>
            <h2 id="timeline-h" className="font-display text-3xl font-extrabold uppercase">
              Milestones
            </h2>
          </Reveal>
          <ol className="relative mt-10 border-l border-ink/15 pl-8">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 0.08} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[2.35rem] top-1 size-3 rounded-full border-2 border-mist bg-cyan-deep shadow-glow" aria-hidden />
                <p className="font-display text-sm font-extrabold tracking-widest text-cyan-deep">{t.year}</p>
                <p className="mt-1 text-ink">{t.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-14 rounded-3xl bg-navy-950 p-8 text-white sm:p-10">
            <p className="font-display text-xl font-bold uppercase">Visit the lab</p>
            <p className="mt-2 text-sm text-steel-300">
              {CLINIC.address} · {CLINIC.hours}
            </p>
            <ButtonLink href="/book?type=consultation" className="mt-6">
              Book a lab tour & consultation <ArrowRight className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
