import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabHero } from "@/components/lab/LabHero";
import { MotionHero } from "@/components/home/MotionHero";
import { BloomHero } from "@/components/lab/BloomHero";
import { InkSimHero } from "@/components/lab/InkSimHero";
import { LabNext } from "@/components/lab/LabNext";
import { LabBar } from "@/components/lab/LabBar";
import { labVariants, getLabVariant } from "@/data/lab";

export const metadata: Metadata = {
  title: "Hero Lab",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return labVariants.map((v) => ({ variant: v.id }));
}

export default async function LabVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  const current = getLabVariant(variant);
  if (!current) notFound();

  return (
    <>
      {current.id === "inksim" ? (
        <InkSimHero />
      ) : current.id === "bloom" ? (
        <BloomHero />
      ) : current.id === "motion" ? (
        <MotionHero />
      ) : (
        <LabHero variant={current.id} />
      )}
      <LabNext />
      <LabBar current={current} />
    </>
  );
}
