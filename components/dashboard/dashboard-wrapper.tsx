import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  return (
    <div className="min-h-screen bg-cream">
      <DashboardSidebar />
      <main className="lg:ml-72 p-6 lg:p-8">{children}</main>
    </div>
  );
}
