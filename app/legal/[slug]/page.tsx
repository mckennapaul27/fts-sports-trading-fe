import type { Metadata } from "next";
import { getLegalPageBySlug, getLegalPages } from "@/lib/storyblok";
import { StoryblokAsset, MetaDataComponent } from "@/lib/storyblok-types";
import { renderStoryblokRichText } from "@/lib/storyblok-richtext";
import { notFound } from "next/navigation";

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all legal pages
export async function generateStaticParams() {
  const pages = await getLegalPages();

  return pages.map((page) => {
    // Extract slug, removing "legal/" prefix if present
    const slug = page.slug.startsWith("legal/")
      ? page.slug.replace("legal/", "")
      : page.slug;

    return {
      slug,
    };
  });
}

// Helper function to get metadata from legal page
function getMetaDataFromPage(page: any): {
  title?: string;
  description?: string;
  ogImage?: StoryblokAsset;
} {
  // Check if there's a meta_data block in the content blocks
  if (page.content.blocks && Array.isArray(page.content.blocks)) {
    const metaDataBlock = page.content.blocks.find(
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
    title: page.content.title || page.name,
    description: undefined,
    ogImage: undefined,
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
}: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | Fortis Sports Trading",
    };
  }

  const meta = getMetaDataFromPage(page);
  const imageUrl = getImageUrlForMetadata(meta.ogImage);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fortissportstrading.com";

  return {
    title: meta.title || page.content.title || page.name,
    description:
      meta.description ||
      `Read our ${page.content.title || page.name} at Fortis Sports Trading.`,
    openGraph: {
      title: meta.title || page.content.title || page.name,
      description:
        meta.description ||
        `Read our ${page.content.title || page.name} at Fortis Sports Trading.`,
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: meta.title || page.content.title || page.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title || page.content.title || page.name,
      description:
        meta.description ||
        `Read our ${page.content.title || page.name} at Fortis Sports Trading.`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = await getLegalPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      {/* Legal Page Header */}
      <section className="bg-dark-navy py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {page.content.title || page.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 sm:px-8 xl:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Content Section */}
            {page.content.body ? (
              <section>
                {renderStoryblokRichText({
                  content: page.content.body,
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
