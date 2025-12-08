import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getEducationArticleBySlug } from "@/lib/storyblok";
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

interface EducationArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Helper function to get metadata from education article
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
}: EducationArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getEducationArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Fortis Sports Trading",
    };
  }

  const meta = getMetaDataFromPost(article);
  const imageUrl = getImageUrlForMetadata(
    meta.ogImage || article.content.feature_image
  );
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fortissportstrading.com";

  return {
    title: meta.title || article.content.title || article.name,
    description:
      meta.description ||
      article.content.description ||
      "Read our latest education article from Fortis Sports Trading.",
    openGraph: {
      title: meta.title || article.content.title || article.name,
      description:
        meta.description ||
        article.content.description ||
        "Read our latest education article from Fortis Sports Trading.",
      type: "article",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: meta.title || article.content.title || article.name,
            },
          ]
        : [],
      publishedTime:
        article.published_at ||
        article.first_published_at ||
        article.content.published_at ||
        article.content.first_published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title || article.content.title || article.name,
      description:
        meta.description ||
        article.content.description ||
        "Read our latest education article from Fortis Sports Trading.",
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function EducationArticlePage({
  params,
}: EducationArticlePageProps) {
  const { slug } = await params;
  const article = await getEducationArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const imageUrl = getStoryblokImageUrl(article.content.feature_image);
  const publishedDate =
    article.published_at ||
    article.first_published_at ||
    article.content.published_at ||
    article.content.first_published_at;

  return (
    <>
      {/* Education Article Header */}
      <section className="bg-dark-navy py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Back to Education Link */}
            <Link
              href="/education"
              className="inline-flex items-center gap-2 text-white hover:text-gold transition-colors mb-6 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Education
            </Link>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {article.content.title || article.name}
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
                    alt={article.content.title || article.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Content Section */}
            {article.content.body ? (
              <section>
                {renderStoryblokRichText({
                  content: article.content.body,
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
