import Link from "next/link";
import { ArrowLeft, TrendingUp, Target, FileText } from "lucide-react";

interface SystemHeroProps {
  systemName: string;
  liveSince: string;
  totalPL: number;
  roi: number;
  strikeRate: number;
  totalBets: number;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
}

export function SystemHero({
  systemName,
  liveSince,
  totalPL,
  roi,
  strikeRate,
  totalBets,
}: SystemHeroProps) {
  const isPositive = totalPL >= 0;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            href="/systems"
            className="inline-flex items-center gap-2 text-dark-navy hover:text-teal transition-colors mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Systems
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-navy mb-2">
              {systemName}
            </h1>
            <p className="text-lg text-gray-600">Live Since {liveSince}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Total P/L */}
            <div className="bg-dark-navy rounded-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm opacity-80">Total P/L</span>
              </div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isPositive ? "+" : ""}
                {formatNumber(totalPL)} pts
              </div>
            </div>

            {/* ROI */}
            <div className="bg-dark-navy rounded-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm opacity-80">ROI</span>
              </div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  roi >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {roi >= 0 ? "+" : ""}
                {roi.toFixed(1)}%
              </div>
            </div>

            {/* Strike Rate */}
            <div className="bg-dark-navy rounded-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm opacity-80">Strike Rate</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {strikeRate.toFixed(0)}%
              </div>
            </div>

            {/* Total Bets */}
            <div className="bg-dark-navy rounded-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm opacity-80">Total Bets</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {formatNumber(totalBets)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
