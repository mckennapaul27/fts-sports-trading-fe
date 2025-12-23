import StoryblokClient from "storyblok-js-client";
import { draftMode } from "next/headers";
import { storyblokToken } from "../storyblok.config";
import { BlogPost } from "./storyblok-types";

// Initialize Storyblok client
export const storyblokClient = new StoryblokClient({
  accessToken: storyblokToken,
  cache: {
    clear: "auto",
    type: process.env.NODE_ENV === "development" ? "none" : "memory",
  },
});

// Helper function to get the Storyblok version (draft or published)
// Checks draft mode first, then falls back to NODE_ENV for development
export async function getStoryblokVersion(): Promise<"draft" | "published"> {
  try {
    const draft = await draftMode();
    if ((draft as { isEnabled: boolean }).isEnabled) {
      return "draft";
    }
  } catch {
    // draftMode() can only be called in server components/route handlers
    // If it fails, fall back to NODE_ENV check
  }

  // Fallback: use draft in development, published in production
  return process.env.NODE_ENV === "development" ? "draft" : "published";
}

// Initialize Storyblok bridge for preview mode
export function initStoryblok() {
  if (typeof window !== "undefined" && (window as any).storyblok) {
    const storyblokInstance = (window as any).storyblok;

    storyblokInstance.on(["input", "published", "change"], (payload: any) => {
      if (payload.action === "input") {
        if (payload.story.id === payload.storyId) {
          storyblokInstance.enterEditmode();
        }
      } else if (payload.action === "change") {
        window.location.reload();
      }
    });
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await storyblokClient.get("cdn/stories", {
      starts_with: "blog/",
      version: await getStoryblokVersion(),
      sort_by: "first_published_at:desc",
    });

    return (data.stories || []) as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const { data } = await storyblokClient.get(`cdn/stories/blog/${slug}`, {
      version: await getStoryblokVersion(),
    });

    return (data.story || null) as BlogPost | null;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

// Fetch all education articles
export async function getEducationArticles(): Promise<BlogPost[]> {
  try {
    const { data } = await storyblokClient.get("cdn/stories", {
      starts_with: "education/",
      version: await getStoryblokVersion(),
      sort_by: "first_published_at:desc",
    });

    return (data.stories || []) as BlogPost[];
  } catch (error) {
    console.error("Error fetching education articles:", error);
    return [];
  }
}

// Fetch a single education article by slug
export async function getEducationArticleBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const { data } = await storyblokClient.get(
      `cdn/stories/education/${slug}`,
      {
        version: await getStoryblokVersion(),
      }
    );

    return (data.story || null) as BlogPost | null;
  } catch (error) {
    console.error(`Error fetching education article with slug ${slug}:`, error);
    return null;
  }
}

// Fetch all legal pages
export async function getLegalPages(): Promise<BlogPost[]> {
  try {
    const { data } = await storyblokClient.get("cdn/stories", {
      starts_with: "legal/",
      version: await getStoryblokVersion(),
      sort_by: "first_published_at:desc",
    });

    return (data.stories || []) as BlogPost[];
  } catch (error) {
    console.error("Error fetching legal pages:", error);
    return [];
  }
}

// Fetch a single legal page by slug
export async function getLegalPageBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const { data } = await storyblokClient.get(`cdn/stories/legal/${slug}`, {
      version: await getStoryblokVersion(),
    });

    return (data.story || null) as BlogPost | null;
  } catch (error) {
    console.error(`Error fetching legal page with slug ${slug}:`, error);
    return null;
  }
}
