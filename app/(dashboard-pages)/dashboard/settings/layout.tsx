import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Fortis Sports Trading",
  description: "Manage your account preferences and notification settings.",
  openGraph: {
    title: "Settings | Fortis Sports Trading",
    description: "Manage your account preferences and notification settings.",
    type: "website",
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
