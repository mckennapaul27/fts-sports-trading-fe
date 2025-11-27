import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PerformanceGlanceWrapper } from "@/components/performance-glance/wrapper";
import { Membership } from "@/components/sections/membership";
import { Systems } from "@/components/sections/systems";
import { CTATransparency } from "@/components/sections/cta-transparency";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";

export default function Home() {
  return (
    <>
      <Hero />
      <PerformanceGlanceWrapper />
      <HowItWorks />
      <Membership />
      <Systems />
      <CTATransparency />
      <NewsletterSignup />
    </>
  );
}
