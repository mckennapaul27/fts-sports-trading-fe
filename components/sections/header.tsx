interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <section className="bg-dark-navy py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-6 sm:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

