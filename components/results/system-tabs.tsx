"use client";

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
}

export function SystemTabs({
  systems,
  selectedSystemId,
  onSystemChange,
}: SystemTabsProps) {
  return (
    <div className="bg-cream py-6 border-b border-gray-200">
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
