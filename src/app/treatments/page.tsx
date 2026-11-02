import type { Metadata } from "next";
import { TreatmentCard } from "@/components/home/TreatmentCard";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { LAB_STAGES, TREATMENTS } from "@/lib/content";

export const metadata: Metadata = { title: "Treatments", description: "Same-day crowns, veneers, aligners, implants and whitening — all planned in our digital lab." };

export default function TreatmentsPage() {
  return (
    <>
      <PageHero crumb="Treatments" eyebrow="What we do" title="Planned in pixels, finished by hand" highlight="hand" body="Every treatment runs through the same four-stage lab workflow — so you see the result before it begins." />
      <section className="bg-mist py-20 text-ink">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.map((t) => (
              <StaggerItem key={t.slug}>
                <div id={t.slug} className="h-full scroll-mt-28">
                  <TreatmentCard t={t} href={`/book?treatment=${t.slug}`} />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="bg-cloud py-20 text-ink" aria-labelledby="workflow-h">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <h2 id="workflow-h" className="font-display text-3xl font-extrabold uppercase">
              The lab workflow
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {LAB_STAGES.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 0.08} className="relative rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
                <span className="font-display text-4xl font-extrabold text-cyan-deep/25">0{i + 1}</span>
                <h3 className="mt-3 font-display font-bold uppercase">{s.eyebrow.split(" · ")[1]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
