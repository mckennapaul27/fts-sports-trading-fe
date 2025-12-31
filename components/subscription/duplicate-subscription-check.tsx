"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BillingData {
  hasSubscription: boolean;
  currentPlan: {
    productId: string;
    name: string;
  } | null;
}

// Fetcher for billing data
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
    throw new Error("Failed to fetch billing data");
  }

  return response.json();
};

interface DuplicateSubscriptionCheckProps {
  productId: string | null;
  onDuplicateDetected?: () => void;
  showToast?: boolean;
  redirectToBilling?: boolean;
}

/**
 * Component that checks if a user is already subscribed to a given productId.
 * 
 * @param productId - The product ID to check against
 * @param onDuplicateDetected - Optional callback when duplicate is detected
 * @param showToast - Whether to show a toast message (default: true)
 * @param redirectToBilling - Whether to redirect to billing page (default: false)
 * @returns null (this component doesn't render anything, just performs the check)
 */
export function DuplicateSubscriptionCheck({
  productId,
  onDuplicateDetected,
  showToast = true,
  redirectToBilling = false,
}: DuplicateSubscriptionCheckProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const billingUrl = session?.accessToken
    ? `${apiUrl}/api/users/billing`
    : null;

  const { data: billingData } = useSWR<BillingData>(
    billingUrl ? [billingUrl, session?.accessToken] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    // Only check if we have a productId and billing data
    if (
      !productId ||
      !billingData?.hasSubscription ||
      !billingData?.currentPlan?.productId
    ) {
      return;
    }

    // Check if user is already subscribed to this exact plan
    if (billingData.currentPlan.productId === productId) {
      if (showToast) {
        toast.error(
          "You are already subscribed to this plan. Please visit your billing page to manage your subscription.",
          { duration: 5000 }
        );
      }

      if (onDuplicateDetected) {
        onDuplicateDetected();
      }

      if (redirectToBilling) {
        setTimeout(() => {
          router.push("/dashboard/billings");
        }, 2000);
      }
    }
  }, [
    productId,
    billingData,
    showToast,
    redirectToBilling,
    onDuplicateDetected,
    router,
  ]);

  // This component doesn't render anything
  return null;
}

/**
 * Hook that returns whether the user is already subscribed to the given productId.
 * Useful when you need the boolean value rather than automatic handling.
 */
export function useIsDuplicateSubscription(productId: string | null): boolean {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const billingUrl = session?.accessToken
    ? `${apiUrl}/api/users/billing`
    : null;

  const { data: billingData } = useSWR<BillingData>(
    billingUrl ? [billingUrl, session?.accessToken] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
    }
  );

  if (
    !productId ||
    !billingData?.hasSubscription ||
    !billingData?.currentPlan?.productId
  ) {
    return false;
  }

  return billingData.currentPlan.productId === productId;
}


