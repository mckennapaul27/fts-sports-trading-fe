"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface System {
  id: string;
  name: string;
  slug: string;
  productId: string;
}

const systems: System[] = [
  {
    id: "system-1",
    name: "System 1",
    slug: "system-1",
    productId: "prod_TZZbjLqthXdjxx",
  },
  {
    id: "system-2",
    name: "System 2",
    slug: "system-2",
    productId: "prod_TZZcUfjAmtJfkg",
  },
  {
    id: "system-3",
    name: "System 3",
    slug: "system-3",
    productId: "prod_TZZcuPVww3QyDm",
  },
];

interface SystemSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated?: boolean;
}

export function SystemSelectionDialog({
  open,
  onOpenChange,
  isAuthenticated = false,
}: SystemSelectionDialogProps) {
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedSystem) {
      // Route based on authentication status
      if (isAuthenticated) {
        router.push(
          `/dashboard/subscribe?productId=${selectedSystem.productId}&planName=Single System&systemSlugs=${selectedSystem.slug}`
        );
      } else {
        router.push(
          `/register-and-subscribe?productId=${selectedSystem.productId}&planName=Single System&systemSlugs=${selectedSystem.slug}`
        );
      }
      onOpenChange(false);
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
            Choose which system you&apos;d like to subscribe to. You can switch
            to a different system at the start of any billing cycle.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {systems.map((system) => (
            <button
              key={system.id}
              onClick={() => setSelectedSystem(system)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
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
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
