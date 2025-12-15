import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Fortis Sports Trading",
  description: "Welcome back to Fortis Sports Trading.",
  openGraph: {
    title: "Sign In | Fortis Sports Trading",
    description: "Welcome back to Fortis Sports Trading.",
    type: "website",
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
