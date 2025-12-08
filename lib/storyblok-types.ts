// Minimal TypeScript types for Storyblok case studies
// These types are based on the actual Storyblok response structure

export interface StoryblokAsset {
  id: number;
  alt: string;
  name: string;
  focus: string;
  title: string;
  source: string;
  filename: string;
  copyright: string;
  fieldtype: string;
  meta_data: Record<string, unknown>;
  is_external_url: boolean;
}

export interface StoryblokComponent {
  _uid: string;
  component: string;
  _editable?: string;
  [key: string]: unknown;
}

export interface MetaDataComponent extends StoryblokComponent {
  component: "meta_data";
  title?: string;
  description?: string;
  og_image?: StoryblokAsset;
}

// Blog/Insights page types
export interface BlogPostContent {
  _uid: string;
  component: string;
  title: string;
  description?: string;
  body?: any; // Rich text field (Storyblok rich text object)
  blocks?: StoryblokComponent[]; // Can contain meta_data
  feature_image?: StoryblokAsset;
  first_published_at?: string;
  published_at?: string;
  [key: string]: unknown;
}

export interface BlogPost {
  name: string;
  slug: string;
  uuid: string;
  content: BlogPostContent;
  first_published_at?: string;
  published_at?: string;
  [key: string]: unknown;
}

// Nested block types for rich text content
export interface SystemResultSnippetComponent extends StoryblokComponent {
  component: "system_result_snippet";
  title?: string;
  profit_loss?: string;
  bets?: string;
  win_rate?: string;
  roi?: string;
  comment?: string;
}

export interface InfoBoxComponent extends StoryblokComponent {
  component: "info_box";
  title?: string;
  information?: string;
  bg_color?: "info" | "link" | "success" | "warning" | "danger";
}
