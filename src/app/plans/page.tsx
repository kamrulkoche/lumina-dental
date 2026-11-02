import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PlansGrid } from "./PlansGrid";

export const metadata: Metadata = { title: "Plans", description: "Lumina Dental membership plans — preventive care and discounted restorations from $29/month." };

export default function PlansPage() {
  return (
    <>
      <PageHero crumb="Plans" eyebrow="Membership" title="Care plans built like our crowns" highlight="crowns" body="No insurance maze. One monthly fee covers your preventive care and unlocks lab pricing on every treatment." />
      <PlansGrid />
    </>
  );
}
