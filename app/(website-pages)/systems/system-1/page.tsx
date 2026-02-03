"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System1Page() {
  const description = (
    <>
      <p>
        System 1 is our <strong>flagship strategy</strong> and the foundation of the Fortis portfolio.
      </p>
      <p>
        It has been traded live since <strong>2019</strong> and fully tracked to <strong>Betfair Starting Price (BSP)</strong> since <strong>2021</strong>, giving us <strong>over 15,000 verified selections</strong>. With this depth of data, we're able to assess performance with genuine statistical confidence rather than short-term results.
      </p>
      <p>
        The system can be traded across multiple odds ranges. Alex personally focuses on selections <strong>under 20.0</strong>, but members have successfully traded it at different ranges depending on risk tolerance and approach. As always, we encourage you to <strong>break the data down yourself</strong> and decide what fits you best before committing.
      </p>
      <p>
        This system has already produced significant long-term profits, and the goal is simple: to push the <strong>all-time total beyond 1,000 points in 2026</strong>.
      </p>
    </>
  );

  const methodology: string[] = [];

  return (
    <SystemPageContent
      systemSlug="system-1"
      description={description}
      methodology={methodology}
    />
  );
}
