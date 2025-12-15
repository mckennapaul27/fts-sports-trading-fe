import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account | Fortis Sports Trading",
  description: "Complete your registration and start your subscription.",
  openGraph: {
    title: "Create Your Account | Fortis Sports Trading",
    description: "Complete your registration and start your subscription.",
    type: "website",
  },
};

export default function RegisterAndSubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
