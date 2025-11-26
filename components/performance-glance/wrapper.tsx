"use client";

import { useEffect, useState } from "react";
import { PerformanceGlanceStatic } from "./static";
import dynamic from "next/dynamic";

const PerformanceGlanceDynamic = dynamic(
  () => import("./dynamic").then((mod) => mod.PerformanceGlance),
  {
    loading: () => <PerformanceGlanceStatic />,
  }
);

export function PerformanceGlanceWrapper() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <PerformanceGlanceDynamic /> : <PerformanceGlanceStatic />;
}
