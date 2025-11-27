"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing:", email);
    // TODO: Implement actual subscription logic
  };

  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
            Monthly performance update
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto ">
            Get monthly summaries and system updates delivered to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto "
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1"
            />
            <Button
              type="submit"
              variant="secondary"
              size="default"
              className="w-full sm:w-auto"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
