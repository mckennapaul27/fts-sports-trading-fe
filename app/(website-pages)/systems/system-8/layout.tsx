import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 8 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 8.",
  openGraph: {
    title: "System 8 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 8.",
    type: "website",
  },
};

export default function System8Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
