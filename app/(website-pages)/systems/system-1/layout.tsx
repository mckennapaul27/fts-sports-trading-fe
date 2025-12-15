import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 1 | Fortis Sports Trading",
  description:
    "View detailed performance data, results, and statistics for System 1. Our flagship trading system specializing in flat racing with over 30 form indicators.",
  openGraph: {
    title: "System 1 | Fortis Sports Trading",
    description:
      "View detailed performance data, results, and statistics for System 1. Our flagship trading system specializing in flat racing with over 30 form indicators.",
    type: "website",
  },
};

export default function System1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
