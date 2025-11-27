"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function OddsRangeAnalysis({
  profitByOddsRange,
}: {
  profitByOddsRange: PerformanceStats["profitByOddsRange"];
}) {
  const [selectedMaxOdds, setSelectedMaxOdds] = useState<number | null>(10.0);

  // Calculate aggregated data for selected odds range
  const getFilteredData = (maxOdds: number | null) => {
    if (maxOdds === null) {
      // All odds
      return profitByOddsRange.reduce(
        (acc, range) => {
          acc.totalBets += range.bets;
          acc.totalWins += range.wins;
          acc.totalProfit += range.profit;
          return acc;
        },
        { totalBets: 0, totalWins: 0, totalProfit: 0 }
      );
    }

    return profitByOddsRange
      .filter((range) => {
        // Exclude ranges with null maxOdds (like "10.0+") as they represent odds >= 10.0
        if (range.maxOdds === null) return false;
        // For "Odds < 10.0", we want ranges where maxOdds < 10.0
        // This excludes "8.0-10.0" (maxOdds: 10) since it includes odds at 10.0
        return range.maxOdds < maxOdds;
      })
      .reduce(
        (acc, range) => {
          acc.totalBets += range.bets;
          acc.totalWins += range.wins;
          acc.totalProfit += range.profit;
          return acc;
        },
        { totalBets: 0, totalWins: 0, totalProfit: 0 }
      );
  };

  const filteredData = getFilteredData(selectedMaxOdds);
  const winRate =
    filteredData.totalBets > 0
      ? (filteredData.totalWins / filteredData.totalBets) * 100
      : 0;
  const roi =
    filteredData.totalBets > 0
      ? (filteredData.totalProfit / filteredData.totalBets) * 100
      : 0;

  // Calculate average odds (simplified - using midpoint of ranges)
  const getAverageOdds = () => {
    if (selectedMaxOdds === null) return null;

    // Use the same filter logic as getFilteredData
    const ranges = profitByOddsRange.filter((range) => {
      if (range.maxOdds === null) return false;
      return range.maxOdds < selectedMaxOdds;
    });

    if (ranges.length === 0) return null;

    let totalWeightedOdds = 0;
    let totalBets = 0;

    ranges.forEach((range) => {
      const midOdds = (range.minOdds + range.maxOdds!) / 2;
      totalWeightedOdds += midOdds * range.bets;
      totalBets += range.bets;
    });

    return totalBets > 0 ? totalWeightedOdds / totalBets : null;
  };

  const avgOdds = getAverageOdds();

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-12">
        <button
          onClick={() => setSelectedMaxOdds(10.0)}
          className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
            selectedMaxOdds === 10.0
              ? "bg-gray-200 text-dark-navy font-bold"
              : "bg-gray-100 text-dark-navy font-bold hover:bg-gray-300"
          }`}
        >
          Odds &lt; 10.0
        </button>
        <button
          onClick={() => setSelectedMaxOdds(20.0)}
          className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
            selectedMaxOdds === 20.0
              ? "bg-gray-200 text-dark-navy font-bold"
              : "bg-gray-100 text-dark-navy font-bold hover:bg-gray-300"
          }`}
        >
          Odds &lt; 20.0
        </button>
        <button
          onClick={() => setSelectedMaxOdds(30.0)}
          className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
            selectedMaxOdds === 30.0
              ? "bg-gray-200 text-dark-navy font-bold"
              : "bg-gray-100 text-dark-navy font-bold hover:bg-gray-300"
          }`}
        >
          Odds &lt; 30.0
        </button>
      </div>

      {/* Performance Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold  text-green mb-2">
              {winRate.toFixed(2)}%
            </div>
            <div className="text-sm text-dark-navy">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green mb-2">
              {roi >= 0 ? "+" : ""}
              {roi.toFixed(2)}%
            </div>
            <div className="text-sm text-dark-navy">ROI</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold  text-green mb-2">
              {formatNumber(filteredData.totalBets)}
            </div>
            <div className="text-sm text-dark-navy">Total Bets</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold  text-green mb-2">
              {filteredData.totalProfit >= 0 ? "+" : ""}
              {formatCurrency(filteredData.totalProfit)}
            </div>
            <div className="text-sm text-dark-navy">Profit/Loss</div>
          </div>
        </div>

        <div className="flex-col sm:inline-flex flex-row items-center sm:justify-center sm:w-full gap-6 text-sm text-dark-navy">
          <div className="text-center">
            <span className="font-semibold">Total Wins:</span>{" "}
            <span className="text-green">
              {formatNumber(filteredData.totalWins)}
            </span>
          </div>
          <div className="text-center">
            <span className="font-semibold">Total Stake:</span>{" "}
            <span className="text-green">
              {" "}
              {formatCurrency(filteredData.totalBets)}
            </span>
          </div>
          {avgOdds !== null && (
            <div className="text-center">
              <span className="font-semibold">Average Odds:</span>{" "}
              <span className="text-green">{avgOdds.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PerformanceGlance() {
  const [systems, setSystems] = useState<System[]>([
    {
      _id: "1",
      name: "System 1",
      slug: "system-1",
    },
  ]);
  const [selectedSystemId, setSelectedSystemId] = useState<string>("");
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch stats when system changes
  useEffect(() => {
    if (!selectedSystemId) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/api/performance/stats/${selectedSystemId}`
        );
        const data = await response.json();
        if (data.success) {
          console.log(data.data);
          setStats(data.data);
        } else {
          setError(data.error || "Failed to load performance data");
        }
      } catch (err) {
        setError("Failed to load performance data");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedSystemId, apiUrl]);

  // Prepare chart data - only create options when stats are available
  const chartOptions: Highcharts.Options = stats
    ? {
        chart: {
          type: "line",
          backgroundColor: "transparent",
          height: 400,
        },
        title: {
          text: undefined,
        },
        xAxis: {
          categories: stats.cumulativePL.map((m) => m.monthName),
          labels: {
            style: {
              color: "var(--color-dark-navy)",
              fontFamily: "var(--font-karla)",
            },
          },
          gridLineColor: "rgba(0, 0, 0, 0.1)",
        },
        yAxis: {
          title: {
            text: undefined,
          },
          labels: {
            format: "£{value}",
            style: {
              color: "var(--color-dark-navy)",
              fontFamily: "var(--font-karla)",
            },
          },
          gridLineDashStyle: "Dash",
          gridLineColor: "rgba(0, 0, 0, 0.1)",
        },
        series: [
          {
            name: "Cumulative P/L",
            type: "line",
            data: stats.cumulativePL.map((m) => m.cumulativePL),
            color: "var(--color-green)",
            lineWidth: 3,
            marker: {
              enabled: false,
            },
          },
        ],
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          line: {
            enableMouseTracking: true,
          },
        },
        tooltip: {
          formatter: function () {
            return `<b>${this.x}</b><br/>£${this.y?.toFixed(2)}`;
          },
          style: {
            fontFamily: "var(--font-karla)",
          },
        },
      }
    : {
        chart: {
          type: "line",
          backgroundColor: "transparent",
          height: 400,
        },
        title: {
          text: undefined,
        },
        series: [
          {
            name: "Cumulative P/L",
            type: "line",
            data: [],
          },
        ],
      };

  // Calculate current P/L and total bets for display
  const currentPL =
    stats?.cumulativePL[stats.cumulativePL.length - 1]?.cumulativePL || 0;
  const currentBets = stats?.totalBets || 0;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 mx-auto">
            <h2 className="text-3xl text-center lg:text-4xl  font-bold text-dark-navy mb-3">
              Performance At A Glance
            </h2>
            <p className="text-lg text-center text-dark-navy mb-6">
              Real results from live trading. All data is verified and publicly
              available.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm mb-6">
              {error}
            </div>
          )}

          {/* System Selector
          <div className="max-w-xs mb-4">
            <select
              value={selectedSystemId}
              onChange={(e) => setSelectedSystemId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-white text-dark-navy focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              disabled={loading}
            >
              {systems.map((system) => (
                <option key={system._id} value={system._id}>
                  {system.name}
                </option>
              ))}
            </select>
          </div> */}

          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Total P/L */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Total P/L</div>
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-1 ${
                    !stats
                      ? "text-green"
                      : stats?.totalPL && stats.totalPL >= 0
                      ? "text-green"
                      : "text-red-600"
                  }`}
                >
                  {stats?.totalPL && stats.totalPL >= 0 ? "+" : ""}
                  {formatNumber(stats?.totalPL || 0)} pts
                </div>
                <div className="text-sm text-gray-600">
                  Portfolio cumulative
                </div>
              </div>

              {/* Strike Rate */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Win Rate</div>
                <div className="text-2xl sm:text-3xl font-bold text-green mb-1">
                  {stats?.strikeRate?.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-gray-600">
                  {systems.find((s) => s._id === selectedSystemId)?.name}
                </div>
              </div>

              {/* Total Bets */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Total Bets</div>
                <div className="text-2xl sm:text-3xl font-bold text-green mb-1">
                  {formatNumber(stats?.totalBets || 0)}
                </div>
                <div className="text-sm text-gray-600">Since inception</div>
              </div>

              {/* ROI */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">ROI</div>
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-1 ${
                    !stats
                      ? "text-green"
                      : stats?.roi && stats?.roi >= 0
                      ? "text-green"
                      : "text-red-600"
                  }`}
                >
                  {stats?.roi && stats?.roi >= 0 ? "+" : ""}
                  {stats?.roi?.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-gray-600">
                  Return on investment
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mb-8">
              <Tabs defaultValue="cumulative" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="cumulative" className="cursor-pointer">
                    Cumulative{" "}
                    <span className="hidden sm:inline">Profit/Loss</span>
                  </TabsTrigger>
                  <TabsTrigger value="odds" className="cursor-pointer">
                    <span className="inline sm:hidden">Odds Range</span>
                    <span className="hidden sm:inline">
                      Analyse Profit by Odds Range
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cumulative" className="mt-0">
                  {stats && stats.cumulativePL.length > 0 ? (
                    <>
                      <HighchartsReact
                        key={selectedSystemId}
                        highcharts={Highcharts}
                        options={chartOptions}
                      />
                      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                        <div className="text-sm text-dark-navy">
                          <span className="font-semibold">Current P/L:</span>{" "}
                          {formatCurrency(currentPL)}
                        </div>
                        <div className="text-sm text-dark-navy">
                          <span className="font-semibold">Total Bets:</span>{" "}
                          {formatNumber(currentBets)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-dark-navy">
                      No chart data available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="odds" className="mt-0">
                  <OddsRangeAnalysis
                    profitByOddsRange={stats?.profitByOddsRange || []}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Explore All Results Button */}
            <div className="text-center">
              <Button variant="white" size="xl" asChild>
                <Link href="/results">Explore All Results</Link>
              </Button>
            </div>
          </>
        </div>
      </div>
    </section>
  );
}
