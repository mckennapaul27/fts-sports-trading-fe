interface HeroAltProps {
  subtitle: string;
  title: string;
  highlightedText: string;
  missionStatement: string;
  description: string;
}

export function HeroAlt({
  subtitle,
  title,
  highlightedText,
  missionStatement,
  description,
}: HeroAltProps) {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Subtitle */}
          <div className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            {subtitle}
          </div>

          {/* Title with highlighted text */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-navy mb-6 leading-tight">
            {title} <span className="text-gold block">{highlightedText}</span>
          </h1>

          {/* Mission Statement */}
          <p className="text-2xl sm:text-3xl font-semibold text-dark-navy mb-6">
            {missionStatement}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
        </div>
      </div>
    </section>
  );
}
