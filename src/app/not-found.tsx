import { ButtonLink } from "@/components/ui/Button";
import { Tooth } from "@/components/visuals/Tooth";

export default function NotFound() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden bg-abyss px-6 text-center">
      <div className="lab-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative">
        <Tooth className="mx-auto w-24 animate-float opacity-80" />
        <p className="mt-6 font-display text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-soft">Error 404</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">Scan found nothing here</h1>
        <p className="mt-3 text-steel-300">The page you&apos;re looking for has moved or never existed.</p>
        <ButtonLink href="/" className="mt-8">
          Back to the lab
        </ButtonLink>
      </div>
    </section>
  );
}
