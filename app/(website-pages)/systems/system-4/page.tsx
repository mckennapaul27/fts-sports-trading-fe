"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System4Page() {
  const description =
    "System 4 targets maiden and novice races, using pedigree analysis and early market indicators to identify first-time winners and improving types. Generates 4-7 selections per week.";

  const methodology = [
    "Pedigree and breeding analysis",
    "Sire and dam track records",
    "Early market movement patterns",
    "Trainer debut statistics",
    "Workout and trial form indicators",
  ];

  return (
    <SystemPageContent
      systemSlug="system-4"
      description={description}
      methodology={methodology}
    />
  );
}
