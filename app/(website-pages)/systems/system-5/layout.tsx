import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 5 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 5.",
  openGraph: {
    title: "System 5 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 5.",
    type: "website",
  },
};

export default function System5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
