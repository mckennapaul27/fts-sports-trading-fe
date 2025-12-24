"use client";

import { usePathname } from "next/navigation";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarTouch } from "./NavbarTouch";
import { ComplianceStrip } from "@/components/sections/compliance-strip";
import { Footer } from "./footer";

export function ConditionalNavbarFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardPage =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <>
      {!isDashboardPage && (
        <>
          <NavbarDesktop />
          <NavbarTouch />
        </>
      )}
      {children}
      {!isDashboardPage && (
        <>
          <ComplianceStrip />
          <Footer />
        </>
      )}
    </>
  );
}
