import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing & Subscriptions | Fortis Sports Trading",
  description: "Manage your subscription, payment method, and billing history.",
  openGraph: {
    title: "Billing & Subscriptions | Fortis Sports Trading",
    description:
      "Manage your subscription, payment method, and billing history.",
    type: "website",
  },
};

export default function BillingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
