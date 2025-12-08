"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChartLine,
  ChartNoAxesColumnIncreasing,
  Target,
  Search,
  Lock,
} from "lucide-react";

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

type FilterType = "all" | "included" | "locked";

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
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

// Extract year from system name or use default
function getLiveSinceYear(systemName: string, index: number): string {
  const yearMatch = systemName.match(/\d{4}/);
  if (yearMatch) {
    return yearMatch[0];
  }
  const defaultYears = ["2021", "2022", "2022"];
  return defaultYears[index] || "2022";
}

// Determine if a system is locked (for now, systems 7, 9, 10, 11, 12 are locked)
// In production, this would come from the API or user's subscription status
function isSystemLocked(systemName: string, index: number): boolean {
  const systemNumber = parseInt(systemName.match(/\d+/)?.[0] || "0");
  return [7, 9, 10, 11, 12].includes(systemNumber);
}

export function SystemsGrid() {
  const [systems, setSystems] = useState<System[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/performance/all-systems`);
        const data = await response.json();
        if (data.success && data.data) {
          setSystems(data.data);
        }
      } catch (err) {
        console.error("Error fetching systems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystems();
  }, [apiUrl]);

  // Filter and search systems
  const filteredSystems = systems.filter((system, index) => {
    const locked = isSystemLocked(system.systemName, index);
    const matchesSearch =
      system.systemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === "included") return !locked;
    if (filter === "locked") return locked;

    return true;
  });

  if (loading) {
    return (
      <section className="bg-cream py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12 text-dark-navy">
              Loading systems...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Controls */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search systems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={
                    filter === "all"
                      ? "bg-dark-navy text-white"
                      : "bg-white text-dark-navy border-gray-300"
                  }
                >
                  All
                </Button>
                <Button
                  variant={filter === "included" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("included")}
                  className={
                    filter === "included"
                      ? "bg-dark-navy text-white"
                      : "bg-white text-dark-navy border-gray-300"
                  }
                >
                  Included
                </Button>
                <Button
                  variant={filter === "locked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("locked")}
                  className={
                    filter === "locked"
                      ? "bg-dark-navy text-white"
                      : "bg-white text-dark-navy border-gray-300"
                  }
                >
                  Locked
                </Button>
              </div>
            </div>

            {/* System Count */}
            <p className="text-sm text-gray-600">
              Showing {filteredSystems.length} system
              {filteredSystems.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Systems Grid */}
          {filteredSystems.length === 0 ? (
            <div className="text-center py-12 text-dark-navy">
              No systems found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredSystems.map((system, index) => {
                const liveSinceYear = getLiveSinceYear(
                  system.systemName,
                  index
                );
                const locked = isSystemLocked(system.systemName, index);

                return (
                  <div
                    key={system.systemId}
                    className="bg-white rounded-lg shadow-sm flex flex-col border border-gray-200"
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
                          <h3 className="text-base xl:text-lg font-bold text-dark-navy leading-tight">
                            {system.systemName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Live Since {liveSinceYear}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          locked
                            ? "bg-gray-100 text-gray-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {locked ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </>
                        ) : (
                          <>
                            <CheckmarkBadgeIcon />
                            <span>Included</span>
                          </>
                        )}
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
                        {formatNumber(Number(system.totalPL))} pts
                      </div>
                    </div>

                    {/* Description */}
                    {system.description && (
                      <p className="text-dark-navy mb-6 flex-grow px-6 text-sm">
                        {system.description}
                      </p>
                    )}

                    <div className="p-6 pt-0">
                      {/* CTA Button */}
                      {locked ? (
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full bg-white border-gray-300 text-dark-navy hover:bg-gray-50"
                          asChild
                        >
                          <Link href="/membership">Upgrade to Access</Link>
                        </Button>
                      ) : (
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
                      )}
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

