import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled | Fortis Sports Trading",
  description:
    "Your account has been created. Complete your subscription to get started.",
  openGraph: {
    title: "Payment Cancelled | Fortis Sports Trading",
    description:
      "Your account has been created. Complete your subscription to get started.",
    type: "website",
  },
};

export default function PaymentCancelledLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
