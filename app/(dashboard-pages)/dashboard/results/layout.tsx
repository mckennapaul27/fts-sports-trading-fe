import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Results | Fortis Sports Trading",
  description:
    "Full, verified results for every system. Use filters and charts to analyse performance over time.",
  openGraph: {
    title: "System Results | Fortis Sports Trading",
    description:
      "Full, verified results for every system. Use filters and charts to analyse performance over time.",
    type: "website",
  },
};

export default function DashboardResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
