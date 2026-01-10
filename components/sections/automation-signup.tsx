"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export function AutomationSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

    try {
      const response = await fetch(
        `${apiUrl}/api/users/automation-bot-subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message ||
            "Successfully subscribed! We'll notify you when automation is ready."
        );
        setEmail("");
      } else {
        // Handle error responses
        const errorMessage =
          data.message || "Failed to subscribe. Please try again later.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Automation signup error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to be notified when our automation bot is ready to go
            live. Get updates on development progress and launch announcements.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="secondary"
              size="default"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Notify Me"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
