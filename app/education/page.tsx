import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { getEducationArticles } from "@/lib/storyblok";
import { BlogPost, StoryblokAsset } from "@/lib/storyblok-types";
import { Header } from "@/components/sections/header";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";

export const metadata: Metadata = {
  title: "Education | Fortis Sports Trading",
  description:
    "Learn the fundamentals of sports trading. Educational articles covering lay betting, system strategies, risk management, and more.",
  openGraph: {
    title: "Education | Fortis Sports Trading",
    description:
      "Learn the fundamentals of sports trading. Educational articles covering lay betting, system strategies, risk management, and more.",
    type: "website",
  },
};

// Format date for display
function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get Storyblok image URL
// Storyblok assets typically have filename as full CDN URL or path
function getStoryblokImageUrl(asset: StoryblokAsset | undefined): string {
  if (!asset || !asset.filename) return "";

  // If already a full URL, return as is
  if (asset.filename.startsWith("http")) {
    return asset.filename;
  }

  // Construct CDN URL - Storyblok filename typically includes the path
  // Format: https://a.storyblok.com/f/{space_id}/{path}/{filename}
  return asset.filename.startsWith("/")
    ? `https://a.storyblok.com${asset.filename}`
    : `https://a.storyblok.com/f/${asset.filename}`;
}

// Get excerpt from education article
function getExcerpt(post: BlogPost): string {
  if (post.content.description) {
    return post.content.description;
  }
  // Fallback: try to extract from body if it's a rich text field
  return "Read more about this article...";
}

export default async function EducationPage() {
  const articles = await getEducationArticles();

  return (
    <>
      {/* Header Section */}
      <Header
        title="EDUCATION"
        description="Learn the fundamentals of sports trading. Educational articles covering lay betting, system strategies, risk management, and more."
      />

      {/* Education Articles Grid Section */}
      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Article Count */}
            <div className="mb-8">
              <span className="text-gray-600">
                Showing {articles.length}{" "}
                {articles.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {/* Education Articles Grid */}
            {articles.length === 0 ? (
              <div className="text-center py-12 text-dark-navy">
                <p>No education articles available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => {
                  const imageUrl = getStoryblokImageUrl(
                    article.content.feature_image
                  );
                  const excerpt = getExcerpt(article);
                  const publishedDate =
                    article.published_at || article.first_published_at;

                  return (
                    <Link
                      key={article.uuid}
                      href={`/education/${article.slug}`}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group"
                    >
                      {/* Image Container */}
                      <div className="relative w-full h-48 overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={article.content.title || article.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Title */}
                        <div className="font-bold text-dark-navy text-lg mb-2 line-clamp-2 group-hover:text-teal transition-colors">
                          {article.content.title || article.name}
                        </div>

                        {/* Date */}
                        {publishedDate && (
                          <div className="flex items-center gap-1.5 text-gray-500 text-base mb-4 mt-0.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(publishedDate)}</span>
                          </div>
                        )}

                        {/* Excerpt */}
                        <div className="text-gray-600 text-base mb-4 line-clamp-3 flex-grow">
                          {excerpt}
                        </div>

                        {/* Read More Button */}
                        <div className="mt-auto">
                          <span className="inline-flex items-center text-dark-navy text-sm font-medium border border-gray-300 rounded-md px-4 py-2 group-hover:border-teal group-hover:text-teal transition-colors">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <NewsletterSignup />
    </>
  );
}
