"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System3Page() {
  const description =
    "System 3 specialises in all-weather racing, combining pace analysis with draw bias to find profitable angles. This system produces 5-8 selections per week across UK and international all-weather tracks.";

  const methodology = [
    "Pace and early speed analysis",
    "Draw bias and track position",
    "Surface and distance combinations",
    "Recent form on all-weather surfaces",
    "Market movement and value identification",
  ];

  return (
    <SystemPageContent
      systemSlug="system-3"
      description={description}
      methodology={methodology}
    />
  );
}
