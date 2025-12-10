"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect after 10 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/dashboard");
    }
  }, [countdown, router]);

  return (
    <>
      <Header
        title="Payment Successful"
        description="Your subscription has been activated. Welcome to Fortis Sports Trading!"
      />
      <section className="bg-cream py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 sm:p-10 shadow-sm text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>

              {/* Success Message */}
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
                Payment Completed Successfully!
              </h2>
              <p className="text-dark-navy/70 mb-6 text-lg">
                Your subscription is now active. You can access all your
                subscribed systems and start receiving daily selections.
              </p>

              {/* Session ID (for debugging, can be removed in production) */}
              {/* {sessionId && (
                <p className="text-sm text-gray-500 mb-8">
                  Session ID: {sessionId}
                </p>
              )} */}

              {/* Redirect Info */}
              <div className="bg-cream rounded-lg p-4 mb-8">
                <p className="text-dark-navy/70 text-sm">
                  Redirecting to your dashboard in {countdown} second
                  {countdown !== 1 ? "s" : ""}...
                </p>
              </div>

              {/* CTA Button */}
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header
            title="Payment Successful"
            description="Your subscription has been activated. Welcome to Fortis Sports Trading!"
          />
          <section className="bg-cream py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-6 sm:px-8 xl:px-12">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-8 sm:p-10 shadow-sm text-center">
                  <p className="text-dark-navy">Loading...</p>
                </div>
              </div>
            </div>
          </section>
        </>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
