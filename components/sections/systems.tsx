import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChartLine, ChartNoAxesColumnIncreasing, Target } from "lucide-react";

interface System {
  systemId: string;
  systemName: string;
  systemSlug: string;
  description: string;
  totalPL: number;
  strikeRate: number;
  roi: number;
  totalBets: number;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
}

function ROIIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect x="4" y="12" width="3" height="4" fill="var(--color-dark-navy)" />
      <rect x="8.5" y="8" width="3" height="8" fill="var(--color-dark-navy)" />
      <rect x="13" y="4" width="3" height="12" fill="var(--color-dark-navy)" />
    </svg>
  );
}

function StrikeRateIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="var(--color-dark-navy)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="10" cy="10" r="3" fill="var(--color-dark-navy)" />
    </svg>
  );
}

function TotalPLIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M3 14L7 10L11 12L17 6"
        stroke="var(--color-green)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 6L17 2L13 2"
        stroke="var(--color-green)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckmarkBadgeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3333 4L6 11.3333L2.66667 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

async function getAllSystems(): Promise<System[]> {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  try {
    const response = await fetch(`${apiUrl}/api/performance/all-systems`, {
      cache: "force-cache", // Enable static generation
    });
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error("Error fetching systems:", err);
    return [];
  }
}

// Extract year from system name or use default
function getLiveSinceYear(systemName: string, index: number): string {
  // Try to extract year from system name, or use defaults based on index
  const yearMatch = systemName.match(/\d{4}/);
  if (yearMatch) {
    return yearMatch[0];
  }
  // Default years based on system number
  const defaultYears = ["2021", "2022", "2022"];
  return defaultYears[index] || "2022";
}

export async function Systems() {
  const systems = await getAllSystems();

  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-3">
              Trading Systems
            </h2>
            <p className="text-lg text-dark-navy max-w-2xl mx-auto">
              Each system is independently tracked with complete transparency.
            </p>
          </div>

          {/* Systems Grid */}
          {systems.length === 0 ? (
            <div className="text-center py-12 text-dark-navy">
              No systems available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {systems.map((system, index) => {
                const liveSinceYear = getLiveSinceYear(
                  system.systemName,
                  index
                );

                return (
                  <div
                    key={system.systemId}
                    className="bg-white rounded-lg shadow-sm  flex flex-col border border-gray-200"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 sm:p-8">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-gold/15 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                          <Image
                            src="/icon-from-logo.svg"
                            alt="System icon"
                            width={26}
                            height={26}
                          />
                        </div>
                        <div>
                          <h3 className="text-base xl:text-lg font-bold text-dark-navy  leading-tight">
                            {system.systemName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Live Since {liveSinceYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        <CheckmarkBadgeIcon />
                        <span>Included</span>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="flex items-center justify-center gap-20 border-t border-b border-gray-200 py-6">
                      {/* ROI */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <ChartNoAxesColumnIncreasing className="w-4 h-4" />
                          <span className="text-sm text-gray-600">ROI</span>
                        </div>
                        <div className="text-base font-bold text-dark-navy">
                          {system.roi.toFixed(1)}%
                        </div>
                      </div>

                      {/* Strike Rate */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4" />
                          <span className="text-sm text-gray-600">SR</span>
                        </div>
                        <div className="text-base font-bold text-dark-navy">
                          {system.strikeRate.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    {/* Total P/L */}
                    <div className="mx-auto p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <ChartLine className="w-4 h-4" />
                        <span className="text-sm text-gray-600">Total P/L</span>
                      </div>
                      <div
                        className={`text-base font-bold ${
                          system.totalPL >= 0 ? "text-green" : "text-red-600"
                        }`}
                      >
                        {system.totalPL >= 0 ? "+" : ""}
                        {formatNumber(system.totalPL)}pts
                      </div>
                    </div>

                    {/* Description */}
                    {system.description && (
                      <p className="text-dark-navy mb-6 flex-grow p-6">
                        {system.description}
                      </p>
                    )}

                    <div className="p-6 pt-0">
                      {/* CTA Button */}
                      <Button
                        variant="default"
                        size="lg"
                        className="w-full"
                        asChild
                      >
                        <Link href={`/systems/${system.systemSlug}`}>
                          View System
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
