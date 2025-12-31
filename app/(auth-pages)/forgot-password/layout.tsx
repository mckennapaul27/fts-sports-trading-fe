import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Fortis Sports Trading",
  description: "Reset your password to regain access to your account.",
  openGraph: {
    title: "Forgot Password | Fortis Sports Trading",
    description: "Reset your password to regain access to your account.",
    type: "website",
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


