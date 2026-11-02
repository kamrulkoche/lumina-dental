import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = { title: "Book a visit", description: "Book a free consultation or a same-day treatment at Lumina Dental." };

type Search = { type?: string; treatment?: string; plan?: string };

export default async function BookPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const type = sp.treatment ? "treatment" : sp.type === "treatment" ? "treatment" : "consultation";
  return (
    <>
      <PageHero crumb="Book" eyebrow="Appointments" title="Reserve your lab visit" highlight="lab" body="Free 20-minute consultations, or book a treatment straight away. We'll confirm by email within the hour." />
      <section className="bg-mist py-16 text-ink sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <BookingForm initial={{ type, treatment: sp.treatment ?? "", plan: sp.plan ?? "" }} />
        </div>
      </section>
    </>
  );
}
