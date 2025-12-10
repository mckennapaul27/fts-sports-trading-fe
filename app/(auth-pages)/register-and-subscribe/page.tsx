"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanDisplay } from "@/components/sections/plan-display";

const registerFormSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

// Map product IDs to system names
const productIdToSystemName: Record<string, string> = {
  prod_TZZbjLqthXdjxx: "System 1",
  prod_TZZcUfjAmtJfkg: "System 2",
  prod_TZZcuPVww3QyDm: "System 3",
};

function RegisterAndSubscribeContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const planName = searchParams.get("planName") || "Single System";
  const systemSlugsParam = searchParams.get("systemSlugs");

  // Parse system slugs from query param (comma-separated or single value)
  const systemSlugs = systemSlugsParam
    ? systemSlugsParam.split(",").map((slug) => slug.trim())
    : [];

  // Redirect if no productId or systemSlugs are provided
  useEffect(() => {
    if (!productId || systemSlugs.length === 0) {
      toast.error("No plan selected. Redirecting to membership page...");
      router.push("/membership");
    }
  }, [productId, systemSlugs.length, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!productId || systemSlugs.length === 0) {
      toast.error("No plan selected. Please go back and select a plan.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
      const res = await fetch(`${apiUrl}/api/users/register-and-subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          password: data.password,
          productId,
          systemSlugs, // Array of system slugs: ["system-1"] or ["system-1", "system-2", "system-3"]
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Something went wrong with registration."
        );
      }

      toast.success("Registration successful! Signing you in...");

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email.trim(),
        password: data.password,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      if (!signInResult?.ok) {
        throw new Error("Sign in failed. Please try logging in manually.");
      }

      toast.success("Sign in successful! Redirecting to payment...");

      if (responseData.url) {
        router.push(responseData.url);
      } else {
        throw new Error("Could not retrieve payment URL.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get system name if it's a single system product
  const systemName =
    productId && productIdToSystemName[productId]
      ? productIdToSystemName[productId]
      : undefined;

  if (!productId || systemSlugs.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Header
        title="Create Your Account"
        description="Complete your registration and start your subscription."
      />
      <section className="py-12 sm:py-16 lg:py-20 bg-cream">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Plan Display */}
              <div className="order-2 lg:order-1">
                <h2 className="text-xl font-bold text-dark-navy mb-4">
                  Your Selected Plan
                </h2>
                <PlanDisplay planName={planName} systemName={systemName} />
              </div>

              {/* Registration Form */}
              <div className="order-1 lg:order-2">
                <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-dark-navy mb-6">
                    Create Your Account
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* First Name Field */}
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-dark-navy mb-2 block"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name Field */}
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="text-dark-navy mb-2 block"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
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

                    {/* Password Field */}
                    <div>
                      <Label
                        htmlFor="password"
                        className="text-dark-navy mb-2 block"
                      >
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        {...register("password")}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="text-dark-navy mb-2 block"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...register("confirmPassword")}
                        className={
                          errors.confirmPassword ? "border-red-500" : ""
                        }
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
                      {isSubmitting ? (
                        <span>Creating Account...</span>
                      ) : (
                        <>
                          <span className="hidden sm:inline">
                            Create Account & Continue to Payment
                          </span>
                          <span className="inline sm:hidden">Continue</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function RegisterAndSubscribePage() {
  return (
    <Suspense
      fallback={
        <>
          <Header
            title="Create Your Account"
            description="Complete your registration and start your subscription."
          />
          <section className="py-12 sm:py-16 lg:py-20 bg-cream">
            <div className="container mx-auto px-6 sm:px-8 xl:px-12">
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                  <p className="text-dark-navy">Loading...</p>
                </div>
              </div>
            </div>
          </section>
        </>
      }
    >
      <RegisterAndSubscribeContent />
    </Suspense>
  );
}
