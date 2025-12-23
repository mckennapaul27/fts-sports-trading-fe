"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System6Page() {
  const description =
    "System 6 focuses on sprint races, analysing early pace, draw positions and track bias to identify front-runners and strong finishers. Produces 6-9 selections per week.";

  const methodology = [
    "Early pace and speed ratings",
    "Draw bias analysis by track",
    "Sprint distance specialisation",
    "Finishing kick and closing speed",
    "Track surface and going preferences",
  ];

  return (
    <SystemPageContent
      systemSlug="system-6"
      description={description}
      methodology={methodology}
    />
  );
}
