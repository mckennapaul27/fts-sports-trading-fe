"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System2Page() {
  const description = (
    <>
      <p>
        The idea behind System 2 began in <strong>late 2024</strong>, with live trading starting in <strong>2025</strong> across two separate systems.
      </p>
      <p>
        After a full year of live results, those two profitable approaches were <strong>consolidated into a single, streamlined system</strong>, which is now traded live in <strong>2026</strong>. The aim was to reduce overlap, smooth performance, and create a more consistent long-term profile.
      </p>
      <p>
        The suggested maximum odds are <strong>10.0</strong>, making this a more controlled system in terms of variance. As always, members are encouraged to <strong>analyse the data carefully</strong> and decide how (and if) the system fits into their wider portfolio.
      </p>
    </>
  );

  const methodology: string[] = [];

  return (
    <SystemPageContent
      systemSlug="system-2"
      description={description}
      methodology={methodology}
    />
  );
}
