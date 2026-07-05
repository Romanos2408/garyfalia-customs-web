import { MotionHero } from "@/components/home/MotionHero";
import { FeaturedCommissions } from "@/components/home/FeaturedCommissions";
import { ProcessSection } from "@/components/home/ProcessSection";
import { PricingTiers } from "@/components/home/PricingTiers";
import { GetYourOwn } from "@/components/home/GetYourOwn";

export default function HomePage() {
  return (
    <>
      <MotionHero />
      <FeaturedCommissions />
      <ProcessSection />
      <PricingTiers />
      <GetYourOwn />
    </>
  );
}
