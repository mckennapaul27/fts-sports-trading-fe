"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getProductIdToSystemName } from "@/config/stripe-products";

interface System {
  id: string;
  name: string;
  slug: string;
  productId: string;
}

// Generate systems array based on environment
const getSystems = (): System[] => {
  const productIdToSystemName = getProductIdToSystemName();
  const systems: System[] = [];

  Object.entries(productIdToSystemName).forEach(
    ([productId, systemName], index) => {
      const systemNumber = index + 1;
      systems.push({
        id: `system-${systemNumber}`,
        name: systemName,
        slug: `system-${systemNumber}`,
        productId: productId,
      });
    }
  );

  return systems;
};

const systems = getSystems();

interface SystemSelectionDialogForChangeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSystemSelected: (system: System) => void;
}

export function SystemSelectionDialogForChange({
  open,
  onOpenChange,
  onSystemSelected,
}: SystemSelectionDialogForChangeProps) {
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);

  const handleContinue = () => {
    if (selectedSystem) {
      onSystemSelected(selectedSystem);
      setSelectedSystem(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-dark-navy">
            Select Your System
          </DialogTitle>
          <DialogDescription className="text-dark-navy/70">
            Choose which system you&apos;d like to switch to. This change will
            take effect immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {systems.map((system) => (
            <button
              key={system.id}
              onClick={() => setSelectedSystem(system)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedSystem?.id === system.id
                  ? "border-gold bg-gold/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-dark-navy">
                  {system.name}
                </span>
                {selectedSystem?.id === system.id && (
                  <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-dark-navy"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedSystem(null);
            }}
            className="text-dark-navy"
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleContinue}
            disabled={!selectedSystem}
            className="bg-gold text-dark-navy hover:bg-gold/90"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
