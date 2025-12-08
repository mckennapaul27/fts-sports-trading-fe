import Image from "next/image";

interface StoryPoint {
  title: string;
  description: string;
}

interface OurStoryProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  storyPoints: StoryPoint[];
}

export function OurStory({
  title,
  imageSrc,
  imageAlt,
  storyPoints,
}: OurStoryProps) {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-navy mb-12 text-right">
            {title}
          </h2>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Image */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Story Points */}
            <div className="space-y-6">
              {storyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Yellow circular marker */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-dark-navy mb-2">
                      {point.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

