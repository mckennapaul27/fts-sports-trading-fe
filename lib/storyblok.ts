import StoryblokClient from "storyblok-js-client";
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
      version: process.env.NODE_ENV === "development" ? "draft" : "published",
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
      version: process.env.NODE_ENV === "development" ? "draft" : "published",
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
      version: process.env.NODE_ENV === "development" ? "draft" : "published",
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
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
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
      version: process.env.NODE_ENV === "development" ? "draft" : "published",
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
      version: process.env.NODE_ENV === "development" ? "draft" : "published",
    });

    return (data.story || null) as BlogPost | null;
  } catch (error) {
    console.error(`Error fetching legal page with slug ${slug}:`, error);
    return null;
  }
}
