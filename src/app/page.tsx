import { DropletHero } from "@/components/home/DropletHero";
import { FeaturedCommissions } from "@/components/home/FeaturedCommissions";
import { ProcessSection } from "@/components/home/ProcessSection";
import { PricingTiers } from "@/components/home/PricingTiers";
import { GetYourOwn } from "@/components/home/GetYourOwn";

export default function HomePage() {
  return (
    <>
      <DropletHero />
      <FeaturedCommissions />
      <ProcessSection />
      <PricingTiers />
      <GetYourOwn />
    </>
  );
}
