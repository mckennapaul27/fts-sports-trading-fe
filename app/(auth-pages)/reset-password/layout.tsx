import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Fortis Sports Trading",
  description: "Enter your new password to complete the reset process.",
  openGraph: {
    title: "Reset Password | Fortis Sports Trading",
    description: "Enter your new password to complete the reset process.",
    type: "website",
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

