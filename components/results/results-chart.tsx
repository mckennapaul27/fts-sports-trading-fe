"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface CumulativePLData {
  month: string;
  monthName: string;
  monthlyPL: number;
  cumulativePL: number;
  bets: number;
}

interface MonthlyBreakdownData {
  month: string;
  monthName: string;
  monthlyPL: number;
  bets: number;
  wins: number;
  strikeRate: number;
}

interface ResultsChartProps {
  viewMode: "cumulative" | "monthly";
  cumulativeData?: CumulativePLData[];
  monthlyData?: MonthlyBreakdownData[];
  currentPL?: number;
  maxDrawdown?: number;
  totalBets?: number;
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function calculateMaxDrawdown(cumulativeData: CumulativePLData[]): number {
  if (!cumulativeData || cumulativeData.length === 0) return 0;

  let maxPL = 0;
  let maxDrawdown = 0;

  cumulativeData.forEach((month) => {
    if (month.cumulativePL > maxPL) {
      maxPL = month.cumulativePL;
    }
    const drawdown = maxPL - month.cumulativePL;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown;
}

export function ResultsChart({
  viewMode,
  cumulativeData = [],
  monthlyData = [],
  currentPL = 0,
  totalBets = 0,
}: ResultsChartProps) {
  const maxDrawdown = calculateMaxDrawdown(cumulativeData);

  const chartOptions: Highcharts.Options =
    viewMode === "cumulative"
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
            categories: cumulativeData.map((m) => m.monthName),
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
              data: cumulativeData.map((m) => m.cumulativePL),
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
            type: "column",
            backgroundColor: "transparent",
            height: 400,
          },
          title: {
            text: undefined,
          },
          xAxis: {
            categories: monthlyData.map((m) => m.monthName),
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
              name: "Monthly P/L",
              type: "column",
              data: monthlyData.map((m) => m.monthlyPL),
              color: "var(--color-green)",
            },
          ],
          legend: {
            enabled: false,
          },
          credits: {
            enabled: false,
          },
          plotOptions: {
            column: {
              enableMouseTracking: true,
            },
          },
          tooltip: {
            formatter: function () {
              const month = monthlyData[this.point.index];
              return `<b>${this.x}</b><br/>£${this.y?.toFixed(2)}<br/>Bets: ${
                month?.bets || 0
              }`;
            },
            style: {
              fontFamily: "var(--font-karla)",
            },
          },
        };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
      {viewMode === "cumulative" && cumulativeData.length > 0 ? (
        <>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-dark-navy">
              <span className="font-semibold">Current P/L:</span>{" "}
              {formatCurrency(currentPL)}
            </div>
            <div className="text-sm text-dark-navy">
              <span className="font-semibold">Max Drawdown:</span>{" "}
              {formatCurrency(maxDrawdown)}
            </div>
            <div className="text-sm text-dark-navy">
              <span className="font-semibold">Total Bets:</span> {totalBets}
            </div>
          </div>
        </>
      ) : viewMode === "monthly" && monthlyData.length > 0 ? (
        <>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t border-gray-200 gap-4">
            <div className="text-sm text-dark-navy">
              <span className="font-semibold">Total Bets:</span> {totalBets}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-dark-navy">
          No chart data available
        </div>
      )}
    </div>
  );
}
