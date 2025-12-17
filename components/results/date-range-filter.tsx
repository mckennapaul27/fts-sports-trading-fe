"use client";

interface DateRangeFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  dateRangeText?: string;
  enableCustomRange?: boolean;
  customStartDate?: string;
  customEndDate?: string;
  onCustomRangeChange?: (startDate: string, endDate: string) => void;
}

const dateRanges = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "ytd", label: "YTD" },
  { value: "all", label: "All Time" },
];

export function DateRangeFilter({
  selectedRange,
  onRangeChange,
  dateRangeText,
  enableCustomRange = false,
  customStartDate = "",
  customEndDate = "",
  onCustomRangeChange,
}: DateRangeFilterProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-dark-navy mb-2">
        Date Range Filter
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Analyse specific time periods
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {dateRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
              selectedRange === range.value
                ? "bg-dark-navy text-white"
                : "bg-gray-100 text-dark-navy hover:bg-gray-200"
            }`}
          >
            {range.label}
          </button>
        ))}

        {enableCustomRange && (
          <button
            onClick={() => onRangeChange("custom")}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
              selectedRange === "custom"
                ? "bg-dark-navy text-white"
                : "bg-gray-100 text-dark-navy hover:bg-gray-200"
            }`}
          >
            Custom
          </button>
        )}
      </div>

      {enableCustomRange && selectedRange === "custom" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-dark-navy">
              Start date
            </span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) =>
                onCustomRangeChange?.(e.target.value, customEndDate)
              }
              className="border border-gray-200 rounded-sm px-3 py-2 text-sm text-dark-navy"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-dark-navy">End date</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) =>
                onCustomRangeChange?.(customStartDate, e.target.value)
              }
              className="border border-gray-200 rounded-sm px-3 py-2 text-sm text-dark-navy"
            />
          </label>
        </div>
      )}

      {dateRangeText && (
        <p className="text-sm text-gray-600">
          Currently viewing:{" "}
          <span className="font-semibold">{dateRangeText}</span>
        </p>
      )}
    </div>
  );
}
