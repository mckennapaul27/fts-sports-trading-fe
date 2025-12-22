"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SystemSelectionDialog } from "../system-selection-dialog";
import { PRODUCT_IDS, getAllSystemSlugsString } from "@/config/stripe-products";

function CheckmarkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M16.6667 5L7.50004 14.1667L3.33337 10"
        stroke="var(--color-dark-navy)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PricingPlan {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "secondary";
  isPopular?: boolean;
  priceBgColor?: string;
  productId?: string;
  planName?: string;
}

const plans: PricingPlan[] = [
  {
    title: "SINGLE SYSTEM",
    subtitle: "Perfect for testing one system",
    price: "£10",
    period: "/month",
    features: [
      "Access to 1 system",
      "Daily selections",
      "Full results history",
      "Email support",
      "Cancel anytime",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    planName: "Single System",
    // No productId for single system - user will select which system
  },
  {
    title: "ALL SYSTEMS",
    subtitle: "Full portfolio access",
    price: "£30",
    period: "/month",
    features: [
      "Access to all systems",
      "Daily selections for all",
      "Full results history",
      "Priority email support",
      "Cancel anytime",
      "Save £20/month",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "secondary",
    isPopular: true,
    priceBgColor: "bg-gold/20",
    productId: PRODUCT_IDS.ALL_SYSTEMS_MONTHLY,
    planName: "All Systems - Monthly",
  },
  {
    title: "ALL SYSTEMS",
    subtitle: "Best value for committed traders",
    price: "£240",
    period: "/year",
    features: [
      "Access to all systems",
      "Daily selections for all",
      "Full results history",
      "Priority support",
      "Cancel anytime",
      "Save £120/year",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    productId: PRODUCT_IDS.ALL_SYSTEMS_YEARLY,
    planName: "All Systems - Yearly",
  },
];

interface MembershipProps {}

export function Membership({}: MembershipProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const [systemDialogOpen, setSystemDialogOpen] = useState(false);

  const handleChoosePlan = (plan: PricingPlan) => {
    // If it's a single system plan, show the system selection dialog
    if (plan.title === "SINGLE SYSTEM") {
      setSystemDialogOpen(true);
    } else if (plan.productId && plan.planName) {
      // For "All Systems" plans, pass all system slugs
      const allSystemSlugs = getAllSystemSlugsString();

      // Route based on authentication status
      if (isAuthenticated) {
        // Logged in users go to subscribe page
        router.push(
          `/dashboard/subscribe?productId=${
            plan.productId
          }&planName=${encodeURIComponent(
            plan.planName
          )}&systemSlugs=${allSystemSlugs}`
        );
      } else {
        // Not logged in users go to register-and-subscribe
        router.push(
          `/register-and-subscribe?productId=${
            plan.productId
          }&planName=${encodeURIComponent(
            plan.planName
          )}&systemSlugs=${allSystemSlugs}`
        );
      }
    }
  };

  return (
    <>
      <section className="bg-white py-16 sm:py-20 lg:py-24" id="plans">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl     lg:text-4xl font-bold text-dark-navy mb-3">
                Membership
              </h2>
              <p className="text-lg text-dark-navy max-w-2xl mx-auto">
                Choose a plan that fits how you trade. Upgrade or cancel
                anytime.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white border border-gray-200 rounded-lg  p-6 sm:p-8 flex flex-col relative ${
                    plan.isPopular ? "shadow-xl" : "shadow-sm"
                  }`}
                >
                  {/* Most Popular Banner */}
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-sm text-sm font-bold">
                      Most Popular
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-dark-navy mb-2">
                    {plan.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-600 mb-6">{plan.subtitle}</p>

                  {/* Price */}
                  <div
                    className={`mb-6 pb-6 border-b border-gray-200 ${
                      plan.priceBgColor || ""
                    } -mx-6 sm:-mx-8 px-6 sm:px-8 py-4`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold text-dark-navy">
                        {plan.price}
                      </span>
                      <span className="text-lg text-gray-600">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckmarkIcon />
                        <span className="text-dark-navy">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    variant={plan.buttonVariant}
                    size="lg"
                    className="w-full"
                    onClick={() => handleChoosePlan(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SystemSelectionDialog
        open={systemDialogOpen}
        onOpenChange={setSystemDialogOpen}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
