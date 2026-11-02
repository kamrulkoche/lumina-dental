import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { CLINIC, NAV_LINKS, TREATMENTS } from "@/lib/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-steel-300">
      <div className="lab-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            A digital dental lab and clinic under one roof. Scanned, designed, milled and fitted — in a single visit.
          </p>
        </div>
        <FooterCol title="Explore">
          {NAV_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
          <FooterLink href="/book">Book a visit</FooterLink>
        </FooterCol>
        <FooterCol title="Treatments">
          {TREATMENTS.slice(0, 5).map((t) => (
            <FooterLink key={t.slug} href={`/treatments#${t.slug}`}>
              {t.name}
            </FooterLink>
          ))}
        </FooterCol>
        <FooterCol title="Visit">
          <li className="flex gap-2.5 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-cyan-glow" aria-hidden />
            {CLINIC.address}
          </li>
          <li>
            <a href={CLINIC.phoneHref} className="flex gap-2.5 text-sm hover:text-white">
              <Phone className="size-4 text-cyan-glow" aria-hidden /> {CLINIC.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${CLINIC.email}`} className="flex gap-2.5 text-sm hover:text-white">
              <Mail className="size-4 text-cyan-glow" aria-hidden /> {CLINIC.email}
            </a>
          </li>
        </FooterCol>
      </div>
      <div className="relative border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Lumina Dental. All rights reserved.</p>
          <p>{CLINIC.hours}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm transition-colors hover:text-cyan-soft">
        {children}
      </Link>
    </li>
  );
}
