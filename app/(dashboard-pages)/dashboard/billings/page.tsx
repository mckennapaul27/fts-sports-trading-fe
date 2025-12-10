"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar,
  CreditCard,
  Clock,
  Download,
  Info,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

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

export default function BillingsPage() {
  const { data: session } = useSession();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
        const response = await fetch(`${apiUrl}/api/users/billing`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch billing data");
        }

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        setBillingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load billing information");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchBillingData();
    }
  }, [session]);

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

  // Plan definitions with product IDs
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
      features: [
        "Access to 1 system",
        "Daily selections",
        "Full results history",
        "Email support",
        "Cancel anytime",
      ],
      buttonText: "Downgrade",
      buttonVariant: "outline" as const,
    },
    {
      title: "ALL SYSTEMS",
      subtitle: "Full portfolio access",
      price: "£30",
      period: "/month",
      productId: "prod_TZZcEMlv2cNNWl",
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
    },
    {
      title: "ALL SYSTEMS",
      subtitle: "Best value for committed traders",
      price: "£240",
      period: "/year",
      productId: "prod_TZZdcgHBZ13uZ9",
      features: [
        "Access to all systems",
        "Daily selections for all",
        "Full results history",
        "Priority support",
        "Cancel anytime",
        "Save £120/year",
      ],
      buttonText: "Upgrade & Save",
      buttonVariant: "default" as const,
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-dark-navy/70">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (error || !billingData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">
            {error ||
              "Failed to load billing information. Please try again later."}
          </p>
        </div>
      </div>
    );
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
                  <span className="px-3 py-1 bg-green text-white text-sm font-semibold rounded-full">
                    {currentPlan.status.charAt(0).toUpperCase() +
                      currentPlan.status.slice(1)}
                  </span>
                </div>
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
                <Button
                  variant="outline"
                  size="lg"
                  className="whitespace-nowrap"
                >
                  Change Plan
                </Button>
                <button className="text-red-500 hover:text-red-600 font-semibold text-sm text-left cursor-pointer">
                  Cancel Subscription
                </button>
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
                  <p className="text-sm text-dark-navy/60 mb-1">
                    Next billing date
                  </p>
                  <p className="text-dark-navy font-semibold">
                    {currentPlan.nextBillingDate
                      ? formatDate(currentPlan.nextBillingDate)
                      : "N/A"}
                  </p>
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
                  variant={plan.buttonVariant}
                  size="lg"
                  className="w-full"
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : plan.buttonText}
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
              <Button variant="outline" size="lg">
                Update Card
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
                billingData.billingHistory.map((item) => (
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
                          className="text-gold hover:text-gold/80 font-semibold flex items-center gap-2"
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
    </div>
  );
}
