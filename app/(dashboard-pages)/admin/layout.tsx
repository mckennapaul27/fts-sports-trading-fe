import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth-helpers";
import { redirect } from "next/navigation";
import { NextAuthProvider } from "@/app/providors";
import AdminWrapper from "@/components/admin/admin-wrapper";

export const metadata: Metadata = {
  title: "Admin Dashboard | Fortis Sports Trading",
  description: "Manage selections, results, and system administration.",
  openGraph: {
    title: "Admin Dashboard | Fortis Sports Trading",
    description: "Manage selections, results, and system administration.",
    type: "website",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <NextAuthProvider>
      <AdminWrapper>{children}</AdminWrapper>
    </NextAuthProvider>
  );
}
