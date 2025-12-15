import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Selections | Fortis Sports Trading",
  description: "Today's selections and recent results across all your systems.",
  openGraph: {
    title: "Daily Selections | Fortis Sports Trading",
    description:
      "Today's selections and recent results across all your systems.",
    type: "website",
  },
};

export default function SelectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
