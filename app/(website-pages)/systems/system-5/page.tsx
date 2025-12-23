"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System5Page() {
  const description =
    "System 5 concentrates on handicap races, employing sophisticated weight and rating analysis to uncover value in competitive fields. This system delivers 7-11 selections per week.";

  const methodology = [
    "Weight and rating differentials",
    "Handicap mark progression analysis",
    "Class drop and rise patterns",
    "Official ratings vs market assessment",
    "Recent form in similar class levels",
  ];

  return (
    <SystemPageContent
      systemSlug="system-5"
      description={description}
      methodology={methodology}
    />
  );
}
