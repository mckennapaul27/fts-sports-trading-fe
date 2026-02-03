"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System4Page() {
  const description = (
    <>
      <p>
        System 4 was <strong>three years in the making</strong>, with <strong>2025</strong> being the first fully live and tracked year.
      </p>
      <p>
        This system is designed to <strong>take on poorly priced runners</strong>, most commonly favourites, and has a strong bias towards <strong>All-Weather racing</strong>. The <strong>maximum suggested odds are just 5.0</strong>, keeping prices tight and exposure controlled.
      </p>
      <p>
        Because of the short odds, the <strong>strike rate is naturally lower</strong> than many would expect, so performance tends to show a <strong>closer balance between winners and losers</strong> rather than long winning streaks. This is a system built on <strong>discipline, patience, and long-term edge</strong>, not quick wins.
      </p>
    </>
  );

  const methodology: string[] = [];

  return (
    <SystemPageContent
      systemSlug="system-4"
      description={description}
      methodology={methodology}
    />
  );
}
