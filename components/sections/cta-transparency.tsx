import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface CTATransparencyProps {
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
  buttonText: string;
  buttonHref: string;
  icon: LucideIcon;
  iconClassName?: string;
  bgColor?: string;
}

export function CTATransparency({
  title,
  description,
  cardTitle,
  cardDescription,
  buttonText,
  buttonHref,
  icon: Icon,
  iconClassName = "text-teal",
  bgColor = "bg-white",
}: CTATransparencyProps) {
  return (
    <section className={`${bgColor} py-16 sm:py-20 lg:py-24 `}>
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            {/* Left Side - Text Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
                {title}
              </h2>
              <p className="text-lg text-dark-navy">{description}</p>
            </div>

            {/* Right Side - Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <Icon
                    className={`w-8 h-8 ${iconClassName}`}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-dark-navy mb-2">
                    {cardTitle}
                  </h3>
                  <p className="text-sm text-gray-600">{cardDescription}</p>
                </div>
              </div>

              <Button variant="default" size="lg" className="w-full" asChild>
                <Link
                  href={buttonHref}
                  className="flex items-center justify-center gap-2"
                >
                  {buttonText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
