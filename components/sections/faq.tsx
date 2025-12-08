import { Accordion } from "@/components/ui/accordion";

interface FAQProps {
  title: string;
  items: Array<{ question: string; answer: string }>;
}

export function FAQ({ title, items }: FAQProps) {
  return (
    <section id="faq" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy text-center mb-12">
            {title}
          </h2>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}

