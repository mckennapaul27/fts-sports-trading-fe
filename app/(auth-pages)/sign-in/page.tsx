"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextAuthProvider } from "@/app/providors";
import { ClimbingBoxLoader } from "react-spinners";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [countdown, setCountdown] = useState(5);

  // Redirect based on role when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  // Redirect if user is already logged in
  //   useEffect(() => {
  //     if (status === "authenticated" && session) {
  //       router.push("/dashboard");
  //     }
  //   }, [status, session, router]);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      if (status === "authenticated" && session) {
        if (session.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/sign-in");
      }
    }
  }, [countdown, router, status, session]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (signInResult?.error) {
        // The error could be from the backend (invalid credentials, blocked account, etc.)
        // The auth-helpers.ts will throw errors that get caught here
        throw new Error(
          signInResult.error === "CredentialsSignin"
            ? "Invalid email or password"
            : signInResult.error
        );
      }

      if (signInResult?.ok) {
        toast.success("Welcome back! Redirecting...");
        // Session will update automatically, useEffect will handle redirect
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <>
        <Header
          title="Sign In"
          description="Welcome back to Fortis Sports Trading."
        />
        <section className="bg-cream py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-6 sm:px-8 xl:px-12">
            <div className="max-w-2xl mx-auto">
              <ClimbingBoxLoader
                color="#37744e"
                size={20}
                className="mx-auto"
              />
            </div>
          </div>
        </section>
      </>
    );
  }

  //   // Don't render form if already authenticated (will redirect)
  if (status === "authenticated") {
    return (
      <>
        <Header
          title="Sign In"
          description="Welcome back to Fortis Sports Trading."
        />
        <section className="bg-cream py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-6 sm:px-8 xl:px-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-8 sm:p-10 shadow-sm text-center">
                {/* Success Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-4">
                  Logged In
                </h2>
                <p className="text-dark-navy/70 mb-6 text-lg">
                  You are already logged in as {session?.user?.email}
                </p>

                {/* Session ID (for debugging, can be removed in production) */}
                {/* {sessionId && (
                <p className="text-sm text-gray-500 mb-8">
                  Session ID: {sessionId}
                </p>
              )} */}

                {/* Redirect Info */}
                <div className="bg-cream rounded-lg p-4 mb-8">
                  <p className="text-dark-navy/70 text-sm">
                    Redirecting to your dashboard in {countdown} second
                    {countdown !== 1 ? "s" : ""}...
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (session?.user?.role === "admin") {
                      router.push("/admin");
                    } else {
                      router.push("/dashboard");
                    }
                  }}
                >
                  Go to{" "}
                  {session?.user?.role === "admin" ? "Admin" : "Dashboard"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Header
        title="Sign In"
        description="Welcome back to Fortis Sports Trading."
      />
      <section className="py-12 sm:py-16 lg:py-20 bg-cream">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="Enter your password"
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
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
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SignInPage() {
  return (
    <NextAuthProvider>
      <SignInForm />
    </NextAuthProvider>
  );
}
