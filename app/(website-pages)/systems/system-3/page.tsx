"use client";

import { SystemPageContent } from "@/components/systems/system-page-content";

export default function System3Page() {
  const description = (
    <>
      <p>
        System 3 was also born from research carried out in <strong>late 2024</strong>.
      </p>
      <p>
        During <strong>2025</strong>, three related systems were traded live before being <strong>merged into one refined strategy</strong>. The result is a system with a <strong>higher ceiling</strong>, but also <strong>more variance</strong> than System 2.
      </p>
      <p>
        The suggested maximum odds are <strong>20.0</strong>, which naturally brings bigger swings alongside the potential for stronger growth. This system is best suited to traders who are comfortable with volatility and understand the importance of bank management.
      </p>
      <p>
        As with every Fortis system, the data is there — take the time to <strong>deep dive</strong> before committing.
      </p>
    </>
  );

  const methodology: string[] = [];

  return (
    <SystemPageContent
      systemSlug="system-3"
      description={description}
      methodology={methodology}
    />
  );
}
