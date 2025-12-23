"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System1Page() {
  const description =
    "System 1 is our flagship trading system, specialising in flat racing. It uses over 30 form indicators to identify overvalued favourites, generating 8-12 selections per week.";

  const methodology = [
    "Class analysis across multiple race types",
    "Form indicators over last 5 runs",
    "Track and distance records",
    "Trainer and jockey performance metrics",
    "Pace and running style analysis",
  ];

  return (
    <SystemPageContent
      systemSlug="system-1"
      description={description}
      methodology={methodology}
    />
  );
}
