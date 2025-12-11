"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Header } from "@/components/sections/header";
import { PlanDisplay } from "@/components/sections/plan-display";
import { Button } from "@/components/ui/button";
import { SystemSelectionDialog } from "@/components/sections/system-selection-dialog";
import { useSession } from "next-auth/react";

// Map product IDs to system names
const productIdToSystemName: Record<string, string> = {
  prod_TZZbjLqthXdjxx: "System 1",
  prod_TZZcUfjAmtJfkg: "System 2",
  prod_TZZcuPVww3QyDm: "System 3",
};

export default function SubscribePage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemDialogOpen, setSystemDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const planName = searchParams.get("planName") || "Single System";
  const systemSlugsParam = searchParams.get("systemSlugs");

  // Parse system slugs from query param (comma-separated or single value)
  const systemSlugs = systemSlugsParam
    ? systemSlugsParam.split(",").map((slug) => slug.trim())
    : [];

  // Redirect if no productId or systemSlugs are provided
  useEffect(() => {
    if (!productId || systemSlugs.length === 0) {
      toast.error("No plan selected. Redirecting to membership page...");
      router.push("/membership");
    }
  }, [productId, systemSlugs.length, router]);

  const handleSubscribe = async () => {
    if (!productId || systemSlugs.length === 0 || !session?.accessToken) {
      toast.error("No plan selected. Please go back and select a plan.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
      const res = await fetch(`${apiUrl}/api/users/existing-user-subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          systemSlugs,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Something went wrong. Please try again."
        );
      }

      if (responseData.url) {
        // Redirect to Stripe Checkout
        router.push(responseData.url);
      } else {
        throw new Error("Could not retrieve payment URL.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create checkout session"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get system name if it's a single system product
  const systemName =
    productId && productIdToSystemName[productId]
      ? productIdToSystemName[productId]
      : undefined;

  // If single system but no system selected yet, show dialog
  useEffect(() => {
    if (planName === "Single System" && systemSlugs.length === 0 && productId) {
      setSystemDialogOpen(true);
    }
  }, [planName, systemSlugs.length, productId]);

  if (!productId || systemSlugs.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      {/* <Header
        title="Complete Your Subscription"
        description="Review your selected plan and proceed to payment."
      /> */}
      <section className="bg-cream py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-8">
              {/* Plan Display */}
              <div>
                <h2 className="text-xl font-bold text-dark-navy mb-4">
                  Your Selected Plan
                </h2>
                <PlanDisplay
                  planName={planName}
                  systemName={systemName}
                  productId={productId || undefined}
                />
              </div>

              {/* Subscribe Button */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
                <p className="text-dark-navy/70 mb-6">
                  Click the button below to proceed to secure payment.
                  You&apos;ll be redirected to Stripe to complete your
                  subscription.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SystemSelectionDialog
        open={systemDialogOpen}
        onOpenChange={setSystemDialogOpen}
        isAuthenticated={true}
      />
    </>
  );
}
