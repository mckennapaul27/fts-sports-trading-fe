import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { Systems } from "@/components/sections/systems";
import { CTAAlt } from "@/components/sections/cta-alt";

export const metadata: Metadata = {
  title: "Our Trading Systems | Fortis Sports Trading",
  description:
    "Ten carefully designed trading systems, each with its own methodology and edge. Three active systems are available now, with seven more launching throughout 2025.",
  openGraph: {
    title: "Our Trading Systems | Fortis Sports Trading",
    description:
      "Ten carefully designed trading systems, each with its own methodology and edge. Three active systems are available now, with seven more launching throughout 2025.",
    type: "website",
  },
};

export default function SystemsPage() {
  return (
    <>
      <Header
        title="OUR SYSTEMS"
        description="Ten carefully designed trading systems, each with its own methodology and edge. Three active systems are available now, with seven more launching throughout 2025."
      />
      <Systems bgColor="bg-white" />
      <CTAAlt
        title="Get Access to All Systems"
        description="Subscribe to receive daily selections from all active systems, with new systems automatically included as they launch. No additional charges."
        primaryButtonText="View Membership Plans"
        primaryButtonHref="/membership"
        secondaryButtonText="View Results"
        secondaryButtonHref="/results"
      />
    </>
  );
}
