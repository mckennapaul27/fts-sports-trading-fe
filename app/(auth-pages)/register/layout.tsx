import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account | Fortis Sports Trading",
  description:
    "Join Fortis Sports Trading and start your journey to profitable sports trading.",
  openGraph: {
    title: "Create Your Account | Fortis Sports Trading",
    description:
      "Join Fortis Sports Trading and start your journey to profitable sports trading.",
    type: "website",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
