"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import {
  Calendar,
  CreditCard,
  Clock,
  Download,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ClimbingBoxLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SystemSelectionDialogForChange } from "@/components/sections/system-selection-dialog-for-change";

interface BillingData {
  hasSubscription: boolean;
  currentPlan: {
    name: string;
    status: string;
    description: string;
    price: string;
    currency: string;
    period: string;
    nextBillingDate: string | null;
    productId: string;
    priceId: string;
    stripeSubscriptionId?: string;
    cancelAtPeriodEnd?: boolean;
    cancelAt?: string | null;
    canceledAt?: string | null;
  } | null;
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  memberSince: string;
  billingHistory: Array<{
    id: string;
    date: string;
    description: string;
    amount: string;
    currency: string;
    status: string;
    invoiceUrl: string;
  }>;
}

// Fetcher function for SWR
const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("Failed to fetch billing data");
    throw error;
  }

  return response.json();
};

export default function BillingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const billingUrl = session?.accessToken
    ? `${apiUrl}/api/users/billing`
    : null;

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [planChangeDialogOpen, setPlanChangeDialogOpen] = useState(false);
  const [systemSelectionDialogOpen, setSystemSelectionDialogOpen] =
    useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<{
    productId: string;
    priceId: string;
    planName: string;
    systemSlugs?: string[];
  } | null>(null);

  // Use SWR with caching - revalidate on focus disabled, cache for 5 minutes
  const {
    data: billingData,
    error,
    isLoading,
    mutate,
  } = useSWR<BillingData>(
    billingUrl ? [billingUrl, session?.accessToken] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
    {
      revalidateOnFocus: false, // Don't refetch when tab regains focus
      revalidateOnReconnect: true, // Refetch when internet reconnects
      dedupingInterval: 300000, // Cache for 5 minutes (300000ms)
      onError: (err: Error) => {
        toast.error("Failed to load billing information");
        console.error("Billing data error:", err);
      },
    }
  );

  const handleCancelSubscription = async () => {
    if (
      !session?.accessToken ||
      !billingData?.currentPlan?.stripeSubscriptionId
    ) {
      toast.error("Subscription information not available");
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/cancel-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          stripeSubscriptionId: billingData.currentPlan.stripeSubscriptionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Failed to cancel subscription. Please try again."
        );
      }

      toast.success("Subscription cancelled successfully");
      setCancelDialogOpen(false);
      // Revalidate the billing data to show updated status
      mutate();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    } finally {
      setIsCanceling(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (
      !session?.accessToken ||
      !billingData?.currentPlan?.stripeSubscriptionId
    ) {
      toast.error("Subscription information not available");
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/resume-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          stripeSubscriptionId: billingData.currentPlan.stripeSubscriptionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Failed to resume subscription. Please try again."
        );
      }

      toast.success("Subscription resumed successfully");
      // Revalidate the billing data to show updated status
      mutate();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to resume subscription"
      );
    } finally {
      setIsCanceling(false);
    }
  };

  const handleUpdateCard = async () => {
    if (!session?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/users/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Failed to create portal session. Please try again."
        );
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve portal URL.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to open payment portal"
      );
      setIsCanceling(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format currency helper
  const formatCurrency = (amount: string, currency: string = "GBP") => {
    const symbol = currency === "GBP" ? "£" : currency;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  // Format payment method
  const formatPaymentMethod = (pm: BillingData["paymentMethod"]) => {
    if (!pm) return "No payment method";
    const brand = pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1);
    return `${brand} ending in ${pm.last4}`;
  };

  // Format expiry date
  const formatExpiry = (pm: BillingData["paymentMethod"]) => {
    if (!pm) return "";
    return `${pm.expMonth.toString().padStart(2, "0")}/${pm.expYear}`;
  };

  // Determine which plan is current
  const getCurrentPlanProductId = () => {
    return billingData?.currentPlan?.productId;
  };

  // Plan definitions with product IDs and price IDs
  const planDefinitions = [
    {
      title: "SINGLE SYSTEM",
      subtitle: "Perfect for testing one system",
      price: "£10",
      period: "/month",
      productIds: [
        "prod_TZZbjLqthXdjxx", // System 1
        "prod_TZZcUfjAmtJfkg", // System 2
        "prod_TZZcuPVww3QyDm", // System 3
      ],
      priceIds: [
        "price_1ScQSYDVmAeT8ZSFgfBMGFRe", // System 1
        "price_1ScQSrDVmAeT8ZSFY0xxaGFU", // System 2
        "price_1ScQT6DVmAeT8ZSFpyIFhcQF", // System 3
      ],
      features: [
        "Access to 1 system",
        "Daily selections",
        "Full results history",
        "Email support",
        "Cancel anytime",
      ],
      buttonVariant: "outline" as const,
      requiresSystemSelection: true,
    },
    {
      title: "ALL SYSTEMS",
      subtitle: "Full portfolio access",
      price: "£30",
      period: "/month",
      productId: "prod_TZZcEMlv2cNNWl",
      priceId: "price_1ScQTNDVmAeT8ZSF5C6eupMx",
      features: [
        "Access to all systems",
        "Daily selections for all",
        "Full results history",
        "Priority email support",
        "Cancel anytime",
        "Save £20/month",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      requiresSystemSelection: false,
    },
    {
      title: "ALL SYSTEMS",
      subtitle: "Best value for committed traders",
      price: "£240",
      period: "/year",
      productId: "prod_TZZdcgHBZ13uZ9",
      priceId: "price_1ScQTkDVmAeT8ZSFCjHUdkvO",
      features: [
        "Access to all systems",
        "Daily selections for all",
        "Full results history",
        "Priority support",
        "Cancel anytime",
        "Save £120/year",
      ],
      buttonVariant: "default" as const,
      requiresSystemSelection: false,
    },
  ];

  // Determine if plan is current
  const isCurrentPlan = (plan: (typeof planDefinitions)[0]) => {
    const currentProductId = getCurrentPlanProductId();
    if (!currentProductId) return false;

    if (plan.productId) {
      return plan.productId === currentProductId;
    }
    if (plan.productIds) {
      return plan.productIds.includes(currentProductId);
    }
    return false;
  };

  // Determine if plan change is upgrade or downgrade
  const isUpgrade = (newPlan: (typeof planDefinitions)[0]) => {
    const currentProductId = getCurrentPlanProductId();
    if (!currentProductId) return false;

    // If moving to All Systems Yearly, it's always an upgrade
    if (newPlan.productId === "prod_TZZdcgHBZ13uZ9") {
      return true;
    }

    // If moving to All Systems Monthly from Single System, it's an upgrade
    if (newPlan.productId === "prod_TZZcEMlv2cNNWl") {
      const singleSystemProductIds = [
        "prod_TZZbjLqthXdjxx",
        "prod_TZZcUfjAmtJfkg",
        "prod_TZZcuPVww3QyDm",
      ];
      return singleSystemProductIds.includes(currentProductId);
    }

    // Moving to Single System is always a downgrade
    return false;
  };

  // Get button text for a plan based on current subscription
  const getPlanButtonText = (plan: (typeof planDefinitions)[0]) => {
    // If user has no subscription, all buttons should say "Choose Plan"
    if (!billingData?.hasSubscription || !billingData?.currentPlan) {
      return "Choose Plan";
    }

    if (isCurrentPlan(plan)) {
      return "Current Plan";
    }

    const currentProductId = getCurrentPlanProductId();
    if (!currentProductId) {
      // No current plan, show default text
      if (plan.productId === "prod_TZZdcgHBZ13uZ9") {
        return "Upgrade & Save";
      }
      if (plan.productId === "prod_TZZcEMlv2cNNWl") {
        return "Upgrade";
      }
      return "Select";
    }

    // Single System plan
    if (plan.requiresSystemSelection) {
      // Check if already on a single system
      const singleSystemProductIds = [
        "prod_TZZbjLqthXdjxx",
        "prod_TZZcUfjAmtJfkg",
        "prod_TZZcuPVww3QyDm",
      ];
      if (singleSystemProductIds.includes(currentProductId)) {
        return "Switch System";
      }
      return "Downgrade";
    }

    // All Systems Monthly
    if (plan.productId === "prod_TZZcEMlv2cNNWl") {
      if (currentProductId === "prod_TZZdcgHBZ13uZ9") {
        return "Downgrade";
      }
      return "Upgrade";
    }

    // All Systems Yearly
    if (plan.productId === "prod_TZZdcgHBZ13uZ9") {
      return "Upgrade & Save";
    }

    return "Select";
  };

  // Handle plan button click
  const handlePlanChange = (plan: (typeof planDefinitions)[0]) => {
    if (isCurrentPlan(plan)) return;

    // If user has no subscription, route to subscribe page (like membership.tsx)
    if (!billingData?.hasSubscription || !billingData?.currentPlan) {
      // If it's a single system plan, show the system selection dialog
      if (plan.requiresSystemSelection) {
        setSelectedNewPlan({
          productId: "", // Will be set after system selection
          priceId: "", // Will be set after system selection
          planName: "Single System",
        });
        setSystemSelectionDialogOpen(true);
      } else if (plan.productId) {
        // For "All Systems" plans, pass all three system slugs
        const allSystemSlugs = "system-1,system-2,system-3";
        router.push(
          `/dashboard/subscribe?productId=${
            plan.productId
          }&planName=${encodeURIComponent(
            plan.title
          )}&systemSlugs=${allSystemSlugs}`
        );
      }
      return;
    }

    // User has subscription - handle upgrade/downgrade
    // If downgrading to single system, show system selection first
    if (plan.requiresSystemSelection) {
      setSelectedNewPlan({
        productId: "", // Will be set after system selection
        priceId: "", // Will be set after system selection
        planName: "Single System",
      });
      setSystemSelectionDialogOpen(true);
    } else {
      // For upgrades or downgrades to All Systems, show confirmation directly
      const allSystemSlugs = ["system-1", "system-2", "system-3"];
      setSelectedNewPlan({
        productId: plan.productId!,
        priceId: plan.priceId!,
        planName: plan.title,
        systemSlugs: allSystemSlugs,
      });
      setPlanChangeDialogOpen(true);
    }
  };

  // Handle system selection for downgrade or new subscription
  const handleSystemSelected = (system: {
    id: string;
    name: string;
    slug: string;
    productId: string;
  }) => {
    // If user has no subscription, route to subscribe page
    if (!billingData?.hasSubscription || !billingData?.currentPlan) {
      router.push(
        `/dashboard/subscribe?productId=${system.productId}&planName=Single System&systemSlugs=${system.slug}`
      );
      setSystemSelectionDialogOpen(false);
      return;
    }

    // User has subscription - handle downgrade/switch
    // Find the corresponding price ID
    const systemIndex = planDefinitions[0].productIds!.indexOf(
      system.productId
    );
    const priceId = planDefinitions[0].priceIds![systemIndex];

    setSelectedNewPlan({
      productId: system.productId,
      priceId: priceId,
      planName: "Single System",
      systemSlugs: [system.slug],
    });
    setSystemSelectionDialogOpen(false);
    setPlanChangeDialogOpen(true);
  };

  // Handle plan change confirmation
  const handleConfirmPlanChange = async () => {
    if (
      !session?.accessToken ||
      !billingData?.currentPlan?.stripeSubscriptionId ||
      !selectedNewPlan
    ) {
      toast.error("Subscription information not available");
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch(`${apiUrl}/api/users/change-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          stripeSubscriptionId: billingData.currentPlan.stripeSubscriptionId,
          newProductId: selectedNewPlan.productId,
          newPriceId: selectedNewPlan.priceId,
          systemSlugs: selectedNewPlan.systemSlugs || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Failed to change subscription. Please try again."
        );
      }

      const isUpgradeChange = isUpgrade(
        planDefinitions.find(
          (p) => p.productId === selectedNewPlan.productId
        ) || planDefinitions[0]
      );

      toast.success(
        isUpgradeChange
          ? "Subscription upgraded successfully!"
          : "Subscription change scheduled successfully!"
      );
      setPlanChangeDialogOpen(false);
      setSelectedNewPlan(null);
      // Revalidate the billing data to show updated status
      mutate();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change subscription"
      );
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <ClimbingBoxLoader color="#37744e" />
          <p className="text-dark-navy/70">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">
            Failed to load billing information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return null;
  }

  const currentPlan = billingData.currentPlan;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-dark-navy font-heading mb-2">
          Billing & Subscriptions
        </h1>
        <p className="text-dark-navy/70 text-lg">
          Manage your subscription, payment method, and billing history.
        </p>
      </div>

      {/* Current Plan Section */}
      {billingData.hasSubscription && currentPlan ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-dark-navy mb-4">
            Current Plan
          </h2>
          <div className="border-2 border-gold rounded-lg p-6 bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-dark-navy">
                    {currentPlan.name}
                  </h3>
                  {currentPlan.cancelAtPeriodEnd ? (
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                      Cancelling
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green text-white text-sm font-semibold rounded-full">
                      {currentPlan.status.charAt(0).toUpperCase() +
                        currentPlan.status.slice(1)}
                    </span>
                  )}
                </div>
                {currentPlan.cancelAtPeriodEnd && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg inline-block">
                    <p className="text-sm text-red-800">
                      <strong>
                        Subscription will cancel on{" "}
                        {currentPlan.cancelAt
                          ? formatDate(currentPlan.cancelAt)
                          : currentPlan.nextBillingDate
                          ? formatDate(currentPlan.nextBillingDate)
                          : "end of billing period"}
                        .
                      </strong>{" "}
                      You&apos;ll continue to have access until then.
                    </p>
                  </div>
                )}
                <p className="text-dark-navy/70 mb-3">
                  {currentPlan.description}
                </p>
                <p className="text-2xl font-bold text-dark-navy">
                  {formatCurrency(currentPlan.price, currentPlan.currency)}{" "}
                  <span className="text-lg font-normal">
                    per {currentPlan.period}
                  </span>
                </p>
              </div>
              {/* Action Buttons - Top Right */}
              <div className="flex flex-col gap-2 ml-4 items-center">
                {currentPlan.cancelAtPeriodEnd ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="whitespace-nowrap"
                    onClick={handleResumeSubscription}
                    disabled={isCanceling}
                  >
                    {isCanceling ? "Resuming..." : "Resume Subscription"}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="whitespace-nowrap"
                      onClick={() => setCancelDialogOpen(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Info Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-teal" />
                </div>
                <div>
                  {currentPlan.cancelAtPeriodEnd ? (
                    <>
                      <p className="text-sm text-dark-navy/60 mb-1">
                        Cancels on
                      </p>
                      <p className="text-dark-navy font-semibold">
                        {currentPlan.cancelAt
                          ? formatDate(currentPlan.cancelAt)
                          : currentPlan.nextBillingDate
                          ? formatDate(currentPlan.nextBillingDate)
                          : "N/A"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-dark-navy/60 mb-1">
                        Next billing date
                      </p>
                      <p className="text-dark-navy font-semibold">
                        {currentPlan.nextBillingDate
                          ? formatDate(currentPlan.nextBillingDate)
                          : "N/A"}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-sm text-dark-navy/60 mb-1">
                    Payment method
                  </p>
                  <p className="text-dark-navy font-semibold">
                    {billingData.paymentMethod
                      ? `.... ${billingData.paymentMethod.last4}`
                      : "No payment method"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green" />
                </div>
                <div>
                  <p className="text-sm text-dark-navy/60 mb-1">Member since</p>
                  <p className="text-dark-navy font-semibold">
                    {formatDate(billingData.memberSince)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="text-center py-8">
            <p className="text-dark-navy/70 mb-4">
              You don&apos;t have an active subscription.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/membership">View Plans</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Available Plans Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-dark-navy mb-6">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planDefinitions.map((plan, index) => {
            const isCurrent = isCurrentPlan(plan);
            return (
              <div
                key={index}
                className={`bg-white border rounded-lg p-6 flex flex-col relative ${
                  isCurrent ? "border-gold shadow-md" : "border-gray-200"
                }`}
              >
                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark-navy px-4 py-1 rounded-sm text-sm font-bold">
                    Current Plan
                  </div>
                )}

                {/* Plan Title */}
                <h3 className="text-xl font-bold text-dark-navy mb-1">
                  {plan.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-dark-navy">
                      {plan.price}
                    </span>
                    <span className="text-lg text-gray-600">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                      <span className="text-dark-navy text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  variant={
                    !billingData?.hasSubscription || !billingData?.currentPlan
                      ? "secondary"
                      : plan.buttonVariant
                  }
                  size="lg"
                  className={`w-full ${
                    !billingData?.hasSubscription || !billingData?.currentPlan
                      ? "bg-gold text-dark-navy hover:bg-gold/90"
                      : ""
                  }`}
                  disabled={isCurrent || isCanceling}
                  onClick={() => handlePlanChange(plan)}
                >
                  {getPlanButtonText(plan)}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method Section */}
      {billingData.hasSubscription && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-dark-navy mb-4">
            Payment Method
          </h2>
          {billingData.paymentMethod ? (
            <div className="bg-cream rounded-lg p-6 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-dark-navy font-semibold">
                    {formatPaymentMethod(billingData.paymentMethod)}
                  </p>
                  <p className="text-dark-navy/70 text-sm">
                    Expires {formatExpiry(billingData.paymentMethod)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={handleUpdateCard}
                disabled={isCanceling}
              >
                {isCanceling ? "Loading..." : "Update Card"}
              </Button>
            </div>
          ) : (
            <div className="bg-cream rounded-lg p-6 border border-gray-200">
              <p className="text-dark-navy/70 mb-4">
                No payment method on file.
              </p>
              <Button variant="outline" size="lg">
                Add Payment Method
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Billing History Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-dark-navy mb-4">
          Billing History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-dark-navy text-white">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Amount
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {billingData && billingData.billingHistory.length > 0 ? (
                billingData.billingHistory
                  // Filter out zero-amount proration credits (unused time credits)
                  .filter(
                    (item: BillingData["billingHistory"][0]) =>
                      parseFloat(item.amount) !== 0 ||
                      !item.description.toLowerCase().includes("unused time")
                  )
                  .map((item: BillingData["billingHistory"][0]) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-dark-navy">
                        {formatDate(item.date)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-dark-navy">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-dark-navy font-semibold">
                        {formatCurrency(item.amount, item.currency)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className="px-3 py-1 bg-green text-white text-sm font-semibold rounded-full inline-block">
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {item.invoiceUrl ? (
                          <a
                            href={item.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy hover:text-gold font-semibold flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        ) : (
                          <span className="text-dark-navy/50">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border border-gray-300 px-4 py-8 text-center text-dark-navy/70"
                  >
                    No billing history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Information Section */}
      <div className="bg-cream rounded-lg border border-gold/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-dark-navy" />
          <h2 className="text-xl font-bold text-dark-navy font-heading">
            Subscription Information
          </h2>
        </div>
        <ul className="space-y-2 text-dark-navy list-disc list-inside ml-2">
          <li>You can cancel your subscription at any time</li>
          <li>
            Your access continues until the end of the current billing period
          </li>
          <li>Plan changes take effect on your next billing date</li>
          <li>All payments are processed securely through Stripe</li>
        </ul>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <DialogTitle className="text-dark-navy">
                Cancel Subscription
              </DialogTitle>
            </div>
            <DialogDescription className="text-dark-navy/70 pt-2">
              Are you sure you want to cancel your subscription? Your access
              will continue until the end of your current billing period.
              {currentPlan?.nextBillingDate && (
                <span className="block mt-2 font-semibold text-dark-navy">
                  Your subscription will end on{" "}
                  {formatDate(currentPlan.nextBillingDate)}.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCanceling}
              className="w-full sm:w-auto"
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCanceling}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white"
            >
              {isCanceling ? "Cancelling..." : "Yes, Cancel Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Change Confirmation Dialog */}
      <Dialog
        open={planChangeDialogOpen}
        onOpenChange={setPlanChangeDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-dark-navy">
              {selectedNewPlan &&
              isUpgrade(
                planDefinitions.find(
                  (p) => p.productId === selectedNewPlan.productId
                ) || planDefinitions[0]
              )
                ? "Upgrade Subscription"
                : "Change Subscription Plan"}
            </DialogTitle>
            <DialogDescription className="text-dark-navy/70">
              {selectedNewPlan &&
              isUpgrade(
                planDefinitions.find(
                  (p) => p.productId === selectedNewPlan.productId
                ) || planDefinitions[0]
              )
                ? "Your subscription will be upgraded immediately. You'll be charged a prorated amount for the difference."
                : "Your subscription change will take effect at the start of your next billing cycle."}
            </DialogDescription>
          </DialogHeader>
          {selectedNewPlan && currentPlan && (
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-dark-navy/60">Current Plan</p>
                  <p className="font-semibold text-dark-navy">
                    {currentPlan.name}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-navy/40" />
                <div>
                  <p className="text-sm text-dark-navy/60">New Plan</p>
                  <p className="font-semibold text-dark-navy">
                    {selectedNewPlan.planName}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPlanChangeDialogOpen(false);
                setSelectedNewPlan(null);
              }}
              disabled={isCanceling}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleConfirmPlanChange}
              disabled={isCanceling}
              className="w-full sm:w-auto"
            >
              {isCanceling
                ? "Processing..."
                : selectedNewPlan &&
                  isUpgrade(
                    planDefinitions.find(
                      (p) => p.productId === selectedNewPlan.productId
                    ) || planDefinitions[0]
                  )
                ? "Confirm Upgrade"
                : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Selection Dialog for Downgrade */}
      <SystemSelectionDialogForChange
        open={systemSelectionDialogOpen}
        onOpenChange={setSystemSelectionDialogOpen}
        onSystemSelected={handleSystemSelected}
      />
    </div>
  );
}
