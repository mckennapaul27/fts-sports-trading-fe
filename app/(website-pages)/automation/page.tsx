import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { AutomationSignup } from "@/components/sections/automation-signup";
import { Button } from "@/components/ui/button";
import { Check, Zap, Clock, Shield } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Automation | Fortis Sports Trading",
  description:
    "Automated betting bot coming soon. Place bets automatically using our proven systems without manual intervention.",
  openGraph: {
    title: "Automation | Fortis Sports Trading",
    description:
      "Automated betting bot coming soon. Place bets automatically using our proven systems without manual intervention.",
    type: "website",
  },
};

export default function AutomationPage() {
  return (
    <>
      {/* Hero Section */}
      <Header
        title="Automated Betting Bot"
        description="Take advantage of our proven track record without manual intervention. **COMING SOON**"
      />

      {/* Coming Soon Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
                Automation in Development
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're actively working on an automated betting bot that will
                place bets automatically for you based on our proven systems.
                Instead of subscribing to our systems and placing bets manually,
                you'll be able to opt in and have all bets placed automatically,
                allowing you to take full advantage of our track record without
                having to do anything manually.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Zap className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark-navy mb-2">
                      Fully Automated
                    </h3>
                    <p className="text-gray-700">
                      Once configured, the bot will place all bets automatically
                      based on our system selections. No manual intervention
                      required.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="w-6 h-6 text-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark-navy mb-2">
                      Proven Systems
                    </h3>
                    <p className="text-gray-700">
                      Built on our transparent, publicly-tracked systems with
                      years of proven results. The same edge, automated.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark-navy mb-2">
                      Never Miss a Bet
                    </h3>
                    <p className="text-gray-700">
                      Automated execution means you'll never miss a selection
                      due to timing, availability, or human error.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark-navy mb-2">
                      Same Transparency
                    </h3>
                    <p className="text-gray-700">
                      All automated bets will be tracked and published with the
                      same transparency as our manual systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* xCloudBot Recommendation Section */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 sm:p-10 shadow-sm border border-gray-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-dark-navy mb-4">
                  Recommended Solution
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Until we have developed our own betting bot, we recommend
                  using{" "}
                  <a
                    href="https://xcloudbot.co.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:text-gold font-semibold transition-colors"
                  >
                    xCloudBot
                  </a>
                  , a cloud-based Betfair betting bot that runs 24/7 on their
                  servers.
                </p>
                <p className="text-gray-700 mb-8">
                  xCloudBot is available for just{" "}
                  <span className="font-bold text-dark-navy">
                    £20 per month
                  </span>{" "}
                  and requires no software installation or computer to be left
                  running. It's a great interim solution while we develop our
                  own automation platform.
                </p>
                <Button variant="default" asChild>
                  <Link
                    href="https://xcloudbot.co.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit xCloudBot
                  </Link>
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-dark-navy mb-4">
                  Why xCloudBot?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      100% cloud-based - no software to download or computer to
                      leave running
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Access from any device - PC, Mac, iPhone, Android, iPad
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Runs 24/7 on their secure servers - never misses a bet
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Affordable pricing at just £20 per month
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <AutomationSignup />
    </>
  );
}
