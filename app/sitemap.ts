import { MetadataRoute } from "next";
import {
  getBlogPosts,
  getEducationArticles,
  getLegalPages,
} from "@/lib/storyblok";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.fortissportstrading.com";

  // Fetch all dynamic content from Storyblok
  const [blogPosts, educationArticles, legalPages] = await Promise.all([
    getBlogPosts(),
    getEducationArticles(),
    getLegalPages(),
  ]);

  // Static pages from (website-pages)
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/membership",
    "/methodology",
    "/results",
    "/systems",
    "/systems/system-1",
    "/systems/system-2",
    "/systems/system-3",
    "/systems/system-4",
    "/systems/system-5",
    "/systems/system-6",
    "/systems/system-7",
    "/systems/system-8",
  ];

  // Build sitemap entries for static pages
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  // Build sitemap entries for blog posts
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => {
    // Extract slug, removing "blog/" prefix if present
    const slug = post.slug.startsWith("blog/")
      ? post.slug.replace("blog/", "")
      : post.slug;

    const publishedDate =
      post.published_at ||
      post.first_published_at ||
      post.content.published_at ||
      post.content.first_published_at;

    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: publishedDate ? new Date(publishedDate) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // Build sitemap entries for education articles
  const educationEntries: MetadataRoute.Sitemap = educationArticles.map(
    (article) => {
      // Extract slug, removing "education/" prefix if present
      const slug = article.slug.startsWith("education/")
        ? article.slug.replace("education/", "")
        : article.slug;

      const publishedDate =
        article.published_at ||
        article.first_published_at ||
        article.content.published_at ||
        article.content.first_published_at;

      return {
        url: `${baseUrl}/education/${slug}`,
        lastModified: publishedDate ? new Date(publishedDate) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }
  );

  // Build sitemap entries for legal pages
  const legalEntries: MetadataRoute.Sitemap = legalPages.map((page) => {
    // Extract slug, removing "legal/" prefix if present
    const slug = page.slug.startsWith("legal/")
      ? page.slug.replace("legal/", "")
      : page.slug;

    const publishedDate =
      page.published_at ||
      page.first_published_at ||
      page.content.published_at ||
      page.content.first_published_at;

    return {
      url: `${baseUrl}/legal/${slug}`,
      lastModified: publishedDate ? new Date(publishedDate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
  });

  // Combine all entries
  return [
    ...staticEntries,
    ...blogEntries,
    ...educationEntries,
    ...legalEntries,
  ];
}
