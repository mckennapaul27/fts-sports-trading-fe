import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/storyblok";
import { StoryblokAsset, MetaDataComponent } from "@/lib/storyblok-types";
import { renderStoryblokRichText } from "@/lib/storyblok-richtext";
import { notFound } from "next/navigation";

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
function getStoryblokImageUrl(asset: StoryblokAsset | undefined): string {
  if (!asset || !asset.filename) return "";

  // If already a full URL, return as is
  if (asset.filename.startsWith("http")) {
    return asset.filename;
  }

  // Construct CDN URL - Storyblok filename typically includes the path
  return asset.filename.startsWith("/")
    ? `https://a.storyblok.com${asset.filename}`
    : `https://a.storyblok.com/f/${asset.filename}`;
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Helper function to get metadata from blog post
function getMetaDataFromPost(post: any): {
  title?: string;
  description?: string;
  ogImage?: StoryblokAsset;
} {
  // Check if there's a meta_data block in the content blocks
  if (post.content.blocks && Array.isArray(post.content.blocks)) {
    const metaDataBlock = post.content.blocks.find(
      (block: any) => block.component === "meta_data"
    ) as MetaDataComponent | undefined;

    if (metaDataBlock) {
      return {
        title: metaDataBlock.title,
        description: metaDataBlock.description,
        ogImage: metaDataBlock.og_image,
      };
    }
  }

  // Fallback to content fields
  return {
    title: post.content.title || post.name,
    description: post.content.description,
    ogImage: post.content.feature_image,
  };
}

// Helper function to get Storyblok image URL for metadata
function getImageUrlForMetadata(asset: StoryblokAsset | undefined): string {
  if (!asset || !asset.filename) return "";
  if (asset.filename.startsWith("http")) {
    return asset.filename;
  }
  return asset.filename.startsWith("/")
    ? `https://a.storyblok.com${asset.filename}`
    : `https://a.storyblok.com/f/${asset.filename}`;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Fortis Sports Trading",
    };
  }

  const meta = getMetaDataFromPost(post);
  const imageUrl = getImageUrlForMetadata(
    meta.ogImage || post.content.feature_image
  );
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fortissportstrading.com";

  return {
    title: meta.title || post.content.title || post.name,
    description:
      meta.description ||
      post.content.description ||
      "Read our latest blog post from Fortis Sports Trading.",
    openGraph: {
      title: meta.title || post.content.title || post.name,
      description:
        meta.description ||
        post.content.description ||
        "Read our latest blog post from Fortis Sports Trading.",
      type: "article",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: meta.title || post.content.title || post.name,
            },
          ]
        : [],
      publishedTime:
        post.published_at ||
        post.first_published_at ||
        post.content.published_at ||
        post.content.first_published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title || post.content.title || post.name,
      description:
        meta.description ||
        post.content.description ||
        "Read our latest blog post from Fortis Sports Trading.",
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = getStoryblokImageUrl(post.content.feature_image);
  const publishedDate =
    post.published_at ||
    post.first_published_at ||
    post.content.published_at ||
    post.content.first_published_at;

  return (
    <>
      {/* Blog Post Header */}
      <section className="bg-dark-navy py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Back to Blog Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white hover:text-gold transition-colors mb-6 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {post.content.title || post.name}
            </h1>

            {/* Metadata */}
            {publishedDate && (
              <div className="text-white/80 text-base sm:text-lg">
                By Fortis Sports Trading • {formatDate(publishedDate)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {imageUrl && (
              <div className="mb-8 sm:mb-12">
                <div className="relative w-full h-64 sm:h-96 lg:h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={post.content.title || post.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Content Section */}
            {post.content.body ? (
              <section>
                {renderStoryblokRichText({
                  content: post.content.body,
                  className:
                    "prose-headings:text-dark-navy prose-p:text-gray-700 prose-strong:text-dark-navy prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-teal",
                })}
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
