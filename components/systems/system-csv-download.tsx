"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface SystemCsvDownloadProps {
  systemId: string;
  systemName: string;
  systemSlug?: string;
  totalBets: number;
}

type FileFormat = "csv" | "xlsx";

export function SystemCsvDownload({
  systemId,
  systemName,
  systemSlug,
  totalBets,
}: SystemCsvDownloadProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>("csv");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const handleDownload = (
    type: "all" | "date",
    format: FileFormat = selectedFormat,
    dateStart?: string,
    dateEnd?: string
  ) => {
    const downloadKey = `${type}-${format}-${dateStart || ""}-${dateEnd || ""}`;

    // Set loading state immediately - this will trigger a re-render
    setDownloading(downloadKey);

    // Start the download asynchronously after state is set
    // Use setTimeout to ensure React has time to render the loading state
    setTimeout(async () => {
      try {
        let url = "";
        let filename = "";

        // Use the new API endpoint
        url = `${apiUrl}/api/downloads/system/${format}`;
        const params = new URLSearchParams();
        params.append("systemId", systemId);

        if (dateStart) {
          params.append("startDate", dateStart);
        }
        if (dateEnd) {
          params.append("endDate", dateEnd);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        // Generate filename based on filters
        const today = new Date().toISOString().split("T")[0];
        if (dateStart && dateEnd) {
          filename = `${
            systemSlug || systemName.toLowerCase().replace(/\s+/g, "-")
          }-${dateStart}_to_${dateEnd}-${today}.${format}`;
        } else {
          filename = `${
            systemSlug || systemName.toLowerCase().replace(/\s+/g, "-")
          }-${today}.${format}`;
        }

        const response = await fetch(url);

        // Check Content-Type to distinguish between file download and JSON response
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          // Handle error responses
          if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || `Download failed: ${response.statusText}`
            );
          }
          throw new Error(`Download failed: ${response.statusText}`);
        }

        // Check if response is JSON (no data available)
        if (contentType?.includes("application/json")) {
          const data = await response.json();
          if (data.message) {
            toast.error(
              data.message || "No data available for the selected criteria"
            );
            return;
          }
        }

        // Handle file download
        const blob = await response.blob();

        // Get filename from Content-Disposition header if available
        const contentDisposition = response.headers.get("content-disposition");
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);

        toast.success("Download started successfully");
      } catch (error) {
        console.error("Download error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to download file";
        toast.error(errorMessage);
      } finally {
        setDownloading(null);
      }
    }, 10);
  };

  const handleDateRangeDownload = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
    handleDownload("date", selectedFormat, startDate, endDate);
  };

  const isDownloading = (key: string) => downloading === key;

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
              fields: Date, Country, Course, Time, Selection, BSP, Result, P/L,
              Running P/L.
            </p>
          </div>

          {/* Format Selection */}
          <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
            <Label className="text-base font-semibold text-dark-navy mb-3 block">
              File Format
            </Label>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedFormat("csv")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
                  selectedFormat === "csv"
                    ? "border-teal bg-teal/10 text-teal"
                    : "border-gray-200 hover:border-gray-300 text-dark-navy"
                }`}
              >
                <FileText size={20} />
                <span className="font-medium">CSV</span>
              </button>
              <button
                onClick={() => setSelectedFormat("xlsx")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
                  selectedFormat === "xlsx"
                    ? "border-teal bg-teal/10 text-teal"
                    : "border-gray-200 hover:border-gray-300 text-dark-navy"
                }`}
              >
                <FileSpreadsheet size={20} />
                <span className="font-medium">XLSX</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {selectedFormat === "csv"
                ? "CSV format - compatible with Excel, Google Sheets, and all spreadsheet software"
                : "XLSX format - Excel format with proper formatting"}
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
                onClick={() => handleDownload("all", selectedFormat)}
                disabled={isDownloading(`all-${selectedFormat}--`)}
              >
                {isDownloading(`all-${selectedFormat}--`) ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={20} className="mr-2" />
                    Download Full ({selectedFormat.toUpperCase()})
                  </>
                )}
              </Button>
            </div>

            {/* Custom Range */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
              <h3 className="text-xl font-bold text-dark-navy mb-2">
                Custom Range
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select specific date range for export
              </p>
              <div className="space-y-3 mb-4">
                <div>
                  <Label
                    htmlFor="start-date"
                    className="text-sm font-medium text-dark-navy"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="end-date"
                    className="text-sm font-medium text-dark-navy"
                  >
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1"
                    min={startDate}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white border-gray-300 text-dark-navy hover:bg-gray-50"
                onClick={handleDateRangeDownload}
                disabled={
                  !startDate ||
                  !endDate ||
                  isDownloading(
                    `date-${selectedFormat}-${startDate}-${endDate}`
                  )
                }
              >
                {isDownloading(
                  `date-${selectedFormat}-${startDate}-${endDate}`
                ) ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Calendar size={20} className="mr-2" />
                    Download ({selectedFormat.toUpperCase()})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
