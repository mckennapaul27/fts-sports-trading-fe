import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Subscription | Fortis Sports Trading",
  description: "Review your selected plan and proceed to payment.",
  openGraph: {
    title: "Complete Your Subscription | Fortis Sports Trading",
    description: "Review your selected plan and proceed to payment.",
    type: "website",
  },
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
