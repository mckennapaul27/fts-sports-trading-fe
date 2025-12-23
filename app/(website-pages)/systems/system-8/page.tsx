"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System8Page() {
  const description =
    "System 8 combines multiple racing disciplines, using cross-system analysis and market inefficiencies to identify the best value opportunities across all race types. Produces 8-12 selections per week.";

  const methodology = [
    "Multi-system correlation analysis",
    "Market inefficiency identification",
    "Cross-discipline form evaluation",
    "Value assessment across race types",
    "Optimal selection frequency management",
  ];

  return (
    <SystemPageContent
      systemSlug="system-8"
      description={description}
      methodology={methodology}
    />
  );
}
