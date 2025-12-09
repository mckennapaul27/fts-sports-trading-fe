import Link from "next/link";
import { Button } from "@/components/ui/button";

function CheckmarkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <circle cx="10" cy="10" r="10" fill="var(--color-gold)" />
      <path
        d="M6 10L9 13L14 7"
        stroke="var(--color-dark-navy)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12L10 8L6 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 min-h-[calc(100vh-100px)] flex items-center"
      style={{ background: "var(--color-gradient)" }}
    >
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span className="text-white">Disciplined</span>{" "}
            <span className="text-gold">sports trading,</span>{" "}
            <span className="text-white">proven in public.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white max-w-2xl">
            A structured portfolio of lay systems with transparent results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full max-w-[400px] sm:max-w-none sm:w-auto mx-auto sm:mx-0">
            <Button
              variant="secondary"
              size="xl"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/register">Join Now</Link>
            </Button>
            <Button variant="white" size="xl" asChild>
              <Link
                href="/results"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                View Results
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 pt-8">
            <div className="flex items-center gap-2">
              <CheckmarkIcon />
              <span className="text-white">Public results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckmarkIcon />
              <span className="text-white">Risk-managed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckmarkIcon />
              <span className="text-white">Since 2021</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
