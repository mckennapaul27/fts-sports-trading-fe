import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";

export function CTATransparency() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 ">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            {/* Left Side - Text Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-4">
                Transparent, Unfiltered Results
              </h2>
              <p className="text-lg text-dark-navy">
                We publish complete results and monthly summaries.
              </p>
            </div>

            {/* Right Side - Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <FileSpreadsheet
                    className="w-8 h-8 text-teal"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-dark-navy mb-2">
                    Results Sheets CSV
                  </h3>
                  <p className="text-sm text-gray-600">
                    Download complete CSV's with all historical data
                  </p>
                </div>
              </div>

              <Button variant="default" size="lg" className="w-full" asChild>
                <Link
                  href="/results"
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Go To Results
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
