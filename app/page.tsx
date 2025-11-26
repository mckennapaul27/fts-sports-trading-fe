import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PerformanceGlanceWrapper } from "@/components/performance-glance/wrapper";

export default function Home() {
  return (
    <>
      <Hero />
      <PerformanceGlanceWrapper />
      <HowItWorks />
    </>
  );
}
