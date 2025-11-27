"use client";

import { useState } from "react";

interface ProfitByOddsRange {
  range: string;
  minOdds: number;
  maxOdds: number | null;
  profit: number;
  bets: number;
  wins: number;
  strikeRate: number;
}

interface OddsRangeAnalysisProps {
  profitByOddsRange: ProfitByOddsRange[];
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

export function OddsRangeAnalysis({
  profitByOddsRange,
}: OddsRangeAnalysisProps) {
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
        if (range.maxOdds === null) return false;
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
            <div className="text-3xl sm:text-4xl font-bold text-green mb-2">
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
            <div className="text-3xl sm:text-4xl font-bold text-green mb-2">
              {formatNumber(filteredData.totalBets)}
            </div>
            <div className="text-sm text-dark-navy">Total Bets</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green mb-2">
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

