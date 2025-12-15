import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results | Fortis Sports Trading",
  description:
    "Full, verified results for every system. Use filters and charts to analyse performance over time. All data is publicly available for complete transparency.",
  openGraph: {
    title: "Results | Fortis Sports Trading",
    description:
      "Full, verified results for every system. Use filters and charts to analyse performance over time. All data is publicly available for complete transparency.",
    type: "website",
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
