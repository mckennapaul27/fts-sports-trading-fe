import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 2 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 2.",
  openGraph: {
    title: "System 2 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 2.",
    type: "website",
  },
};

export default function System2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
