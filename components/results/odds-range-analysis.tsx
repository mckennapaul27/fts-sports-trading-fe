"use client";

interface ProfitByOddsRange {
  range: string; // "Odds < 30.0" | "Odds < 20.0" | "Odds < 10.0" | "All Odds"
  minOdds: number;
  maxOdds: number | null;
  profit: number;
  bets: number;
  wins: number;
  strikeRate: number;
  avgOdds: number;
}

interface OddsRangeAnalysisProps {
  profitByOddsRange: ProfitByOddsRange[];
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
}

// Format points helper (2 decimal places)
function formatCurrency(num: number): string {
  return num.toFixed(2);
}

export function OddsRangeAnalysis({
  profitByOddsRange,
}: OddsRangeAnalysisProps) {
  // This summary is always linked to the top-level filters.
  // The API applies those filters first, then returns `profitByOddsRange` for the filtered dataset.
  const allOddsEntry = profitByOddsRange.find((r) => r.range === "All Odds");
  const filteredData = allOddsEntry
    ? {
        totalBets: allOddsEntry.bets,
        totalWins: allOddsEntry.wins,
        totalProfit: allOddsEntry.profit,
        avgOdds: allOddsEntry.avgOdds,
      }
    : { totalBets: 0, totalWins: 0, totalProfit: 0, avgOdds: null };
  const winRate =
    filteredData.totalBets > 0
      ? (filteredData.totalWins / filteredData.totalBets) * 100
      : 0;
  const roi =
    filteredData.totalBets > 0
      ? (filteredData.totalProfit / filteredData.totalBets) * 100
      : 0;

  return (
    <div>
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
          {filteredData.avgOdds !== null &&
            filteredData.avgOdds !== undefined && (
              <div className="text-center">
                <span className="font-semibold">Average Odds:</span>{" "}
                <span className="text-green">
                  {filteredData.avgOdds.toFixed(2)}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
