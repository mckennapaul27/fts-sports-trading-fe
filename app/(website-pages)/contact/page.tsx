import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/sections/header";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Fortis Sports Trading",
  description:
    "Have questions about our systems, membership, or trading approach? We aim to reply within one working day.",
  openGraph: {
    title: "Contact Us | Fortis Sports Trading",
    description:
      "Have questions about our systems, membership, or trading approach? We aim to reply within one working day.",
    type: "website",
  },
};

const supportInfo = [
  {
    icon: Mail,
    title: "Email",
    description: "support@fortissportstrading.com",
  },
  {
    icon: MessageSquare,
    title: "Member Support",
    description: "Priority support via dashboard",
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "Within 1 working day",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <Header
        title="GET IN TOUCH"
        description="Have questions about our systems, membership, or trading approach? We aim to reply within one working day."
      />

      {/* Contact Form Section */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Support Information Section */}
      <section className="bg-cream py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 sm:p-8 shadow-sm text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-dark-navy flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-dark-navy mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-700">{info.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy text-center mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-gray-700 text-center mb-8">
              Before reaching out, you might find your answer in our frequently
              asked questions sections on the Methodology and Membership pages.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/methodology#faq">
                  View Methodology FAQ
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-gray-300 text-dark-navy hover:bg-gray-50"
                asChild
              >
                <Link href="/membership#faq">View Membership FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
