import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PerformanceGlanceWrapper } from "@/components/performance-glance/wrapper";
import { Membership } from "@/components/sections/membership";
import { Systems } from "@/components/sections/systems";
import { CTATransparency } from "@/components/sections/cta-transparency";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { FileSpreadsheet } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth-helpers";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Hero />
      <PerformanceGlanceWrapper />
      <HowItWorks />
      <Membership isAuthenticated={!!session} />
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
