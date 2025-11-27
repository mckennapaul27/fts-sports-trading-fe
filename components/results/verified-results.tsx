function CheckmarkIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-green"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M8 12L11 15L16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedResults() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <CheckmarkIcon />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-dark-navy mb-2">
                Verified Results
              </h3>
              <p className="text-base text-dark-navy mb-4">
                All results are live tracked using BSP (Betfair Starting Price)
                for complete transparency. Every bet is recorded in real-time
                with publicly verifiable data.
              </p>
              <p className="text-sm text-gray-600 italic">
                Disclaimer: Past performance does not guarantee future results.
                Trading carries risk. Never bet more than you can afford to
                lose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
