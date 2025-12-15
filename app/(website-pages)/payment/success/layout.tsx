import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful | Fortis Sports Trading",
  description:
    "Your subscription has been activated. Welcome to Fortis Sports Trading!",
  openGraph: {
    title: "Payment Successful | Fortis Sports Trading",
    description:
      "Your subscription has been activated. Welcome to Fortis Sports Trading!",
    type: "website",
  },
};

export default function PaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
