import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ReadyToStartProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  guarantees?: string[];
}

export function ReadyToStart({
  title,
  description,
  buttonText,
  buttonHref,
  guarantees = [],
}: ReadyToStartProps) {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-700 mb-8">{description}</p>

          <Button variant="secondary" size="xl" className="mb-6" asChild>
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>

          {guarantees.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              {guarantees.map((guarantee, index) => (
                <span key={index}>{guarantee}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

