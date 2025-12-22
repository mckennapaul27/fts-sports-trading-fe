"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

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

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
}

// Format points helper (2 decimal places)
function formatCurrency(num: number): string {
  return num.toFixed(2);
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
        // Fetch stats (all-time data for performance glance)
        const response = await fetch(
          `${apiUrl}/api/performance/stats/${selectedSystemId}`
        );
        const data = await response.json();
        if (data.success) {
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
            format: "{value} pts",
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
            return `<b>${this.x}</b><br/>${this.y?.toFixed(2)} pts`;
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

  // Calculate ROI client-side to ensure precision matches odds range analysis
  const calculatedROI =
    stats && stats.totalBets > 0 ? (stats.totalPL / stats.totalBets) * 100 : 0;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 mx-auto">
            <h2 className="text-3xl text-center lg:text-4xl  font-bold text-dark-navy mb-3">
              Performance At A Glance
            </h2>
            <p className="text-lg text-center text-dark-navy mb-6 max-w-2xl mx-auto">
              Real results from live trading. For more detailed results for all
              systems including custom date ranges, odds ranges, country/meeting
              filters, and the full results table, see the{" "}
              <Link
                href="/results"
                className="underline underline-offset-4 hover:text-gold"
              >
                Results page
              </Link>
              .
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
                <div className="text-sm text-gray-600">System 1 cumulative</div>
              </div>

              {/* Strike Rate */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Win Rate</div>
                <div className="text-2xl sm:text-3xl font-bold text-green mb-1">
                  {stats?.strikeRate?.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-gray-600">System 1 win rate</div>
              </div>

              {/* Total Bets */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Total Bets</div>
                <div className="text-2xl sm:text-3xl font-bold text-green mb-1">
                  {formatNumber(stats?.totalBets || 0)}
                </div>
                <div className="text-sm text-gray-600">System 1 total bets</div>
              </div>

              {/* ROI */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">ROI</div>
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-1 ${
                    !stats
                      ? "text-green"
                      : calculatedROI >= 0
                      ? "text-green"
                      : "text-red-600"
                  }`}
                >
                  {calculatedROI >= 0 ? "+" : ""}
                  {calculatedROI.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">System 1 ROI</div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mb-8">
              <h3 className="text-lg font-bold text-dark-navy mb-6">
                Cumulative Profit/Loss - System 1
              </h3>

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
                  {loading ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ClimbingBoxLoader color="#37744e" /> Loading chart
                      data...
                    </div>
                  ) : (
                    "No chart data available"
                  )}
                </div>
              )}
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
