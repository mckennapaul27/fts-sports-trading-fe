"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface System {
  _id: string;
  name: string;
  slug: string;
}

interface CsvDownloadCentreProps {
  systems: System[];
  totalBets?: number;
}

type FileFormat = "csv" | "xlsx";

export function CsvDownloadCentre({
  systems,
  totalBets = 0,
}: CsvDownloadCentreProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>("csv");
  const [selectedSystemId, setSelectedSystemId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const handleDownload = (
    type: "all" | "system" | "date",
    format: FileFormat = selectedFormat,
    systemId?: string,
    dateStart?: string,
    dateEnd?: string
  ) => {
    const downloadKey = `${type}-${format}-${systemId || ""}-${
      dateStart || ""
    }-${dateEnd || ""}`;

    // Set loading state immediately - this will trigger a re-render
    setDownloading(downloadKey);

    // Start the download asynchronously after state is set
    // Use setTimeout to ensure React has time to render the loading state
    setTimeout(async () => {
      try {
        let url = "";
        let filename = "";

        if (type === "all") {
          // Download all results
          url = `${apiUrl}/api/downloads/all/${format}`;
          filename = `complete-portfolio-${
            new Date().toISOString().split("T")[0]
          }.${format}`;
        } else {
          // Download filtered results
          url = `${apiUrl}/api/downloads/system/${format}`;
          const params = new URLSearchParams();

          if (systemId) {
            params.append("systemId", systemId);
          }
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
          if (systemId && dateStart && dateEnd) {
            const system = systems.find((s) => s._id === systemId);
            filename = `${
              system?.slug || "results"
            }-${dateStart}_to_${dateEnd}-${today}.${format}`;
          } else if (systemId) {
            const system = systems.find((s) => s._id === systemId);
            filename = `${system?.slug || "results"}-${today}.${format}`;
          } else if (dateStart && dateEnd) {
            filename = `results-${dateStart}_to_${dateEnd}-${today}.${format}`;
          } else {
            filename = `results-${today}.${format}`;
          }
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

  const handleSystemDownload = () => {
    if (!selectedSystemId) {
      toast.error("Please select a system");
      return;
    }
    handleDownload("system", selectedFormat, selectedSystemId);
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
    handleDownload("date", selectedFormat, undefined, startDate, endDate);
  };

  const handleSystemWithDateDownload = () => {
    if (!selectedSystemId) {
      toast.error("Please select a system");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
    handleDownload(
      "system",
      selectedFormat,
      selectedSystemId,
      startDate,
      endDate
    );
  };

  const isDownloading = (key: string) => {
    if (downloading === key) {
      console.log("key", key);
      console.log("downloading", downloading);
      return true;
    }
    return false;
  };

  console.log("downloading", downloading);

  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-3">
              CSV/XLSX Download Centre
            </h2>
            <p className="text-lg text-dark-navy max-w-2xl mx-auto">
              Export full historical data for your own analysis. All fields
              included: Date, Country, Course, Time, Selection, BSP, Result,
              P/L, Running P/L.
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
                : "XLSX format - Excel format with multiple sheets for 'All' downloads"}
            </p>
          </div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
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
                onClick={() => handleDownload("all", selectedFormat)}
                disabled={isDownloading(`all-${selectedFormat}---`)}
              >
                {isDownloading(`all-${selectedFormat}---`) ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={20} className="mr-2" />
                    Download All Data ({selectedFormat.toUpperCase()})
                  </>
                )}
              </Button>
            </div>

            {/* By System */}
            {/* <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
              <div className="flex justify-center mb-4">
                <FileSpreadsheet size={48} className="text-teal" />
              </div>
              <h3 className="text-lg font-bold text-dark-navy mb-2 text-center">
                By System
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Download individual system results
              </p>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="system-select"
                    className="text-sm font-medium text-dark-navy"
                  >
                    Select System
                  </Label>
                  <select
                    id="system-select"
                    value={selectedSystemId}
                    onChange={(e) => setSelectedSystemId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-sm text-sm text-dark-navy bg-white focus:outline-none focus:ring-2 focus:ring-teal"
                  >
                    <option value="">Choose a system...</option>
                    {systems.map((system) => (
                      <option key={system._id} value={system._id}>
                        {system.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="white"
                  size="lg"
                  className="w-full"
                  onClick={handleSystemDownload}
                  disabled={
                    !selectedSystemId ||
                    isDownloading(
                      `system-${selectedFormat}-${selectedSystemId}--`
                    )
                  }
                >
                  {isDownloading(
                    `system-${selectedFormat}-${selectedSystemId}--`
                  ) ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={20} className="mr-2" />
                      Download ({selectedFormat.toUpperCase()})
                    </>
                  )}
                </Button>
              </div>
            </div> */}

            {/* By Date Range */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
              <div className="flex justify-center mb-4">
                <FileSpreadsheet size={48} className="text-teal" />
              </div>
              <h3 className="text-lg font-bold text-dark-navy mb-2 text-center">
                By Date Range
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Custom date range export
              </p>
              <div className="space-y-3">
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
                <Button
                  variant="white"
                  size="lg"
                  className="w-full"
                  onClick={handleDateRangeDownload}
                  disabled={
                    !startDate ||
                    !endDate ||
                    isDownloading(
                      `date-${selectedFormat}--${startDate}-${endDate}`
                    )
                  }
                >
                  {isDownloading(
                    `date-${selectedFormat}--${startDate}-${endDate}`
                  ) ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={20} className="mr-2" />
                      Download ({selectedFormat.toUpperCase()})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Combined System + Date Range */}
          <div className="mb-12 bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <h3 className="text-lg font-bold text-dark-navy mb-4">
              System + Date Range
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Download results for a specific system within a date range
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label
                  htmlFor="combined-system"
                  className="text-sm font-medium text-dark-navy"
                >
                  Select System
                </Label>
                <select
                  id="combined-system"
                  value={selectedSystemId}
                  onChange={(e) => setSelectedSystemId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-sm text-sm text-dark-navy bg-white focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">Choose a system...</option>
                  {systems.map((system) => (
                    <option key={system._id} value={system._id}>
                      {system.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label
                  htmlFor="combined-start-date"
                  className="text-sm font-medium text-dark-navy"
                >
                  Start Date
                </Label>
                <Input
                  id="combined-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="combined-end-date"
                  className="text-sm font-medium text-dark-navy"
                >
                  End Date
                </Label>
                <Input
                  id="combined-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                  min={startDate}
                />
              </div>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSystemWithDateDownload}
              disabled={
                !selectedSystemId ||
                !startDate ||
                !endDate ||
                isDownloading(
                  `system-${selectedFormat}-${selectedSystemId}-${startDate}-${endDate}`
                )
              }
            >
              {isDownloading(
                `system-${selectedFormat}-${selectedSystemId}-${startDate}-${endDate}`
              ) ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={20} className="mr-2" />
                  Download ({selectedFormat.toUpperCase()})
                </>
              )}
            </Button>
          </div>

          {/* Quick Download by System */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <h3 className="text-lg font-bold text-dark-navy mb-4">
              Quick Download by System
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Quick access to download all results for individual systems
            </p>
            <div className="flex flex-wrap gap-3">
              {systems.map((system) => {
                const isSystemDownloading = isDownloading(
                  `system-${selectedFormat}-${system._id}--`
                );
                console.log("isSystemDownloading", isSystemDownloading);
                return (
                  <Button
                    key={system._id}
                    variant="white"
                    size="sm"
                    onClick={() =>
                      handleDownload("system", selectedFormat, system._id)
                    }
                    disabled={isSystemDownloading}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {isSystemDownloading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        {system.name}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
