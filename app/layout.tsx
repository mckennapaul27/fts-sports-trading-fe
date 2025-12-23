import type { Metadata } from "next";
import { Karla, Rubik } from "next/font/google";
import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import "./globals.css";
import { ConditionalNavbarFooter } from "@/components/layout/conditional-navbar-footer";
import { ToasterProvider } from "@/components/ui/toaster";

// Dynamically import the wrapper - only loads when preview mode is enabled
// This ensures zero Storyblok code in the bundle for regular visitors
const StoryblokPreviewWrapper = dynamic(() =>
  import("@/components/storyblok/storyblok-preview-wrapper").then(
    (mod) => mod.StoryblokPreviewWrapper
  )
);

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fortis Sports Trading | Professional Sports Trading Systems",
  description:
    "Transparent, data-driven sports trading systems. Access daily selections, complete results history, and proven strategies for consistent returns.",
};

if (process.env.NODE_ENV !== "production") {
  // Load Storyblok only in preview mode
  const { initStoryblok } = require("@/lib/storyblok");
  initStoryblok();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if we're in preview mode (server-side check)
  const draft = await draftMode();
  const isPreviewMode = (draft as { isEnabled: boolean }).isEnabled;

  return (
    <html lang="en">
      <body className={`${karla.variable} ${rubik.variable} antialiased`}>
        <ToasterProvider />
        {isPreviewMode && <StoryblokPreviewWrapper />}
        <ConditionalNavbarFooter>{children}</ConditionalNavbarFooter>
      </body>
    </html>
  );
}
