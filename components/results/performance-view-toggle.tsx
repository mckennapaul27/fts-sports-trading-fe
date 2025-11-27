"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ViewMode = "cumulative" | "monthly" | "odds-range";

interface PerformanceViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showOddsRange?: boolean;
}

export function PerformanceViewToggle({
  viewMode,
  onViewModeChange,
  showOddsRange = true,
}: PerformanceViewToggleProps) {
  return (
    <div className="mb-6">
      <Tabs
        value={viewMode}
        onValueChange={onViewModeChange}
        className="w-full overflow-x-auto"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="cumulative" className="cursor-pointer">
            Cumulative Profit/Loss
          </TabsTrigger>
          <TabsTrigger value="monthly" className="cursor-pointer">
            Monthly Breakdown
          </TabsTrigger>
          {showOddsRange && (
            <TabsTrigger value="odds-range" className="cursor-pointer">
              Analyse Profit by Odds Range
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
}
