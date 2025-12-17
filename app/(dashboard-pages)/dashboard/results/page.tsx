"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/results/date-range-filter";
import { PerformanceViewToggle } from "@/components/results/performance-view-toggle";
import { ResultsChart } from "@/components/results/results-chart";
import { ResultsTable } from "@/components/results/results-table";
import { OddsRangeAnalysis } from "@/components/results/odds-range-analysis";
import { getDateRange } from "@/lib/date-utils";
import { ClimbingBoxLoader } from "react-spinners";
import { COUNTRIES, MEETINGS } from "@/data";

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

export default function ResultsPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("cumulative");
  const [country, setCountry] = useState<string>("all");
  const [meeting, setMeeting] = useState<string>("all");
  const [oddsPreset, setOddsPreset] = useState<
    "all" | "lt10" | "lt20" | "lt30" | "custom"
  >("all");
  const [customMinOdds, setCustomMinOdds] = useState<string>("");
  const [customMaxOdds, setCustomMaxOdds] = useState<string>("");
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

  const dateRangeConfig = useMemo(() => {
    if (dateRange === "custom") {
      return {
        startDate: customStartDate || null,
        endDate: customEndDate || null,
        label:
          customStartDate && customEndDate
            ? `Custom (${customStartDate} - ${customEndDate})`
            : "Custom",
      };
    }
    return getDateRange(dateRange);
  }, [customEndDate, customStartDate, dateRange]);

  const oddsConfig = useMemo(() => {
    if (oddsPreset === "lt10") return { minOdds: null, maxOdds: 10 };
    if (oddsPreset === "lt20") return { minOdds: null, maxOdds: 20 };
    if (oddsPreset === "lt30") return { minOdds: null, maxOdds: 30 };
    if (oddsPreset === "custom") {
      const min =
        customMinOdds.trim() === "" ? null : Number(customMinOdds.trim());
      const max =
        customMaxOdds.trim() === "" ? null : Number(customMaxOdds.trim());
      return {
        minOdds: Number.isFinite(min as number) ? (min as number) : null,
        maxOdds: Number.isFinite(max as number) ? (max as number) : null,
      };
    }
    return { minOdds: null, maxOdds: null };
  }, [customMaxOdds, customMinOdds, oddsPreset]);

  const appliedFilters = useMemo(() => {
    const dateLabel = `Date: ${dateRangeConfig.label}`;

    const formatOdds = (n: number) =>
      new Intl.NumberFormat("en-GB", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(n);

    let oddsLabel = "Odds: All";
    if (oddsPreset === "lt10") oddsLabel = "Odds: < 10.0";
    if (oddsPreset === "lt20") oddsLabel = "Odds: < 20.0";
    if (oddsPreset === "lt30") oddsLabel = "Odds: < 30.0";
    if (oddsPreset === "custom") {
      const { minOdds, maxOdds } = oddsConfig;
      if (minOdds !== null && maxOdds !== null) {
        oddsLabel = `Odds: ${formatOdds(minOdds)}–${formatOdds(maxOdds)}`;
      } else if (minOdds !== null) {
        oddsLabel = `Odds: ≥ ${formatOdds(minOdds)}`;
      } else if (maxOdds !== null) {
        oddsLabel = `Odds: ≤ ${formatOdds(maxOdds)}`;
      } else {
        oddsLabel = "Odds: Custom (not set)";
      }
    }

    const countryLabel = `Country: ${country === "all" ? "All" : country}`;
    const meetingLabel = `Meeting: ${meeting === "all" ? "All" : meeting}`;

    return [dateLabel, oddsLabel, countryLabel, meetingLabel];
  }, [country, dateRangeConfig.label, meeting, oddsConfig, oddsPreset]);

  const baseFilterParams = useMemo(() => {
    const params = new URLSearchParams();

    if (dateRangeConfig.startDate)
      params.append("startDate", dateRangeConfig.startDate);
    if (dateRangeConfig.endDate)
      params.append("endDate", dateRangeConfig.endDate);

    if (oddsConfig.minOdds !== null)
      params.append("minOdds", String(oddsConfig.minOdds));
    if (oddsConfig.maxOdds !== null)
      params.append("maxOdds", String(oddsConfig.maxOdds));

    if (country !== "all") params.append("country", country);
    if (meeting !== "all") params.append("meeting", meeting);

    return params;
  }, [
    country,
    dateRangeConfig.endDate,
    dateRangeConfig.startDate,
    meeting,
    oddsConfig.maxOdds,
    oddsConfig.minOdds,
  ]);

  const hasActiveFilters = useMemo(() => {
    return (
      dateRange !== "all" ||
      oddsPreset !== "all" ||
      country !== "all" ||
      meeting !== "all" ||
      customStartDate.trim() !== "" ||
      customEndDate.trim() !== "" ||
      customMinOdds.trim() !== "" ||
      customMaxOdds.trim() !== ""
    );
  }, [
    country,
    customEndDate,
    customMaxOdds,
    customMinOdds,
    customStartDate,
    dateRange,
    meeting,
    oddsPreset,
  ]);

  const clearFilters = () => {
    setDateRange("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setOddsPreset("all");
    setCustomMinOdds("");
    setCustomMaxOdds("");
    setCountry("all");
    setMeeting("all");
  };

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
        // Fetch stats (note: stats endpoint may not support date filtering)
        // If it doesn't, we'll still get all-time stats
        const statsResponse = await fetch(
          `${apiUrl}/api/performance/stats/${selectedSystemId}?${baseFilterParams.toString()}`
        );
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch monthly breakdown (supports date filtering)
        const monthlyResponse = await fetch(
          `${apiUrl}/api/performance/monthly/${selectedSystemId}?${baseFilterParams.toString()}`
        );
        const monthlyData = await monthlyResponse.json();
        if (monthlyData.success) {
          setMonthlyBreakdown(monthlyData.data.monthlyBreakdown || []);
        }

        // Fetch results
        const resultsParams = new URLSearchParams(baseFilterParams);
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
  }, [selectedSystemId, apiUrl, baseFilterParams]);

  // Load more results
  const handleLoadMore = async () => {
    if (!selectedSystemId || loadingMore) return;

    setLoadingMore(true);
    try {
      const params = new URLSearchParams(baseFilterParams);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-navy">System Results</h1>
          <p className="text-gray-600 mt-1">
            Full, verified results for every system. Use filters and charts to
            analyse performance over time. All data is publicly available for
            complete transparency.
          </p>
        </div>

        {/* System Tabs */}
        {systems.length > 0 && (
          <div className="mb-6">
            <Tabs
              value={selectedSystemId}
              onValueChange={setSelectedSystemId}
              className="w-full"
            >
              <TabsList className="bg-cream/50 border border-gray-200">
                {systems.map((system) => (
                  <TabsTrigger
                    key={system._id}
                    value={system._id}
                    className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer"
                  >
                    {system.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        <div ref={systemResultsRef}>
          <DateRangeFilter
            selectedRange={dateRange}
            onRangeChange={setDateRange}
            dateRangeText={dateRangeConfig.label}
            enableCustomRange={true}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomRangeChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
            }}
          />

          {/* Top level filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-dark-navy mb-2">
              Additional Filters
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Filter by odds range, country, and meeting
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setOddsPreset("all")}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  oddsPreset === "all"
                    ? "bg-dark-navy text-white"
                    : "bg-gray-100 text-dark-navy hover:bg-gray-200"
                }`}
              >
                All Odds
              </button>
              <button
                onClick={() => setOddsPreset("lt10")}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  oddsPreset === "lt10"
                    ? "bg-dark-navy text-white"
                    : "bg-gray-100 text-dark-navy hover:bg-gray-200"
                }`}
              >
                Odds &lt; 10.0
              </button>
              <button
                onClick={() => setOddsPreset("lt20")}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  oddsPreset === "lt20"
                    ? "bg-dark-navy text-white"
                    : "bg-gray-100 text-dark-navy hover:bg-gray-200"
                }`}
              >
                Odds &lt; 20.0
              </button>
              <button
                onClick={() => setOddsPreset("lt30")}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  oddsPreset === "lt30"
                    ? "bg-dark-navy text-white"
                    : "bg-gray-100 text-dark-navy hover:bg-gray-200"
                }`}
              >
                Odds &lt; 30.0
              </button>
              <button
                onClick={() => setOddsPreset("custom")}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  oddsPreset === "custom"
                    ? "bg-dark-navy text-white"
                    : "bg-gray-100 text-dark-navy hover:bg-gray-200"
                }`}
              >
                Custom Odds
              </button>
            </div>

            {oddsPreset === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-dark-navy">
                    Min odds
                  </span>
                  <input
                    inputMode="decimal"
                    value={customMinOdds}
                    onChange={(e) => setCustomMinOdds(e.target.value)}
                    placeholder="e.g. 3.0"
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm text-dark-navy"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-dark-navy">
                    Max odds
                  </span>
                  <input
                    inputMode="decimal"
                    value={customMaxOdds}
                    onChange={(e) => setCustomMaxOdds(e.target.value)}
                    placeholder="e.g. 6.0"
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm text-dark-navy"
                  />
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-dark-navy">
                  Country
                </span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border border-gray-200 rounded-sm px-3 py-2 text-sm text-dark-navy bg-white"
                >
                  <option value="all">All</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-dark-navy">
                  Meeting
                </span>
                <select
                  value={meeting}
                  onChange={(e) => setMeeting(e.target.value)}
                  className="border border-gray-200 rounded-sm px-3 py-2 text-sm text-dark-navy bg-white"
                >
                  <option value="all">All</option>
                  {MEETINGS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <PerformanceViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showOddsRange={true}
          />

          {/* Applied filters summary */}
          <div className="mb-6 -mt-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Filters applied:</span>
                {appliedFilters.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-sm bg-gray-100 px-3 py-1 text-xs font-medium text-dark-navy"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                  hasActiveFilters
                    ? "bg-gray-100 text-dark-navy hover:bg-gray-200 cursor-pointer"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                Clear filters
              </button>
            </div>
          </div>

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
                <div className="mb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Filters applied:
                      </span>
                      {appliedFilters.map((label) => (
                        <span
                          key={`table-${label}`}
                          className="inline-flex items-center rounded-sm bg-gray-100 px-3 py-1 text-xs font-medium text-dark-navy"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                      className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                        hasActiveFilters
                          ? "bg-gray-100 text-dark-navy hover:bg-gray-200 cursor-pointer"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
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
    </>
  );
}
