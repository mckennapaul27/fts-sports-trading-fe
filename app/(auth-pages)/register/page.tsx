"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to create account. Please try again."
        );
      }

      // Registration successful, now sign in
      toast.success("Account created successfully! Signing you in...");

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email.trim(),
        password: data.password,
      });

      if (signInResult?.error) {
        throw new Error(
          "Account created but sign-in failed. Please try logging in."
        );
      }

      if (signInResult?.ok) {
        toast.success("Welcome! Redirecting to dashboard...");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header
        title="Create Your Account"
        description="Join Fortis Sports Trading and start your journey to profitable sports trading."
      />
      <section className="py-12 sm:py-16 lg:py-20 bg-cream">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
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
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
