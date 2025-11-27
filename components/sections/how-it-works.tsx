function ShieldIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <path
        d="M24 4L8 10V22C8 30.5 12.5 38.5 24 44C35.5 38.5 40 30.5 40 22V10L24 4Z"
        stroke="var(--color-teal)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M24 4L16 7.5V19C16 25.5 19 31 24 36C29 31 32 25.5 32 19V7.5L24 4Z"
        stroke="var(--color-teal)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <circle cx="24" cy="24" r="3" fill="var(--color-teal)" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <rect x="12" y="28" width="6" height="12" fill="var(--color-teal)" />
      <rect x="21" y="20" width="6" height="20" fill="var(--color-teal)" />
      <rect x="30" y="12" width="6" height="28" fill="var(--color-teal)" />
    </svg>
  );
}

function LineGraphIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <path
        d="M8 36L16 28L24 32L32 20L40 24"
        stroke="var(--color-teal)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 36L16 28L24 32L32 20L40 24"
        stroke="var(--color-teal)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
      <circle cx="40" cy="24" r="4" fill="var(--color-teal)" />
    </svg>
  );
}

const steps = [
  {
    icon: <ShieldIcon />,
    title: "Join a plan",
    description:
      "Choose single systems or access the entire portfolio. Flexible monthly or annual billing.",
  },
  {
    icon: <BarChartIcon />,
    title: "Access daily selections",
    description:
      "Receive selections each day via your member dashboard. Clear, actionable, and on time.",
  },
  {
    icon: <LineGraphIcon />,
    title: "Track performance",
    description:
      "Monitor results in real-time. All historical data available for download and analysis.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl lg:text-4xl  font-bold text-dark-navy">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-dark-navy max-w-2xl mx-auto">
              Simple, structured, and transparent. Join, access selections, and
              track performance.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 sm:p-8 text-center space-y-4"
              >
                <div className="flex justify-center">{step.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-dark-navy">
                  {step.title}
                </h3>
                <p className="text-base text-dark-navy leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
