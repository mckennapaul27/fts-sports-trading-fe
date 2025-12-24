import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { CTATransparency } from "@/components/sections/cta-transparency";
import { FAQ } from "@/components/sections/faq";
import { Check, Target, Database } from "lucide-react";
import { FileSpreadsheet } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Trading Methodology | Fortis Sports Trading",
  description:
    "A portfolio-first, risk-managed approach for long-term consistency. We trade edges, not emotions.",
  openGraph: {
    title: "Our Trading Methodology | Fortis Sports Trading",
    description:
      "A portfolio-first, risk-managed approach for long-term consistency. We trade edges, not emotions.",
    type: "website",
  },
};

export default function MethodologyPage() {
  const faqItems = [
    {
      question: "How do you select which horses to lay?",
      answer:
        "Our selection process is based on systematic criteria that identify overvalued favourites. Each system has its own specific filters and parameters, which are applied consistently across all selections. We don't make emotional decisions or chase losses - every selection follows the predefined rules of the system.",
    },
    {
      question: "What happens during a losing streak?",
      answer:
        "Losing streaks are an inevitable part of trading, even with a statistical edge. We manage this through strict staking discipline, maximum liability limits, and portfolio diversification. When one system experiences a drawdown, others may be performing well, which helps smooth overall returns. We never deviate from our staking plan, regardless of recent results.",
    },
    {
      question: "Can I track results independently?",
      answer:
        "Absolutely. All our results are published using Betfair Starting Price (BSP), and every historical bet is available for download in CSV format. You can verify every claim, analyze the data yourself, and make an informed decision based on transparent, verifiable information.",
    },
    {
      question: "How much bank do I need?",
      answer:
        "The bank requirement depends on which systems you follow and your risk tolerance. Each system has its own staking plan and maximum liability limits. We recommend having sufficient bankroll to withstand potential drawdowns while maintaining level stakes. As a general guideline, we suggest a minimum bank of 50-100 times your unit stake, though this varies by system and individual risk appetite.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Header
        title="OUR TRADING METHODOLOGY"
        description="A portfolio-first, risk-managed approach for long-term consistency. We trade edges, not emotions."
      />

      {/* Portfolio Diversification Section */}
      <section className="bg-gray-100 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
              Portfolio Diversification
            </h2>
            <p className="text-lg text-gray-700">
              Rather than relying on a single system, we operate a portfolio
              approach. Multiple systems with different selection criteria
              reduce overall volatility and smooth long-term returns.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why diversify? Card */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dark-navy mb-4">
                Why diversify?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    No single system performs perfectly in all market conditions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Drawdowns in one system can be offset by gains in another
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Spreads risk across different selection methodologies
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Creates more stable, predictable long term returns
                  </span>
                </li>
              </ul>
            </div>

            {/* Independent systems Card */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dark-navy mb-4">
                Independent systems
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Selection criteria and filters
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Staking plan and liability limits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Performance tracking and reporting
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Risk management parameters
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Lay Trading Works Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
              Why Lay Trading Works
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Lay betting means betting against an outcome. On Betfair, you act
              as the bookmaker, accepting someone else's back bet. When done
              systematically, this creates a statistical edge.
            </p>
            <p className="text-gray-700">
              The lay advantage in horse racing comes from identifying
              overvalued favourites. Favourites are often overbet due to
              emotional factors, media hype, or public perception. By
              systematically laying these overvalued favourites at the right
              prices, we can achieve consistent profitability over time through
              disciplined staking.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Strike Rate Card */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex md:flex-col lg:flex-row md:items-start lg:items-center gap-3 mb-3">
                <Check className="w-6 h-6 text-green" />
                <h3 className="text-lg font-bold text-dark-navy">
                  High Strike Rate
                </h3>
              </div>
              <p className="text-gray-700">
                Most lay selections lose, meaning we win the bet.
              </p>
            </div>

            {/* Controlled Liability Card */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex md:flex-col lg:flex-row md:items-start lg:items-center gap-3 mb-3">
                <Check className="w-6 h-6 text-green" />
                <h3 className="text-lg font-bold text-dark-navy">
                  Controlled Liability
                </h3>
              </div>
              <p className="text-gray-700">
                We know exactly what we risk on every bet.
              </p>
            </div>

            {/* Edge Over Time Card */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex md:flex-col lg:flex-row md:items-start lg:items-center gap-3 mb-3">
                <Check className="w-6 h-6 text-green" />
                <h3 className="text-lg font-bold text-dark-navy">
                  Edge Over Time
                </h3>
              </div>
              <p className="text-gray-700">
                Small edges compound into significant returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Staking & Risk Discipline Section */}
      <section className="bg-cream py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
              Staking & Risk Discipline
            </h2>
            <p className="text-lg text-gray-700">
              Having an edge is only part of the equation. Proper staking
              ensures you survive variance and compound your returns
              responsibly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Fixed stake approach Card */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dark-navy mb-3">
                Fixed stake approach
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We use level staking across all systems. This removes emotion
                from bet sizing and ensures that a losing streak doesn't
                compound into larger losses. By staking the same amount on every
                selection (within each system), we maintain discipline and allow
                the statistical edge to work over time. This approach also makes
                drawdowns more manageable and predictable.
              </p>
            </div>

            {/* Maximum liability limits Card */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dark-navy mb-3">
                Maximum liability limits
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Each system has a maximum odds threshold. We won't lay any
                selection above this limit, which caps our potential loss on any
                single bet. For example, System 1 operates with a maximum lay
                odds of 20.0, meaning we never risk more than 19 units on a
                single selection. This protects the bankroll during variance and
                ensures we can continue trading through losing runs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification & Transparency Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
              Verification & Transparency
            </h2>
            <p className="text-lg text-gray-700">
              Trust is earned through evidence. That's why we publish every bet,
              every result, and make our data available for independent
              verification.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BSP pricing Card */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <Target className="w-8 h-8 text-teal" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-dark-navy">
                  BSP pricing
                </h3>
              </div>
              <p className="text-gray-700">
                All results use Betfair Starting Price (BSP), eliminating any
                debate about what price was actually available.
              </p>
            </div>

            {/* Complete data access Card */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <Database className="w-8 h-8 text-teal" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-dark-navy">
                  Complete data access
                </h3>
              </div>
              <p className="text-gray-700">
                Every historical bet is available for download in CSV format.
                Analyse it yourself, verify the claims, and make an informed
                decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTATransparency
        title="We Trade Edges, Not Emotions."
        description="This isn't gambling, it's a disciplined, data-driven approach to finding and exploiting market inefficiencies over the long term."
        cardTitle="Results Sheets CSV"
        cardDescription="Download complete CSV's with all historical data"
        buttonText="Go To Results"
        buttonHref="/results"
        icon={FileSpreadsheet}
        bgColor="bg-[#F2F2F2]"
      />

      {/* FAQ Section */}
      <FAQ title="Frequently Asked Questions" items={faqItems} />
    </>
  );
}
