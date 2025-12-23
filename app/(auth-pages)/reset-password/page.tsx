"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract token from URL query parameter
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setTokenError("Missing reset token. Please check your email link.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Missing reset token. Please check your email link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
      const response = await fetch(`${apiUrl}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || "Failed to reset password. Please try again.";

        // Handle specific error cases
        if (response.status === 400) {
          if (
            errorMessage.includes("expired") ||
            errorMessage.includes("invalid")
          ) {
            setTokenError(errorMessage);
            toast.error(errorMessage);
            return;
          }
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setIsSuccess(true);
      toast.success(
        responseData.message || "Password has been reset successfully"
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if token is missing or invalid
  if (tokenError || !token) {
    return (
      <>
        <Header
          title="Reset Password"
          description="Reset your password to regain access to your account."
        />
        <section className="py-12 sm:py-16 lg:py-20 bg-cream">
          <div className="container mx-auto px-6 sm:px-8 xl:px-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-red-100 rounded-full p-4">
                      <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
                      Invalid or Expired Link
                    </h2>
                    <p className="text-dark-navy/70 mb-4">
                      {tokenError ||
                        "The password reset link is missing, invalid, or has expired."}
                    </p>
                    <p className="text-dark-navy/70 text-sm">
                      Password reset links expire after 1 hour. Please request a
                      new one.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => router.push("/forgot-password")}
                    >
                      Request New Reset Link
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/sign-in")}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <>
        <Header
          title="Password Reset"
          description="Your password has been successfully reset."
        />
        <section className="py-12 sm:py-16 lg:py-20 bg-cream">
          <div className="container mx-auto px-6 sm:px-8 xl:px-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-green-100 rounded-full p-4">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
                      Password Reset Successful
                    </h2>
                    <p className="text-dark-navy/70 mb-2">
                      Your password has been reset successfully.
                    </p>
                    <p className="text-dark-navy/70 text-sm">
                      Redirecting you to the sign-in page...
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push("/sign-in")}
                    className="w-full sm:w-auto"
                  >
                    Go to Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Show reset password form
  return (
    <>
      <Header
        title="Reset Password"
        description="Enter your new password below."
      />
      <section className="py-12 sm:py-16 lg:py-20 bg-cream">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-cream rounded-full p-4">
                      <Lock className="w-8 h-8 text-dark-navy" />
                    </div>
                  </div>
                  <p className="text-dark-navy/70">
                    Please enter your new password. It must be at least 8
                    characters long.
                  </p>
                </div>

                {/* Password Field */}
                <div>
                  <Label
                    htmlFor="password"
                    className="text-dark-navy mb-2 block"
                  >
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-dark-navy/50 text-xs mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-dark-navy mb-2 block"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
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
                  {isSubmitting ? "Resetting Password..." : "Reset Password"}
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header title="Reset Password" description="Loading..." />
          <section className="py-12 sm:py-16 lg:py-20 bg-cream">
            <div className="container mx-auto px-6 sm:px-8 xl:px-12">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
                  <div className="text-center">
                    <p className="text-dark-navy/70">Loading...</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
