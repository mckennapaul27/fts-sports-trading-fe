import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 6 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 6.",
  openGraph: {
    title: "System 6 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 6.",
    type: "website",
  },
};

export default function System6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
