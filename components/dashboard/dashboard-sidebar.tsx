"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Slant as Hamburger } from "hamburger-react";
import { LayoutDashboard, List, Key, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Selections",
    href: "/dashboard/selections",
    icon: List,
  },
  {
    label: "System Access",
    href: "/dashboard/system-access",
    icon: Key,
  },
  {
    label: "Billings & Subscriptions",
    href: "/dashboard/billings",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden bg-dark-navy border-b border-gold/20 px-6 py-4">
        <Hamburger
          toggled={isOpen}
          toggle={setOpen}
          color="var(--color-cream)"
        />
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-dark-navy w-72 h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gold/20">
              <h2 className="text-white text-xl font-bold font-heading">
                Dashboard
              </h2>
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors",
                      isActive
                        ? "bg-gold text-dark-navy font-semibold"
                        : "text-white hover:bg-gold/20 hover:text-gold"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:left-0 lg:bg-dark-navy lg:border-r lg:border-gold/20 h-full">
        <div className="p-6 border-b border-gold/20">
          <h2 className="text-white text-xl font-bold font-heading">
            Dashboard
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors",
                  isActive
                    ? "bg-gold text-dark-navy font-semibold"
                    : "text-white hover:bg-gold/20 hover:text-gold"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
