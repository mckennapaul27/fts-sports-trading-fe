"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Slant as Hamburger } from "hamburger-react";
import {
  LayoutDashboard,
  List,
  Key,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

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
            <nav className="p-4 space-y-2 flex flex-col h-full">
              <div className="flex-1 space-y-2">
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
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-white hover:bg-gold/20 hover:text-gold w-full cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {/* <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:left-0 lg:bg-dark-navy lg:border-r lg:border-gold/20 h-full">
        <div className="p-6 border-b border-gold/20">
          <h2 className="text-white text-xl font-bold font-heading">
            Dashboard
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col">
          <div className="flex-1 space-y-2">
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
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-white hover:bg-gold/20 hover:text-gold cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside> */}
      {/* Desktop Topbar*/}
      <div className="hidden lg:block fixed top-0 left-0 right-0 bg-dark-navy border-b border-gold/20 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <Image
              src="/logo-white-text.svg"
              alt="Logo"
              width={180}
              height={37}
              priority
              className="hidden xl:block"
            />

            {/* Navigation Tabs */}
            <nav className="flex-1 flex items-center justify-center">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-dark-navy/50 p-1 border border-gold/20">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-navy gap-2",
                        isActive
                          ? "bg-gold text-dark-navy shadow-sm font-semibold"
                          : "text-white/70 hover:text-white hover:bg-gold/10"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Logout Button */}
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-sm transition-colors text-white/70 hover:text-white hover:bg-gold/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
