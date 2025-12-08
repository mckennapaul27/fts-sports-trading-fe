"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setSubmitStatus("success");
      reset();
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label htmlFor="name" className="text-dark-navy mb-2 block">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email" className="text-dark-navy mb-2 block">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <Label htmlFor="subject" className="text-dark-navy mb-2 block">
            Subject
          </Label>
          <Input
            id="subject"
            type="text"
            placeholder="What's this about?"
            {...register("subject")}
            className={errors.subject ? "border-red-500" : ""}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <Label htmlFor="message" className="text-dark-navy mb-2 block">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us more about your question..."
            rows={6}
            {...register("message")}
            className={errors.message ? "border-red-500" : ""}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            <p className="font-medium">Message sent successfully!</p>
            <p className="text-sm mt-1">
              We'll get back to you within one working day.
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <p className="font-medium">Failed to send message</p>
            {errorMessage && (
              <p className="text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}

