"use client";

import { useEffect, useState } from "react";
import { MembershipStatic } from "./static";
import dynamic from "next/dynamic";

const MembershipWithAuth = dynamic(
  () =>
    Promise.all([import("@/app/providors"), import("./membership")]).then(
      ([{ NextAuthProvider }, { Membership }]) => {
        return (props: any) => (
          <NextAuthProvider>
            <Membership {...props} />
          </NextAuthProvider>
        );
      }
    ),
  {
    loading: () => <MembershipStatic />,
  }
);

export function MembershipWrapper() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <MembershipStatic />;
  }

  return <MembershipWithAuth />;
}
