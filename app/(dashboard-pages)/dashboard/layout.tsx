import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth-helpers";
import { redirect } from "next/navigation";
import { NextAuthProvider } from "@/app/providors";
import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";

export const metadata: Metadata = {
  title: "Dashboard | Fortis Sports Trading",
  description:
    "Your portfolio overview. View daily selections, system performance, and manage your subscription.",
  openGraph: {
    title: "Dashboard | Fortis Sports Trading",
    description:
      "Your portfolio overview. View daily selections, system performance, and manage your subscription.",
    type: "website",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <NextAuthProvider>
      <DashboardWrapper>{children}</DashboardWrapper>
    </NextAuthProvider>
  );
}
