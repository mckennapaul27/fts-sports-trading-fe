"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
      const response = await fetch(`${apiUrl}/api/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Failed to send reset email. Please try again later."
        );
      }

      const responseData = await response.json();
      setIsSuccess(true);
      toast.success(
        responseData.message ||
          "If an account with that email exists, a password reset link has been sent."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send reset email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header
        title="Forgot Password"
        description="Enter your email address and we'll send you a link to reset your password."
      />
      <section className="py-12 sm:py-16 lg:py-20 bg-cream">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              {isSuccess ? (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-green-100 rounded-full p-4">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
                      Check Your Email
                    </h2>
                    <p className="text-dark-navy/70 mb-2">
                      If an account with the email{" "}
                      <span className="font-semibold">
                        {getValues("email")}
                      </span>{" "}
                      exists, we've sent you a password reset link.
                    </p>
                    <p className="text-dark-navy/70 text-sm">
                      Please check your inbox and click the link to reset your
                      password. The link will expire in 1 hour.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => router.push("/sign-in")}
                    >
                      Back to Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setIsSuccess(false);
                      }}
                    >
                      Send Another Email
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-cream rounded-full p-4">
                        <Mail className="w-8 h-8 text-dark-navy" />
                      </div>
                    </div>
                    <p className="text-dark-navy/70">
                      Enter your email address and we'll send you instructions
                      to reset your password.
                    </p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-dark-navy mb-2 block"
                    >
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>

                  {/* Back to Sign In Link */}
                  <div className="text-center">
                    <Link
                      href="/sign-in"
                      className="text-dark-navy/70 hover:text-dark-navy text-sm underline"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
