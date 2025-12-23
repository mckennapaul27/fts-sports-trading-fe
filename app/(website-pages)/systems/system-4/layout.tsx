import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 4 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 4.",
  openGraph: {
    title: "System 4 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 4.",
    type: "website",
  },
};

export default function System4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
