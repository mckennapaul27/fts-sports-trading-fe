"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System7Page() {
  const description =
    "System 7 specialises in staying races and middle-distance events, utilising stamina indicators and pace scenarios to find value in longer contests. Generates 5-8 selections per week.";

  const methodology = [
    "Stamina and distance suitability",
    "Pace scenario analysis",
    "Staying pedigree evaluation",
    "Form over similar distances",
    "Late-race finishing ability",
  ];

  return (
    <SystemPageContent
      systemSlug="system-7"
      description={description}
      methodology={methodology}
    />
  );
}
