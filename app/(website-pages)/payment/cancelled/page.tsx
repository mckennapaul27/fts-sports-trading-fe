"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, CreditCard } from "lucide-react";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <>
      <Header
        title="Payment Cancelled"
        description="Your account has been created. Complete your subscription to get started."
      />
      <section className="bg-cream py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 sm:p-10 shadow-sm">
              {/* Info Icon */}
              <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-gold" />
              </div>

              {/* Main Message */}
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
                  Account Created Successfully
                </h2>
                <p className="text-dark-navy/70 mb-4 text-lg">
                  Your account has been created, but the payment process was not
                  completed.
                </p>
                <p className="text-dark-navy/70 text-lg">
                  Don&apos;t worry - you can complete your subscription anytime
                  from your dashboard.
                </p>
              </div>

              {/* What Happens Next */}
              <div className="bg-cream rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-dark-navy mb-4 flex flex-col sm:flex-row items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  What happens next?
                </h3>
                <ul className="space-y-3 text-left text-dark-navy/70">
                  <li className="flex items-start gap-3">
                    <span className="text-gold font-bold mt-1">•</span>
                    <span>
                      Your account is ready - you can log in and access your
                      dashboard
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold font-bold mt-1">•</span>
                    <span>
                      Complete your subscription from the dashboard to activate
                      your plan
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold font-bold mt-1">•</span>
                    <span>
                      Once subscribed, you&apos;ll have immediate access to your
                      selected systems
                    </span>
                  </li>
                </ul>
              </div>

              {/* Redirect Info */}
              {/* <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 text-center">
                <p className="text-dark-navy/70 text-sm">
                  Redirecting to your dashboard in {countdown} second
                  {countdown !== 1 ? "s" : ""}...
                </p>
              </div> */}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/membership")}
                >
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
