import type { Metadata } from "next";
import Image from "next/image";
import { HeroAlt } from "@/components/sections/hero-alt";
import { OurStory } from "@/components/sections/our-story";
import { CTAAlt } from "@/components/sections/cta-alt";
import { Shield, TrendingUp, Eye, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Fortis Sports Trading",
  description:
    "Building trust through transparency and discipline. We help traders move from emotion-based betting to data-driven strategy.",
  openGraph: {
    title: "About Us | Fortis Sports Trading",
    description:
      "Building trust through transparency and discipline. We help traders move from emotion-based betting to data-driven strategy.",
    type: "website",
  },
};

const statistics = [
  {
    value: "3+ Years",
    label: "Live Trading",
  },
  {
    value: "10 Systems",
    label: "Portfolio",
  },
  {
    value: "2,800+ Bets",
    label: "Tracked",
  },
  {
    value: "100%",
    label: "Transparent",
  },
];

const principles = [
  {
    icon: Shield,
    title: "Discipline",
    description:
      "We follow the plan every single day. No deviations based on recent results, market movements, or gut feelings. The edge comes from consistency.",
  },
  {
    icon: TrendingUp,
    title: "Consistency",
    description:
      "Long-term profitability beats short-term wins. Our systems are designed for steady, reliable returns over months and years, not lucky streaks.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every bet is published. Every result is tracked. Complete historical data is available for verification. No hiding, no cherry-picking.",
  },
  {
    icon: Target,
    title: "Professionalism",
    description:
      "Sports trading is treated like a professional operation. Tested systems, tracked results, managed risk - like any serious financial endeavour.",
  },
];

const storyPoints = [
  {
    title: "The Beginning",
    description:
      "Fortis Sports Trading started in 2021 with a simple premise: could lay betting be systematized? Could we remove emotion, follow a repeatable process, and generate consistent returns?",
  },
  {
    title: "Social Sharing",
    description:
      "The first system was shared informally with a small group on Telegram. The results were tracked publicly using BSP. When it worked - when the system generated +100pts in the first month - we didn't get greedy. We stuck to the plan.",
  },
  {
    title: "Learning & Growing",
    description:
      "We learned quickly that short-term results are misleading. After that strong start, we had losing months. Drawdowns tested our discipline. But over time, the edge played out. The portfolio grew. The systems worked.",
  },
  {
    title: "Structured Portfolio Service",
    description:
      "Today, Fortis operates ten independent systems across different selection criteria. We've built a community of traders who value transparency over hype, consistency over big promises, and long-term thinking over quick wins. This isn't a side project anymore - it's a full-time operation with a simple mission: help people trade sports profitably, professionally, and in public.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroAlt
        subtitle="MISSION & ETHOS"
        title="Building Trust Through"
        highlightedText="Transparency & Discipline"
        missionStatement="We help traders move from emotion-based betting to data-driven strategy."
        description="Most people approach sports betting emotionally - chasing tips, following hunches, hoping for the big win. We built Fortis to provide a structured, transparent alternative. We trade systems, not opinions. We publish results, not promises."
      />

      {/* Statistics Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 text-center shadow-sm"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-dark-navy mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Principles Section */}
      <section className="bg-gray-100 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy text-center mb-12">
              Our Principles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {principles.map((principle, index) => {
                const IconComponent = principle.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 sm:p-8 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-teal" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-navy mb-3">
                          {principle.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <OurStory
        title="Our Story"
        imageSrc="/image-chart.png"
        imageAlt="Fortis Sports Trading team at a conference"
        storyPoints={storyPoints}
      />

      {/* Get in Touch CTA Section */}
      <CTAAlt
        title="Get in touch"
        description="Questions about our approach, systems, or membership? Want to know more about how we operate? We'd love to hear from you."
        primaryButtonText="Contact Us"
        primaryButtonHref="/contact"
        secondaryButtonText="View Our Results"
        secondaryButtonHref="/results"
        linkText="View membership plans"
        linkHref="/membership"
      />
    </>
  );
}
