import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { DENTIST_GROUPS, DENTISTS } from "@/lib/content";

export const metadata: Metadata = { title: "Dentists", description: "Meet the Lumina Dental team — restorative, cosmetic and orthodontic specialists." };

export default function DentistsPage() {
  return (
    <>
      <PageHero crumb="Dentists" eyebrow="Our team" title="The hands behind the lab" highlight="lab" body="Specialists who design on screen and finish by hand — every restoration is checked by the dentist who planned it." />
      <div className="bg-mist text-ink">
        {DENTIST_GROUPS.map((g, gi) => (
          <section key={g.id} id={g.id} className="scroll-mt-24 border-b border-ink/8 py-20 last:border-0" aria-labelledby={`${g.id}-h`}>
            <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_2fr]">
              <Reveal>
                <p className="font-display text-xs font-bold tabular-nums tracking-[0.3em] text-cyan-deep">0{gi + 1}</p>
                <h2 id={`${g.id}-h`} className="mt-3 font-display text-3xl font-extrabold uppercase">
                  {g.title}
                </h2>
                <p className="mt-3 max-w-xs text-ink-soft">{g.body}</p>
              </Reveal>
              <Stagger className="grid gap-5 sm:grid-cols-2">
                {DENTISTS.filter((d) => d.group === g.id).map((d) => (
                  <StaggerItem key={d.name}>
                    <article className="group relative overflow-hidden rounded-3xl border border-ink/8 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgb(18_168_214/0.45)]" data-testid="dentist-card">
                      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_30%,#12304d,#050d18)]">
                        <div className="lab-grid absolute inset-0 opacity-70" aria-hidden />
                        <span className="relative grid size-24 place-items-center rounded-full border border-cyan-glow/50 font-display text-2xl font-extrabold text-white shadow-glow transition-transform duration-500 group-hover:scale-110">
                          {d.initials}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold">{d.name}</h3>
                      <p className="text-sm text-ink-soft">{d.role}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-cyan-deep">{d.years} years in practice</p>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        ))}
        <div className="pb-20 text-center">
          <ButtonLink href="/book" variant="ink" size="lg">
            Book with a specialist <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
