"use client";

import Script from "next/script";
import { initStoryblok } from "@/lib/storyblok";

export function StoryblokPreview() {
  // This component only renders when preview mode is enabled (checked in layout)
  // So we can directly load the script without checking cookies
  return (
    <Script
      src="https://app.storyblok.com/f/storyblok-v2-latest.js"
      strategy="afterInteractive"
      onLoad={() => {
        // Initialize Storyblok bridge after script loads
        initStoryblok();
      }}
    />
  );
}
