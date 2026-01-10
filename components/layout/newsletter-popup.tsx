"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const STORAGE_KEY = "newsletter-popup-dismissed";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the popup
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === "true") {
      return;
    }

    // Show popup after 8 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Store dismissal in localStorage
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

    try {
      const response = await fetch(`${apiUrl}/api/users/newsletter-subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Successfully subscribed to newsletter");
        setEmail("");
        handleClose(); // Close popup on success
      } else {
        // Handle error responses
        const errorMessage =
          data.message ||
          "Failed to subscribe to newsletter. Please try again later.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe to newsletter. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dark-navy">
            Stay Updated
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 pt-2">
            Get monthly summaries and system updates delivered to your inbox.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 sm:flex-initial"
              disabled={isSubmitting}
            >
              Maybe Later
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

