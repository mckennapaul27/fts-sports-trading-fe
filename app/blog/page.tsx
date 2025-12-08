import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { getBlogPosts } from "@/lib/storyblok";
import { BlogPost, StoryblokAsset } from "@/lib/storyblok-types";
import { Header } from "@/components/sections/header";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";

export const metadata: Metadata = {
  title: "Blog | Fortis Sports Trading",
  description:
    "Updates, insights, and monthly performance reviews. Follow our journey as we build a profitable trading portfolio in public.",
  openGraph: {
    title: "Blog | Fortis Sports Trading",
    description:
      "Updates, insights, and monthly performance reviews. Follow our journey as we build a profitable trading portfolio in public.",
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

// Get category from blog post (assuming it's in the content)
function getCategory(post: BlogPost): string {
  return (post.content.category as string) || "Performance";
}

// Get excerpt from blog post
function getExcerpt(post: BlogPost): string {
  if (post.content.description) {
    return post.content.description;
  }
  // Fallback: try to extract from body if it's a rich text field
  return "Read more about this post...";
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* Header Section */}
      <Header
        title="BLOG"
        description="Updates, insights, and monthly performance reviews. Follow our journey as we build a profitable trading portfolio in public."
      />

      {/* Blog Posts Grid Section */}
      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Post Count */}
            <div className="mb-8">
              <span className="text-gray-600">
                Showing {posts.length} {posts.length === 1 ? "post" : "posts"}
              </span>
            </div>

            {/* Blog Posts Grid */}
            {posts.length === 0 ? (
              <div className="text-center py-12 text-dark-navy">
                <p>No blog posts available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const imageUrl = getStoryblokImageUrl(
                    post.content.feature_image
                  );
                  const category = getCategory(post);
                  const excerpt = getExcerpt(post);
                  const publishedDate =
                    post.published_at || post.first_published_at;

                  return (
                    <Link
                      key={post.uuid}
                      href={`/blog/${post.slug}`}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group"
                    >
                      {/* Image Container */}
                      <div className="relative w-full h-48 overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={post.content.title || post.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        {/* Category Tag */}
                        {/* <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-2.5 py-1 rounded-md">
                            {category}
                          </span>
                        </div> */}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Title */}
                        <div className="font-bold text-dark-navy text-lg mb-2 line-clamp-2 group-hover:text-teal transition-colors">
                          {post.content.title || post.name}
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
