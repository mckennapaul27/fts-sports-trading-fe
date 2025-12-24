"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ViewMode = "cumulative" | "monthly" | "odds-range";

interface PerformanceViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showOddsRange?: boolean;
  className?: string;
}

export function PerformanceViewToggle({
  viewMode,
  onViewModeChange,
  showOddsRange = true,
  className,
}: PerformanceViewToggleProps) {
  const handleValueChange = (value: string) => {
    // Type guard to ensure value is a valid ViewMode
    if (
      value === "cumulative" ||
      value === "monthly" ||
      value === "odds-range"
    ) {
      onViewModeChange(value);
    }
  };

  return (
    <div className={"mb-6"}>
      <Tabs
        value={viewMode}
        onValueChange={handleValueChange}
        className="w-full overflow-x-auto"
      >
        <TabsList className={cn("mb-4", className)}>
          <TabsTrigger value="odds-range" className="cursor-pointer">
            Summary
          </TabsTrigger>
          <TabsTrigger value="cumulative" className="cursor-pointer">
            Cumulative Profit/Loss
          </TabsTrigger>
          <TabsTrigger value="monthly" className="cursor-pointer">
            Monthly Breakdown
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
