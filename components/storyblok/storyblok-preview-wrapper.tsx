"use client";

import dynamic from "next/dynamic";

// Dynamically import Storyblok preview component - only loads when preview mode is enabled
// ssr: false ensures it's not included in the initial bundle
const StoryblokPreview = dynamic(
  () => import("./storyblok-preview").then((mod) => mod.StoryblokPreview),
  { ssr: false }
);

export function StoryblokPreviewWrapper() {
  // This component only renders when preview mode is enabled (checked in layout)
  return <StoryblokPreview />;
}
