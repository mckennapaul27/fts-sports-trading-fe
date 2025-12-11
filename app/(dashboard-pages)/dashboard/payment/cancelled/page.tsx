"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-10 shadow-sm">
        {/* Info Icon */}
        <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-gold" />
        </div>

        {/* Main Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
            Payment Cancelled
          </h2>
          <p className="text-dark-navy/70 mb-4 text-lg">
            The payment process was not completed.
          </p>
          <p className="text-dark-navy/70 text-lg">
            Don&apos;t worry - you can try again anytime from your dashboard.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-cream rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-dark-navy mb-4 flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            What happens next?
          </h3>
          <ul className="space-y-3 text-left text-dark-navy/70">
            <li className="flex items-start gap-3">
              <span className="text-gold font-bold mt-1">•</span>
              <span>
                Your account remains active - no changes have been made
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold font-bold mt-1">•</span>
              <span>
                You can retry subscribing from the dashboard or billing page
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

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto bg-gold text-dark-navy hover:bg-gold/90"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push("/dashboard/billings")}
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
}
