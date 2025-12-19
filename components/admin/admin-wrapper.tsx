import { AdminSidebar } from "./admin-sidebar";

interface AdminWrapperProps {
  children: React.ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <AdminSidebar /> */}
      {/* Topbar adds 64px (h-16) height, so we add pt-16 to main when topbar is visible */}
      <main className="p-6 pt-16  pb-16 lg:pb-24">{children}</main>
    </div>
  );
}
