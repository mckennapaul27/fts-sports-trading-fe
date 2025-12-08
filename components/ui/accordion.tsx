"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({
  question,
  answer,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-teal transition-colors cursor-pointer"
      >
        <span className="text-lg font-semibold text-dark-navy pr-8">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-700 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

interface AccordionProps {
  items: Array<{ question: string; answer: string }>;
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </div>
  );
}
