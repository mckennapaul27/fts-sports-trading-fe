"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import {
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClimbingBoxLoader } from "react-spinners";

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

interface System {
  _id: string;
  name: string;
  slug: string;
}

interface BetResult {
  date: string;
  country: string;
  course: string;
  time: string;
  selection: string;
  result: string;
  bsp: number;
  stake: number;
  liability: number;
  pl: number;
  runningPL: number;
  systemId?: {
    _id: string;
    name: string;
    slug: string;
  };
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

// Format relative time (e.g., "2 hours ago", "Yesterday")
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
    }
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return formatDate(dateString);
  }
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const billingUrl = session?.accessToken
    ? `${apiUrl}/api/users/billing`
    : null;

  const [systems, setSystems] = useState<System[]>([]);
  const [recentResults, setRecentResults] = useState<BetResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  // Fetch billing data
  const {
    data: billingData,
    error: billingError,
    isLoading: billingLoading,
  } = useSWR<BillingData>(
    billingUrl ? [billingUrl, session?.accessToken] : null,
    ([url, token]: [string, string]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  // Fetch systems
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/performance/systems`);
        const data = await response.json();
        if (data.success && data.data) {
          setSystems(data.data);
        }
      } catch (err) {
        console.error("Error fetching systems:", err);
      }
    };
    fetchSystems();
  }, [apiUrl]);

  // Fetch recent results from all systems
  useEffect(() => {
    if (!session?.accessToken || systems.length === 0) return;

    const fetchRecentResults = async () => {
      setLoadingResults(true);
      try {
        const params = new URLSearchParams();
        params.append("limit", "10");
        params.append("offset", "0");
        params.append("sortBy", "date");
        params.append("sortOrder", "desc");

        // Fetch results from all systems
        const resultsPromises = systems.map((system) =>
          fetch(
            `${apiUrl}/api/performance/results/${
              system._id
            }?${params.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .catch((err) => {
              console.error(`Error fetching results for ${system.name}:`, err);
              return { success: false, data: { results: [] } };
            })
        );

        const resultsData = await Promise.all(resultsPromises);
        const allResults: BetResult[] = [];

        resultsData.forEach((data, index) => {
          if (data.success && data.data?.results) {
            const systemResults = data.data.results.map(
              (result: BetResult) => ({
                ...result,
                systemId: systems[index],
              })
            );
            allResults.push(...systemResults);
          }
        });
        // console.log("allResults", allResults);

        // Sort by date descending and get top 3 most recent
        const uniqueResults = Array.from(
          new Map(
            allResults.map((r) => [
              `${r.date}-${r.time}-${r.selection}-${r.systemId?._id || ""}`,
              r,
            ])
          ).values()
        )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 3);

        setRecentResults(uniqueResults);
      } catch (err) {
        console.error("Error fetching recent results:", err);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchRecentResults();
  }, [session?.accessToken, systems, apiUrl]);

  const firstName = session?.user?.firstName || "User";
  const currentPlan = billingData?.currentPlan;

  // Get plan display name
  const getPlanDisplayName = () => {
    if (!currentPlan) return "No Active Subscription";
    return currentPlan.name;
  };

  // Get plan price display
  const getPlanPrice = () => {
    if (!currentPlan) return null;
    const currencySymbol =
      currentPlan.currency === "GBP" ? "£" : currentPlan.currency;
    return `${currencySymbol}${currentPlan.price} per ${currentPlan.period}`;
  };

  // Get next billing date
  const getNextBillingDate = () => {
    if (!currentPlan?.nextBillingDate) return null;
    return formatDate(currentPlan.nextBillingDate);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-cream rounded-lg flex items-center justify-between p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center">
            <User className="w-8 h-8 text-dark-navy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-navy font-heading">
              Welcome back, {firstName}
            </h1>
            <p className="text-dark-navy/70 mt-1">
              Here&apos;s your portfolio overview for today.
            </p>
          </div>
        </div>
        <div className="text-right">
          {billingLoading ? (
            <p className="text-dark-navy/70">Loading...</p>
          ) : (
            <p className="text-dark-navy font-medium">{getPlanDisplayName()}</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-dark-navy font-heading mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* View Daily Selections Card */}
          <Link href="/dashboard/selections">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start justify-between group">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-green/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green" />
                </div>
                <h3 className="text-lg font-bold text-dark-navy font-heading mb-2">
                  View Daily Selections
                </h3>
                <p className="text-dark-navy/70 text-sm">
                  Access today&apos;s selections and check results from recent
                  races.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-dark-navy/40 group-hover:text-dark-navy transition-colors flex-shrink-0 ml-4" />
            </div>
          </Link>

          {/* Systems Performance Card */}
          <Link href="/dashboard/results">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start justify-between group">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-lg font-bold text-dark-navy font-heading mb-2">
                  Systems Performance
                </h3>
                <p className="text-dark-navy/70 text-sm">
                  View detailed performance data for each individual system.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-dark-navy/40 group-hover:text-dark-navy transition-colors flex-shrink-0 ml-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <h2 className="text-xl font-bold text-dark-navy font-heading mb-4">
          Recent Results
        </h2>
        {loadingResults ? (
          <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-center">
            <ClimbingBoxLoader color="#37744e" size={20} />
          </div>
        ) : recentResults.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center text-dark-navy/70">
            <p>No recent results available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentResults.map((result, index) => {
              const isWon = result.result === "LOST";
              // For lay betting: Won = loss (red), Lost = win (green)
              const isWin = !isWon;
              return (
                <div
                  key={`${result.date}-${result.time}-${result.selection}-${index}`}
                  className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        result.result === "LOST"
                          ? "bg-green"
                          : result.result === "NR" ||
                            result.result === "VOID" ||
                            result.result === "CANCELLED"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {result.result === "LOST" ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-dark-navy font-heading">
                        {result.systemId?.name || "System"} - Selection{" "}
                        {result.result}
                      </h3>
                      <p className="text-sm text-dark-navy/70 mt-1">
                        {result.selection} at {result.course} (BSP{" "}
                        {result.bsp.toFixed(2)}) {result.pl >= 0 ? "+" : ""}
                        <span
                          className={`${
                            result.pl >= 0 ? "text-green" : "text-red-600"
                          } font-semibold`}
                        >
                          {result.pl.toFixed(2)} pts
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-dark-navy/60 flex-shrink-0 ml-4">
                    {formatRelativeTime(result.date)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Your Plan */}
      <div>
        <h2 className="text-xl font-bold text-dark-navy font-heading mb-4">
          Your Plan
        </h2>
        {billingLoading ? (
          <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-center">
            <ClimbingBoxLoader color="#37744e" size={20} />
          </div>
        ) : !currentPlan ? (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <p className="text-dark-navy/70 mb-4">
              You don&apos;t have an active subscription.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/membership">View Plans</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-dark-navy font-heading mb-1">
                {currentPlan.name}
              </h3>
              <p className="text-dark-navy/70 mb-1">{getPlanPrice()}</p>
              {getNextBillingDate() && (
                <p className="text-sm text-dark-navy/60">
                  Next billing: {getNextBillingDate()}
                </p>
              )}
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/billings">Manage Plan</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
