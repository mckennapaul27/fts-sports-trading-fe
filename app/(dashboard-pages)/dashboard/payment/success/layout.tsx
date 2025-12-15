import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Activated | Fortis Sports Trading",
  description:
    "Your subscription is now active. You can access all your subscribed systems and start receiving daily selections.",
  openGraph: {
    title: "Subscription Activated | Fortis Sports Trading",
    description:
      "Your subscription is now active. You can access all your subscribed systems and start receiving daily selections.",
    type: "website",
  },
};

export default function DashboardPaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
