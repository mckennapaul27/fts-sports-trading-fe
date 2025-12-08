"use client";

import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { useState } from "react";

interface SystemCsvDownloadProps {
  systemId: string;
  systemName: string;
  totalBets: number;
}

export function SystemCsvDownload({
  systemId,
  systemName,
  totalBets,
}: SystemCsvDownloadProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const handleDownload = async (type: "all" | "date") => {
    try {
      setDownloading(type);
      let url = "";

      if (type === "all") {
        url = `${apiUrl}/api/performance/csv/${systemId}`;
      } else {
        // For date range, we'll need to implement a date picker
        // For now, just download all
        url = `${apiUrl}/api/performance/csv/${systemId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${systemName}-${type === "all" ? "complete" : "custom"}-${Date.now()}.csv`;
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-3">
              Download System Data
            </h2>
            <p className="text-lg text-gray-700">
              Export complete historical data for {systemName} including all
              fields: Date, Course, Selection, BSP, Result, P/L, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Complete History */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
              <h3 className="text-xl font-bold text-dark-navy mb-2">
                Complete History
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                All {totalBets.toLocaleString()} bets since launch
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => handleDownload("all")}
                disabled={downloading === "all"}
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading === "all" ? "Downloading..." : "Download Full CSV"}
              </Button>
            </div>

            {/* Custom Range */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
              <h3 className="text-xl font-bold text-dark-navy mb-2">
                Custom Range
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Select specific date range for export
              </p>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white border-gray-300 text-dark-navy hover:bg-gray-50"
                disabled
              >
                <Calendar className="w-5 h-5 mr-2" />
                Choose Dates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

