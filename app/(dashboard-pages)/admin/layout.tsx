import { authOptions } from "@/app/utils/auth-helpers";
import AdminWrapper from "@/components/admin/admin-wrapper";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextAuthProvider } from "@/app/providors";

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
