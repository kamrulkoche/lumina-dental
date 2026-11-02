import { BookingCta, StatsBand, TreatmentsRow } from "@/components/home/HomeSections";
import { PrecisionHero } from "@/components/home/PrecisionHero";
import { LiveLab } from "@/components/lab/LiveLab";

export default function HomePage() {
  return (
    <>
      <LiveLab />
      <PrecisionHero />
      <TreatmentsRow />
      <StatsBand />
      <BookingCta />
    </>
  );
}
