import { authOptions } from "@/app/utils/auth-helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const firstName = session.user?.firstName || "User";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-cream rounded-lg flex items-center justify-between p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center">
            <User className="w-8 h-8 text-dark-navy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-navy font-heading">
              Welcome back, {firstName}
            </h1>
            <p className="text-dark-navy/70 mt-1">
              Here&apos;s your portfolio overview for today.
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-dark-navy font-medium">All Systems Member</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-dark-navy font-heading mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* View Daily Selections Card */}
          <Link href="/dashboard/selections">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start justify-between group">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-green/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green" />
                </div>
                <h3 className="text-lg font-bold text-dark-navy font-heading mb-2">
                  View Daily Selections
                </h3>
                <p className="text-dark-navy/70 text-sm">
                  Access today&apos;s selections and check results from recent
                  races.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-dark-navy/40 group-hover:text-dark-navy transition-colors flex-shrink-0 ml-4" />
            </div>
          </Link>

          {/* Systems Performance Card */}
          <Link href="/dashboard/system-access">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start justify-between group">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-lg font-bold text-dark-navy font-heading mb-2">
                  Systems Performance
                </h3>
                <p className="text-dark-navy/70 text-sm">
                  View detailed performance data for each individual system.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-dark-navy/40 group-hover:text-dark-navy transition-colors flex-shrink-0 ml-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-dark-navy font-heading mb-4">
          Yesterday's Results
        </h2>
        <div className="space-y-3">
          {/* Activity Item 1 - Won */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-dark-navy font-heading">
                  System 1 - Selection won
                </h3>
                <p className="text-sm text-dark-navy/70 mt-1">
                  Horse C at Kempton (BSP 5.2) - +2.1 pts
                </p>
              </div>
            </div>
            <div className="text-sm text-dark-navy/60 flex-shrink-0 ml-4">
              2 hours ago
            </div>
          </div>

          {/* Activity Item 2 - Lost */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-dark-navy font-heading">
                  System 2 - Selection lost
                </h3>
                <p className="text-sm text-dark-navy/70 mt-1">
                  Horse A at Newmarket (BSP 8.4) - -1.0 pts
                </p>
              </div>
            </div>
            <div className="text-sm text-dark-navy/60 flex-shrink-0 ml-4">
              4 hours ago
            </div>
          </div>

          {/* Activity Item 3 - Won */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-dark-navy font-heading">
                  System 3 - Selection won
                </h3>
                <p className="text-sm text-dark-navy/70 mt-1">
                  Horse F at Doncaster (BSP 6.7) - +2.4 pts
                </p>
              </div>
            </div>
            <div className="text-sm text-dark-navy/60 flex-shrink-0 ml-4">
              Yesterday
            </div>
          </div>
        </div>
      </div>

      {/* Your Plan */}
      <div>
        <h2 className="text-xl font-bold text-dark-navy font-heading mb-4">
          Your Plan
        </h2>
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-dark-navy font-heading mb-1">
              All Systems - Monthly
            </h3>
            <p className="text-dark-navy/70 mb-1">£30.00 per month</p>
            <p className="text-sm text-dark-navy/60">
              Next billing: December 11, 2024
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/billings">Manage Plan</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
