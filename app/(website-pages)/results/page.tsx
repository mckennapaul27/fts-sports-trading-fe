"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/sections/header";
import { SystemTabs } from "@/components/results/system-tabs";
import { DateRangeFilter } from "@/components/results/date-range-filter";
import { PerformanceViewToggle } from "@/components/results/performance-view-toggle";
import { ResultsChart } from "@/components/results/results-chart";
import { ResultsTable } from "@/components/results/results-table";
import { OddsRangeAnalysis } from "@/components/results/odds-range-analysis";
import { CsvDownloadCentre } from "@/components/results/csv-download-centre";
import { VerifiedResults } from "@/components/results/verified-results";
import { getDateRange } from "@/lib/date-utils";

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

export default function ResultsPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<string>("");
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

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // Fetch systems on mount
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/performance/systems`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setSystems(data.data);
          setSelectedSystemId(data.data[0]._id);
        } else {
          setError("No systems available");
        }
      } catch (err) {
        setError("Failed to load systems");
        console.error("Error fetching systems:", err);
      }
    };

    fetchSystems();
  }, [apiUrl]);

  // Fetch stats when system or date range changes
  useEffect(() => {
    if (!selectedSystemId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setOffset(0);
      setResults([]);

      try {
        // Calculate date range config inside the effect to avoid dependency issues
        const dateRangeConfig = getDateRange(dateRange);

        // Build query params for date filtering
        const params = new URLSearchParams();
        if (dateRangeConfig.startDate) {
          params.append("startDate", dateRangeConfig.startDate);
        }
        if (dateRangeConfig.endDate) {
          params.append("endDate", dateRangeConfig.endDate);
        }

        // Fetch stats (note: stats endpoint may not support date filtering)
        // If it doesn't, we'll still get all-time stats
        const statsResponse = await fetch(
          `${apiUrl}/api/performance/stats/${selectedSystemId}`
        );
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch monthly breakdown (supports date filtering)
        const monthlyResponse = await fetch(
          `${apiUrl}/api/performance/monthly/${selectedSystemId}?${params.toString()}`
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
          `${apiUrl}/api/performance/results/${selectedSystemId}?${resultsParams.toString()}`
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
  }, [selectedSystemId, dateRange, apiUrl]);

  // Load more results
  const handleLoadMore = async () => {
    if (!selectedSystemId || loadingMore) return;

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
        `${apiUrl}/api/performance/results/${selectedSystemId}?${params.toString()}`
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

  return (
    <>
      <Header
        title="RESULTS"
        description="Full, verified results for every system. Use filters and charts to analyse performance over time. All data is publicly available for complete transparency."
      />

      {systems.length > 0 && (
        <SystemTabs
          systems={systems}
          selectedSystemId={selectedSystemId}
          onSystemChange={setSelectedSystemId}
        />
      )}

      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
              System Results
            </h2>

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
              <div className="text-center py-12 text-dark-navy">
                Loading performance data...
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

      <CsvDownloadCentre systems={systems} totalBets={stats?.totalBets || 0} />

      <VerifiedResults />
    </>
  );
}
