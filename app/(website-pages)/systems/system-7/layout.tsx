import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 7 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 7.",
  openGraph: {
    title: "System 7 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 7.",
    type: "website",
  },
};

export default function System7Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
