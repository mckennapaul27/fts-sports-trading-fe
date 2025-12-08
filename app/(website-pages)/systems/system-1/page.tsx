"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SystemHero } from "@/components/systems/system-hero";
import { SystemOverview } from "@/components/systems/system-overview";
import { SystemCsvDownload } from "@/components/systems/system-csv-download";
import { DateRangeFilter } from "@/components/results/date-range-filter";
import { PerformanceViewToggle } from "@/components/results/performance-view-toggle";
import { ResultsChart } from "@/components/results/results-chart";
import { ResultsTable } from "@/components/results/results-table";
import { OddsRangeAnalysis } from "@/components/results/odds-range-analysis";
import { VerifiedResults } from "@/components/results/verified-results";
import { getDateRange } from "@/lib/date-utils";
import { ClimbingBoxLoader } from "react-spinners";

interface System {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface PerformanceStats {
  systemId: string;
  systemName: string;
  systemSlug: string;
  totalPL: number;
  strikeRate: number;
  totalBets: number;
  roi: number;
  cumulativePL: Array<{
    month: string;
    monthName: string;
    monthlyPL: number;
    cumulativePL: number;
    bets: number;
  }>;
  profitByOddsRange: Array<{
    range: string;
    minOdds: number;
    maxOdds: number | null;
    profit: number;
    bets: number;
    wins: number;
    strikeRate: number;
    avgOdds: number;
  }>;
}

interface MonthlyBreakdown {
  month: string;
  monthName: string;
  monthlyPL: number;
  bets: number;
  wins: number;
  strikeRate: number;
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
}

type ViewMode = "cumulative" | "monthly" | "odds-range";

export default function System1Page() {
  const [system, setSystem] = useState<System | null>(null);
  const [dateRange, setDateRange] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("cumulative");
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyBreakdown[]>(
    []
  );
  const [results, setResults] = useState<BetResult[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const systemResultsRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // Fetch system by slug on mount
  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/performance/systems`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const foundSystem = data.data.find(
            (s: System) => s.slug === "system-1"
          );
          if (foundSystem) {
            setSystem(foundSystem);
          } else {
            setError("System not found");
          }
        } else {
          setError("No systems available");
        }
      } catch (err) {
        setError("Failed to load system");
        console.error("Error fetching system:", err);
      }
    };

    fetchSystem();
  }, [apiUrl]);

  // Fetch stats when system or date range changes
  useEffect(() => {
    if (!system?._id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setOffset(0);
      setResults([]);

      try {
        const dateRangeConfig = getDateRange(dateRange);

        const params = new URLSearchParams();
        if (dateRangeConfig.startDate) {
          params.append("startDate", dateRangeConfig.startDate);
        }
        if (dateRangeConfig.endDate) {
          params.append("endDate", dateRangeConfig.endDate);
        }

        // Fetch stats
        const statsResponse = await fetch(
          `${apiUrl}/api/performance/stats/${system._id}?${params.toString()}`
        );
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch monthly breakdown
        const monthlyResponse = await fetch(
          `${apiUrl}/api/performance/monthly/${system._id}?${params.toString()}`
        );
        const monthlyData = await monthlyResponse.json();
        if (monthlyData.success) {
          setMonthlyBreakdown(monthlyData.data.monthlyBreakdown || []);
        }

        // Fetch results
        const resultsParams = new URLSearchParams(params);
        resultsParams.append("limit", "20");
        resultsParams.append("offset", "0");
        resultsParams.append("sortBy", "date");
        resultsParams.append("sortOrder", "desc");

        const resultsResponse = await fetch(
          `${apiUrl}/api/performance/results/${
            system._id
          }?${resultsParams.toString()}`
        );
        const resultsData = await resultsResponse.json();
        if (resultsData.success) {
          setResults(resultsData.data.results || []);
          setHasMore(resultsData.data.hasMore || false);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [system, dateRange, apiUrl]);

  // Load more results
  const handleLoadMore = async () => {
    if (!system?._id || loadingMore) return;

    setLoadingMore(true);
    try {
      const dateRangeConfig = getDateRange(dateRange);
      const params = new URLSearchParams();
      if (dateRangeConfig.startDate) {
        params.append("startDate", dateRangeConfig.startDate);
      }
      if (dateRangeConfig.endDate) {
        params.append("endDate", dateRangeConfig.endDate);
      }
      params.append("limit", "20");
      params.append("offset", String(offset + 20));
      params.append("sortBy", "date");
      params.append("sortOrder", "desc");

      const response = await fetch(
        `${apiUrl}/api/performance/results/${system._id}?${params.toString()}`
      );
      const data = await response.json();
      if (data.success) {
        setResults((prev) => [...prev, ...(data.data.results || [])]);
        setHasMore(data.data.hasMore || false);
        setOffset(offset + 20);
      }
    } catch (err) {
      console.error("Error loading more results:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Calculate current P/L from cumulative data
  const currentPL =
    stats?.cumulativePL[stats.cumulativePL.length - 1]?.cumulativePL || 0;

  // System-specific data (hardcoded for now, could come from API later)
  const systemDescription =
    "System 1 is our flagship trading system, specializing in flat racing. It uses over 30 form indicators to identify overvalued favourites, generating 8-12 selections per week.";

  const methodology = [
    "Class analysis across multiple race types",
    "Form indicators over last 5 runs",
    "Track and distance records",
    "Trainer and jockey performance metrics",
    "Pace and running style analysis",
  ];

  // Calculate performance stats from results (or use API if available)
  // For now, using placeholder values - these should come from the API
  const performanceStats = {
    totalBets: stats?.totalBets || 0,
    averageOdds: 5.4, // This should come from API
    longestWinStreak: 12, // This should come from API
    longestLoseStreak: 5, // This should come from API
    maxDrawdown: -42, // This should come from API
  };

  if (error && !system) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-navy mb-4">
            System Not Found
          </h1>
          <Link href="/systems" className="text-teal hover:underline">
            Back to Systems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* System Hero */}
      <SystemHero
        systemName={system?.name || "System 1"}
        liveSince="2021"
        totalPL={stats?.totalPL || 0}
        roi={stats?.roi || 0}
        strikeRate={stats?.strikeRate || 0}
        totalBets={stats?.totalBets || 0}
      />

      {/* System Overview */}
      <SystemOverview
        description={systemDescription}
        methodology={methodology}
        performanceStats={performanceStats}
      />

      {/* Data Table Section */}
      <section className="bg-white py-12 sm:py-16" ref={systemResultsRef}>
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <DateRangeFilter
              selectedRange={dateRange}
              onRangeChange={setDateRange}
              dateRangeText={getDateRange(dateRange).label}
            />

            <PerformanceViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showOddsRange={true}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <div>
                  <ClimbingBoxLoader color="#37744e" />
                </div>
                <p className="text-lg text-dark-navy">Loading stats...</p>
              </div>
            ) : (
              <>
                {viewMode === "odds-range" ? (
                  <OddsRangeAnalysis
                    profitByOddsRange={stats?.profitByOddsRange || []}
                  />
                ) : (
                  <ResultsChart
                    viewMode={viewMode}
                    cumulativeData={stats?.cumulativePL || []}
                    monthlyData={monthlyBreakdown}
                    currentPL={currentPL}
                    totalBets={stats?.totalBets || 0}
                  />
                )}

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-dark-navy mb-4">
                    Results Table
                  </h3>
                  <ResultsTable
                    data={results}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                    loading={loadingMore}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CSV Download Section */}
      {system && stats && (
        <SystemCsvDownload
          systemId={system._id}
          systemName={system.name}
          totalBets={stats.totalBets}
        />
      )}

      <VerifiedResults />
    </>
  );
}
