import type { Metadata } from "next";
import { CommissionForm } from "@/components/commission/CommissionForm";

export const metadata: Metadata = {
  title: "Get a Commission",
  description:
    "Place your order with Garyfalia Customs — tell us what you want painted onto sneakers or denim in a few quick steps.",
};

export default function CommissionPage() {
  return <CommissionForm />;
}
