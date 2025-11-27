"use client";

interface DateRangeFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  dateRangeText?: string;
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
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              selectedRange === range.value
                ? "bg-dark-navy text-white"
                : "bg-gray-100 text-dark-navy hover:bg-gray-200"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {dateRangeText && (
        <p className="text-sm text-gray-600">
          Currently viewing: <span className="font-semibold">{dateRangeText}</span>
        </p>
      )}
    </div>
  );
}

