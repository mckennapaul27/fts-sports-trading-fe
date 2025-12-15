import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PerformanceGlanceWrapper } from "@/components/performance-glance/wrapper";
import { MembershipWrapper } from "@/components/sections/membership/wrapper";
import { Systems } from "@/components/sections/systems";
import { CTATransparency } from "@/components/sections/cta-transparency";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { FileSpreadsheet } from "lucide-react";

export const metadata: Metadata = {
  title: "Fortis Sports Trading | Professional Sports Trading Systems",
  description:
    "Transparent, data-driven sports trading systems. Access daily selections, complete results history, and proven strategies for consistent returns.",
  openGraph: {
    title: "Fortis Sports Trading | Professional Sports Trading Systems",
    description:
      "Transparent, data-driven sports trading systems. Access daily selections, complete results history, and proven strategies for consistent returns.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <PerformanceGlanceWrapper />
      <HowItWorks />
      <MembershipWrapper />
      <Systems />
      <CTATransparency
        title="Transparent, Unfiltered Results"
        description="We publish complete results and monthly summaries."
        cardTitle="Results Sheets CSV"
        cardDescription="Download complete CSV's with all historical data"
        buttonText="Go To Results"
        buttonHref="/results"
        icon={FileSpreadsheet}
      />
      <NewsletterSignup />
    </>
  );
}
