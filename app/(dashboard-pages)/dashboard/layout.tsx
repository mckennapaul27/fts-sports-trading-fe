import { NextAuthProvider } from "@/app/providors";
import { authOptions } from "@/app/utils/auth-helpers";
import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
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
