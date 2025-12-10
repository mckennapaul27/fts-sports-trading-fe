import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardSidebar />
      {/* Topbar adds 64px (h-16) height, so we add pt-16 to main when topbar is visible */}
      <main className="p-6 pt-16 lg:pt-34 pb-16 lg:pb-24">{children}</main>
    </div>
  );
}
