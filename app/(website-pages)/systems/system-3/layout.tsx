import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 3 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 3.",
  openGraph: {
    title: "System 3 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 3.",
    type: "website",
  },
};

export default function System3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
