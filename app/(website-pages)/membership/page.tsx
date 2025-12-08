import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { Membership } from "@/components/sections/membership";
import { ReadyToStart } from "@/components/sections/ready-to-start";
import { FAQ } from "@/components/sections/faq";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Membership | Fortis Sports Trading",
  description:
    "Choose a plan that fits how you trade. Flexible options with full transparency. Upgrade or cancel anytime.",
  openGraph: {
    title: "Membership | Fortis Sports Trading",
    description:
      "Choose a plan that fits how you trade. Flexible options with full transparency. Upgrade or cancel anytime.",
    type: "website",
  },
};

const includedFeatures = [
  {
    title: "Daily Selections",
    description:
      "Posted to your member dashboard before racing begins. Clear, actionable, with all the information you need.",
  },
  {
    title: "Complete Results History",
    description:
      "Access every historical bet since each system went live. Filter, analyse, and verify independently.",
  },
  {
    title: "CSV Downloads",
    description:
      "Export full data sets for your own analysis. Date, Course, Time, Selection, BSP, Result, Lay Points.",
  },
  {
    title: "Performance Dashboard",
    description:
      "Track your portfolio in real-time. Charts, KPIs, and filters to monitor exactly how your systems are performing.",
  },
  {
    title: "Email Support",
    description:
      "Questions about staking, systems, or how to place your bets? We respond to all member enquiries within one working day.",
  },
  {
    title: "Flexible Management",
    description:
      "Upgrade, downgrade, or cancel anytime. Add or remove individual systems as your needs change.",
  },
];

const systemAccessData = [
  {
    system: "System 1",
    single: true,
    allSystems: true,
    annual: true,
  },
  {
    system: "System 2",
    single: "Choose 1",
    allSystems: true,
    annual: true,
  },
  {
    system: "System 3",
    single: false,
    allSystems: true,
    annual: true,
  },
  {
    system: "System 4",
    single: false,
    allSystems: true,
    annual: true,
  },
  {
    system: "System 5",
    single: false,
    allSystems: true,
    annual: true,
  },
];

const membershipFAQItems = [
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle. If you upgrade mid-cycle, you'll be charged a prorated amount for the remainder of the billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee for new members. If you're not satisfied within the first 7 days, contact us for a full refund. After the initial 7 days, refunds are handled on a case-by-case basis.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, as well as PayPal. All payments are processed securely through our payment provider. Annual plans can be paid in full upfront.",
  },
  {
    question: "Can I get a discount for multiple months?",
    answer:
      "Yes, our annual plan offers the best value, saving you £120 per year compared to the monthly 'All Systems' plan. This is equivalent to 4 months free. We don't currently offer other multi-month discounts.",
  },
  {
    question: "How do I cancel my membership?",
    answer:
      "You can cancel your membership at any time from your account dashboard. Cancellations take effect at the end of your current billing period, so you'll continue to have access until then. There are no cancellation fees.",
  },
  {
    question: "Is this suitable for beginners?",
    answer:
      "Yes, our systems are designed to be accessible to traders of all experience levels. We provide clear daily selections with all necessary information, comprehensive documentation, and email support to help you get started. However, you should have a basic understanding of Betfair and lay betting before joining.",
  },
];

export default function MembershipPage() {
  return (
    <>
      {/* Hero Section */}
      <Header
        title="MEMBERSHIP"
        description="Choose a plan that fits how you trade. Flexible options with full transparency. Upgrade or cancel anytime."
      />

      {/* Pricing Plans Section */}
      <Membership />

      {/* What's Included Section */}
      <section className="bg-gray-100 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy text-center mb-12">
              What's Included In Every Plan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-dark-navy mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How System Access Works Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy text-center mb-12">
              How System Access Works
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-dark-navy">
                      System
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-dark-navy">
                      Single (£10/mo)
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-dark-navy">
                      All Systems (£30/mo)
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-dark-navy">
                      Annual (£240/yr)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {systemAccessData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium text-dark-navy">
                        {row.system}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {row.single === true ? (
                          <Check className="w-5 h-5 text-green mx-auto" />
                        ) : row.single === false ? (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-gray-700">{row.single}</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {row.allSystems ? (
                          <Check className="w-5 h-5 text-green mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {row.annual ? (
                          <Check className="w-5 h-5 text-green mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-600 mt-6 text-sm">
              Single System members can choose any one system. You can switch to
              a different system at the start of any billing cycle.
            </p>
          </div>
        </div>
      </section>

      {/* Ready to Start Trading Section */}
      <ReadyToStart
        title="Ready to start trading?"
        description="Join today and get access to proven systems, daily selections, and complete transparency."
        buttonText="Create Account"
        buttonHref="/join"
        guarantees={["7-day money back guarantee", "Cancel anytime"]}
      />

      {/* Membership FAQ Section */}
      <FAQ title="Membership FAQ" items={membershipFAQItems} />
    </>
  );
}
