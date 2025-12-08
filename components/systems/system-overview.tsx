import { Check } from "lucide-react";

interface SystemOverviewProps {
  description: string;
  methodology: string[];
  performanceStats: {
    totalBets: number;
    averageOdds: number;
    longestWinStreak: number;
    longestLoseStreak: number;
    maxDrawdown: number;
  };
}

export function SystemOverview({
  description,
  methodology,
  performanceStats,
}: SystemOverviewProps) {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - System Overview */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
                System Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {description}
              </p>

              {/* Methodology */}
              <div>
                <h3 className="text-xl font-bold text-dark-navy mb-4">
                  Methodology
                </h3>
                <ul className="space-y-3">
                  {methodology.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side - Performance Stats Box */}
            <div>
              <div className="bg-gray-100 rounded-lg p-6 sm:p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-dark-navy mb-6">
                  Performance Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                    <span className="text-gray-600">Total Bets</span>
                    <span className="font-semibold text-dark-navy">
                      {performanceStats.totalBets.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                    <span className="text-gray-600">Average Odds</span>
                    <span className="font-semibold text-dark-navy">
                      {performanceStats.averageOdds.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                    <span className="text-gray-600">Longest Win Streak</span>
                    <span className="font-semibold text-green">
                      {performanceStats.longestWinStreak}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                    <span className="text-gray-600">Longest Lose Streak</span>
                    <span className="font-semibold text-red-600">
                      {performanceStats.longestLoseStreak}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Drawdown</span>
                    <span className="font-semibold text-red-600">
                      {performanceStats.maxDrawdown >= 0 ? "+" : ""}
                      {performanceStats.maxDrawdown} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
