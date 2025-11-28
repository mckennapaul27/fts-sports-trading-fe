"use client";

import { useEffect, useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface System {
  _id: string;
  name: string;
  slug: string;
}

interface SystemTabsProps {
  systems: System[];
  selectedSystemId: string;
  onSystemChange: (systemId: string) => void;
  systemResultsRef?: React.RefObject<HTMLDivElement | null>;
}

export function SystemTabs({
  systems,
  selectedSystemId,
  onSystemChange,
  systemResultsRef,
}: SystemTabsProps) {
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!systemResultsRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the System Results section is intersecting (visible in viewport)
        // and we're not at the very top, make tabs sticky
        setIsSticky(entry.isIntersecting && entry.intersectionRatio < 1);
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "-100px 0px 0px 0px", // Start sticking when section is 100px from top
      }
    );

    observer.observe(systemResultsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [systemResultsRef]);

  return (
    <div
      ref={tabsRef}
      className={`${
        isSticky ? "sticky top-0 z-50 shadow-sm" : ""
      } bg-cream border-b border-gray-200 transition-all duration-300 ease-in-out ${
        isSticky ? "py-3" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <Tabs
          value={selectedSystemId}
          onValueChange={onSystemChange}
          className="mx-auto max-w-7xl"
        >
          <TabsList className="">
            {systems.map((system) => (
              <TabsTrigger
                key={system._id}
                value={system._id}
                className="data-[state=active]:bg-white data-[state=active]:text-dark-navy text-gray-600 cursor-pointer"
              >
                {system.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
