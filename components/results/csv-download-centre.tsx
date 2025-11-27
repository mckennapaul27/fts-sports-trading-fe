"use client";

import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

interface System {
  _id: string;
  name: string;
  slug: string;
}

interface CsvDownloadCentreProps {
  systems: System[];
  totalBets?: number;
}

export function CsvDownloadCentre({
  systems,
  totalBets = 0,
}: CsvDownloadCentreProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const handleDownload = async (
    type: "all" | "system" | "date",
    systemId?: string
  ) => {
    try {
      setDownloading(type + (systemId || ""));
      let url = "";

      // Note: CSV endpoints need to be implemented on the backend
      // These endpoints are expected:
      // GET /api/performance/csv/all - all systems
      // GET /api/performance/csv/:systemId - single system
      // GET /api/performance/csv/:systemId?startDate=&endDate= - date range

      if (type === "all") {
        url = `${apiUrl}/api/performance/csv/all`;
      } else if (type === "system" && systemId) {
        url = `${apiUrl}/api/performance/csv/${systemId}`;
      } else {
        // For date range, we'll need to implement a date picker
        // For now, just download all
        url = `${apiUrl}/api/performance/csv/all`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `results-${type}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert(
        "Failed to download CSV. The CSV download endpoint may not be implemented yet."
      );
    } finally {
      setDownloading(null);
    }
  };

  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-3">
              CSV Download Centre
            </h2>
            <p className="text-lg text-dark-navy max-w-2xl mx-auto">
              Export full historical data for your own analysis. All fields
              included: Date, Country, Course, Time, Selection, BSP, Result,
              Liability, P/L, Running P/L.
            </p>
          </div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Complete Portfolio */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-4">
                <FileSpreadsheet size={48} className="text-teal" />
              </div>
              <h3 className="text-lg font-bold text-dark-navy mb-2">
                Complete Portfolio
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                All systems combined ({totalBets.toLocaleString()} bets)
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => handleDownload("all")}
                disabled={downloading === "all"}
              >
                <Download size={20} className="mr-2" />
                {downloading === "all" ? "Downloading..." : "Download All Data"}
              </Button>
            </div>

            {/* By System */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-4">
                <FileSpreadsheet size={48} className="text-teal" />
              </div>
              <h3 className="text-lg font-bold text-dark-navy mb-2">
                By System
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Download individual system results
              </p>
              <Button variant="white" size="lg" className="w-full" disabled>
                Select System
              </Button>
            </div>

            {/* By Date Range */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-4">
                <FileSpreadsheet size={48} className="text-teal" />
              </div>
              <h3 className="text-lg font-bold text-dark-navy mb-2">
                By Date Range
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Custom date range export
              </p>
              <Button variant="white" size="lg" className="w-full" disabled>
                Choose Dates
              </Button>
            </div>
          </div>

          {/* Quick Download by System */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <h3 className="text-lg font-bold text-dark-navy mb-4">
              Quick Download by System
            </h3>
            <div className="flex flex-wrap gap-3">
              {systems.slice(0, 8).map((system) => (
                <Button
                  key={system._id}
                  variant="white"
                  size="sm"
                  onClick={() => handleDownload("system", system._id)}
                  disabled={downloading === `system${system._id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  {system.name}
                </Button>
              ))}
            </div>
            {systems.length > 8 && (
              <p className="text-sm text-gray-600 mt-4">
                Systems 4-10 will be available as they launch
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
