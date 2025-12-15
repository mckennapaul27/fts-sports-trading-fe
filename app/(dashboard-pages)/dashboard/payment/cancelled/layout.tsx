import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled | Fortis Sports Trading",
  description:
    "The payment process was not completed. You can try again anytime from your dashboard.",
  openGraph: {
    title: "Payment Cancelled | Fortis Sports Trading",
    description:
      "The payment process was not completed. You can try again anytime from your dashboard.",
    type: "website",
  },
};

export default function DashboardPaymentCancelledLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
