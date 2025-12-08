import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTAAltProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  linkText?: string;
  linkHref?: string;
}

export function CTAAlt({
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  linkText,
  linkHref,
}: CTAAltProps) {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-700 mb-8">{description}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button variant="secondary" size="lg" asChild>
              <Link href={primaryButtonHref}>
                {primaryButtonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white border-gray-300 text-dark-navy hover:bg-gray-50"
              asChild
            >
              <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
            </Button>
          </div>

          {/* Optional Link */}
          {linkText && linkHref && (
            <p className="text-sm text-gray-600">
              Already convinced?{" "}
              <Link
                href={linkHref}
                className="text-teal hover:underline font-medium"
              >
                {linkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

