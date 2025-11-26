import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// async function getSystemsAndStats(): Promise<
//   | {
//       systems: System[];
//       selectedSystemId: string;
//       stats: PerformanceStats | null;
//     }
//   | undefined
// > {
//   const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
//   let systems: System[] = [];
//   let selectedSystemId: string = "";
//   let stats: PerformanceStats | null = null;
//   const fetchSystems = async () => {
//     try {
//       const response = await fetch(`${apiUrl}/api/performance/systems`);
//       const data = await response.json();
//       if (data.success && data.data.length > 0) {
//         systems = data.data;
//         selectedSystemId = data.data[0]._id;
//       } else {
//       }
//     } catch (err) {
//       console.error("Error fetching systems:", err);
//     }
//   };

//   await fetchSystems();

//   if (!selectedSystemId) return;

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(
//         `${apiUrl}/api/performance/stats/${selectedSystemId}`
//       );
//       const data = await response.json();
//       if (data.success) {
//         console.log(data.data);
//         stats = data.data;
//       } else {
//         console.error("Error fetching stats:", data.error);
//       }
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//     }
//   };

//   await fetchStats();

//   return { systems, selectedSystemId, stats };
// }

export function PerformanceGlanceStatic() {
  //   const data = await getSystemsAndStats();
  //   const { systems, selectedSystemId, stats } = data!;
  //   console.log(systems, selectedSystemId, stats);
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-navy mb-3">
              Performance At A Glance
            </h2>
            <p className="text-lg text-dark-navy mb-6">
              Real results from live trading. All data is verified and publicly
              available.
            </p>
          </div>

          {/* System Selector */}
          <div className="max-w-xs mb-4">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-white text-dark-navy focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold">
              <option>System 1</option>
            </select>
          </div>

          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {/* Total P/L */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Total P/L</div>
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-1 ${
                    0 >= 0 ? "text-green" : "text-red-600"
                  }`}
                >
                  {formatNumber(0)} pts
                </div>
                <div className="text-sm text-gray-600">
                  Portfolio cumulative
                </div>
              </div>

              {/* Strike Rate */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Win Rate</div>
                <div className="text-2xl sm:text-3xl font-bold text-green mb-1">
                  0%
                </div>
                <div className="text-sm text-gray-600">System 1</div>
              </div>

              {/* Total Bets */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">Total Bets</div>
                <div className="text-2xl sm:text-3xl font-bold text-green mb-1">
                  {formatNumber(0)}
                </div>
                <div className="text-sm text-gray-600">Since inception</div>
              </div>

              {/* ROI */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-sm text-dark-navy mb-1">ROI</div>
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-1 ${
                    0 >= 0 ? "text-green" : "text-red-600"
                  }`}
                >
                  0%
                </div>
                <div className="text-sm text-gray-600">
                  Return on investment
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mb-8">
              <Tabs defaultValue="cumulative" className="w-full">
                <TabsList className="mb-6  gap-3">
                  <TabsTrigger value="cumulative">
                    Cumulative{" "}
                    <span className="hidden sm:inline">Profit/Loss</span>
                  </TabsTrigger>
                  <TabsTrigger value="odds">
                    <span className="inline sm:hidden">Odds Range</span>
                    <span className="hidden sm:inline">
                      Analyse Profit by Odds Range
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cumulative" className="mt-0">
                  <div className="text-center py-12 text-dark-navy">
                    No chart data available
                  </div>
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
