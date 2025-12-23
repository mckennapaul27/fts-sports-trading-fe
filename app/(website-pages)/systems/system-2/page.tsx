"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System2Page() {
  const description =
    "System 2 focuses on jump racing, utilising advanced form analysis and going conditions to identify value opportunities. This system generates 6-10 selections per week during the National Hunt season.";

  const methodology = [
    "Going and ground condition analysis",
    "Jumps form over last 3 seasons",
    "Hurdle vs chase performance metrics",
    "Trainer form at specific tracks",
    "Weight and handicap analysis",
  ];

  return (
    <SystemPageContent
      systemSlug="system-2"
      description={description}
      methodology={methodology}
    />
  );
}
