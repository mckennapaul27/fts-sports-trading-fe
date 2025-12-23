import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 min-h-[calc(100vh-200px)] flex items-center"
      style={{ background: "var(--color-gradient)" }}
    >
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold leading-none text-white/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gold" />
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                  Page Not Found
                </span>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4 pt-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Looks like this page went{" "}
              <span className="text-gold">off track</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back on the right path.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full max-w-[400px] sm:max-w-none sm:w-auto mx-auto sm:mx-0">
            <Button
              variant="secondary"
              size="xl"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </Button>
            <Button
              variant="white"
              size="xl"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/results" className="flex items-center gap-2">
                View Results
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-white/20 w-full max-w-2xl">
            <p className="text-white/80 mb-4 text-sm sm:text-base">
              Popular pages:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/systems"
                className="text-white hover:text-gold transition-colors text-sm sm:text-base"
              >
                Systems
              </Link>
              <span className="text-white/40">•</span>
              <Link
                href="/methodology"
                className="text-white hover:text-gold transition-colors text-sm sm:text-base"
              >
                Methodology
              </Link>
              <span className="text-white/40">•</span>
              <Link
                href="/membership"
                className="text-white hover:text-gold transition-colors text-sm sm:text-base"
              >
                Membership
              </Link>
              <span className="text-white/40">•</span>
              <Link
                href="/about"
                className="text-white hover:text-gold transition-colors text-sm sm:text-base"
              >
                About
              </Link>
              <span className="text-white/40">•</span>
              <Link
                href="/contact"
                className="text-white hover:text-gold transition-colors text-sm sm:text-base"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
