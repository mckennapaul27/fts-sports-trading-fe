import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SystemResultSnippetComponent,
  InfoBoxComponent,
  StoryblokAsset,
} from "./storyblok-types";
import { SystemResultSnippet } from "@/components/blog/system-result-snippet";
import { InfoBox } from "@/components/blog/info-box";

// Storyblok Rich Text Types
interface RichTextMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface RichTextNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  text?: string;
  marks?: RichTextMark[];
}

interface RichTextContent {
  type: "doc";
  content: RichTextNode[];
}

interface RenderRichTextOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: RichTextContent | any; // Storyblok richtext type
  className?: string;
}

// Get Storyblok image URL
function getStoryblokImageUrl(
  asset: StoryblokAsset | string | undefined
): string {
  if (!asset) return "";

  // If it's already a string URL
  if (typeof asset === "string") {
    return asset.startsWith("http") ? asset : `https://a.storyblok.com${asset}`;
  }

  // If it's an asset object
  if (!asset.filename) return "";

  if (asset.filename.startsWith("http")) {
    return asset.filename;
  }

  return asset.filename.startsWith("/")
    ? `https://a.storyblok.com${asset.filename}`
    : `https://a.storyblok.com/f/${asset.filename}`;
}

/**
 * Recursively renders rich text nodes, converting images to Next.js Image components
 * and handling nested Storyblok blocks
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderNode(
  node: RichTextNode | any,
  key: number = 0
): React.ReactNode {
  if (!node) return null;

  // Handle blok nodes (Storyblok components embedded in rich text)
  if (node.type === "blok") {
    const attrs = node.attrs || {};
    const body = attrs.body;

    if (!body || !Array.isArray(body) || body.length === 0) {
      return null;
    }

    // Render all components in the body array
    return (
      <React.Fragment key={key}>
        {body.map((component: any, idx: number) => {
          // Handle system_result_snippet component
          if (component?.component === "system_result_snippet") {
            return (
              <div key={`${key}-${idx}`} className="my-8">
                <SystemResultSnippet
                  component={component as SystemResultSnippetComponent}
                />
              </div>
            );
          }

          // Handle info_box component
          if (component?.component === "info_box") {
            return (
              <div key={`${key}-${idx}`} className="my-8">
                <InfoBox component={component as InfoBoxComponent} />
              </div>
            );
          }

          // For other component types, return null
          return null;
        })}
      </React.Fragment>
    );
  }

  // Handle image nodes
  if (node.type === "image") {
    const attrs = node.attrs || {};
    const src = attrs.src;
    const alt = attrs.alt || "";
    const caption = attrs.title || "";

    if (!src) return null;

    // Extract dimensions from Storyblok URL if available
    const urlMatch = src.match(/\/(\d+)x(\d+)\//);
    const width = urlMatch ? parseInt(urlMatch[1]) : 800;
    const height = urlMatch ? parseInt(urlMatch[2]) : 600;

    const imageUrl = getStoryblokImageUrl(src);

    return (
      <figure key={key} className="my-6">
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className="shadow-lg rounded-lg w-full h-auto"
          unoptimized={imageUrl.includes("a.storyblok.com")}
        />
        {caption && (
          <figcaption className="text-sm text-gray-600 mt-3 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Handle paragraph nodes
  if (node.type === "paragraph") {
    if (!node.content || node.content.length === 0) {
      return null;
    }

    // Check if paragraph contains any images
    const hasImages = node.content.some((child: any) => child.type === "image");

    // If paragraph only contains an image, render image directly without paragraph wrapper
    if (node.content.length === 1 && node.content[0]?.type === "image") {
      return renderNode(node.content[0], key);
    }

    // If paragraph contains images mixed with other content, split them
    if (hasImages) {
      const textContent: any[] = [];
      const imageContent: any[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node.content.forEach((child: any, idx: number) => {
        if (child.type === "image") {
          imageContent.push(renderNode(child, idx));
        } else {
          textContent.push(renderNode(child, idx));
        }
      });

      return (
        <React.Fragment key={key}>
          {textContent.length > 0 && (
            <p
              className={
                node.attrs?.textAlign ? `text-${node.attrs.textAlign}` : ""
              }
            >
              {textContent}
            </p>
          )}
          {imageContent}
        </React.Fragment>
      );
    }

    // Regular paragraph with no images
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return (
      <p
        key={key}
        className={node.attrs?.textAlign ? `text-${node.attrs.textAlign}` : ""}
      >
        {children}
      </p>
    );
  }

  // Handle heading nodes
  if (node.type === "heading") {
    const level = node.attrs?.level || 2;
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    if (level === 1) return <h1 key={key}>{children}</h1>;
    if (level === 2) return <h2 key={key}>{children}</h2>;
    if (level === 3) return <h3 key={key}>{children}</h3>;
    if (level === 4) return <h4 key={key}>{children}</h4>;
    if (level === 5) return <h5 key={key}>{children}</h5>;
    if (level === 6) return <h6 key={key}>{children}</h6>;
    return <h2 key={key}>{children}</h2>;
  }

  // Handle text nodes
  if (node.type === "text") {
    let text: React.ReactNode = node.text || "";

    // Apply marks (bold, italic, etc.) - apply in reverse order
    if (node.marks && Array.isArray(node.marks)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node.marks.reverse().forEach((mark: any) => {
        if (mark.type === "bold") {
          text = <strong key={key}>{text}</strong>;
        } else if (mark.type === "italic") {
          text = <em key={key}>{text}</em>;
        } else if (mark.type === "code") {
          text = <code key={key}>{text}</code>;
        } else if (mark.type === "link") {
          const href = mark.attrs?.href || "#";
          text = (
            <Link
              key={key}
              href={href}
              target={href.startsWith("http") ? "_blank" : "_self"}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:text-teal transition-colors text-teal"
              aria-label={`Link to ${href}`}
            >
              {text}
            </Link>
          );
        }
      });
    }

    return <React.Fragment key={key}>{text}</React.Fragment>;
  }

  // Handle bullet list
  if (node.type === "bullet_list") {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return <ul key={key}>{children}</ul>;
  }

  // Handle ordered list
  if (node.type === "ordered_list") {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return <ol key={key}>{children}</ol>;
  }

  // Handle list item
  if (node.type === "list_item") {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return <li key={key}>{children}</li>;
  }

  // Handle hard break
  if (node.type === "hard_break") {
    return <br key={key} />;
  }

  // Handle blockquote
  if (node.type === "blockquote") {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return <blockquote key={key}>{children}</blockquote>;
  }

  // Handle code block
  if (node.type === "code_block") {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return (
      <pre
        key={key}
        className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"
      >
        <code>{children}</code>
      </pre>
    );
  }

  // Handle table (support both "table" and variations)
  if (node.type === "table" || node.type === "table_wrapper") {
    if (!node.content || !Array.isArray(node.content)) {
      return null;
    }

    const children = node.content.map((child: any, idx: number) =>
      renderNode(child, idx)
    );

    const hasDirectRows = node.content.some(
      (child: any) =>
        child.type === "table_row" ||
        child.type === "tableRow" ||
        child.type === "tr"
    );

    const hasWrapper = node.content.some(
      (child: any) =>
        child.type === "table_body" ||
        child.type === "tableBody" ||
        child.type === "tbody" ||
        child.type === "table_head" ||
        child.type === "tableHead" ||
        child.type === "thead"
    );

    const tableContent =
      hasDirectRows && !hasWrapper ? (
        <tbody key="tbody">{children}</tbody>
      ) : (
        children
      );

    return (
      <div
        key={key}
        className="my-8 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0"
      >
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse border border-gray-300 text-sm bg-white shadow-sm">
            {tableContent}
          </table>
        </div>
      </div>
    );
  }

  // Handle table head
  if (
    node.type === "table_head" ||
    node.type === "tableHead" ||
    node.type === "thead"
  ) {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return <thead key={key}>{children}</thead>;
  }

  // Handle table body
  if (
    node.type === "table_body" ||
    node.type === "tableBody" ||
    node.type === "tbody"
  ) {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return <tbody key={key}>{children}</tbody>;
  }

  // Handle table row
  if (
    node.type === "table_row" ||
    node.type === "tableRow" ||
    node.type === "tr"
  ) {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return (
      <tr key={key} className="border-b border-gray-300 hover:bg-gray-50">
        {children}
      </tr>
    );
  }

  // Handle table header cell
  if (
    node.type === "table_header" ||
    node.type === "tableHeader" ||
    node.type === "th"
  ) {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    return (
      <th
        key={key}
        className="border border-gray-300 px-4 py-3 bg-gray-100 font-semibold text-left text-dark-navy"
      >
        {children}
      </th>
    );
  }

  // Handle table cell
  if (
    node.type === "table_cell" ||
    node.type === "tableCell" ||
    node.type === "td"
  ) {
    const children = node.content
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.content.map((child: any, idx: number) => renderNode(child, idx))
      : null;

    const cellContent =
      children && children.length > 0 ? children : <>&nbsp;</>;

    return (
      <td key={key} className="border border-gray-300 px-4 py-3 text-gray-700">
        {cellContent}
      </td>
    );
  }

  // For any other node types, try to render children if they exist
  if (node.content && Array.isArray(node.content)) {
    return (
      <React.Fragment key={key}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {node.content.map((child: any, idx: number) => renderNode(child, idx))}
      </React.Fragment>
    );
  }

  return null;
}

/**
 * Renders Storyblok rich text content with Tailwind Typography prose classes
 * Images are rendered using Next.js Image component
 */
export function renderStoryblokRichText({
  content,
  className = "",
}: RenderRichTextOptions): React.ReactElement | null | undefined {
  if (!content || !content.content || content.content.length === 0) {
    return null;
  }

  // Combine prose classes with any additional classes
  const proseClasses = `prose prose-lg max-w-none prose-headings:text-dark-navy prose-p:text-gray-700 prose-strong:text-dark-navy prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-teal prose-a:no-underline hover:prose-a:underline ${className}`;

  // Render nodes recursively and filter out null/undefined values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderedContent: React.ReactNode[] = [];

  content.content.forEach((node: any, index: number) => {
    const rendered = renderNode(node, index);
    if (rendered !== null && rendered !== undefined) {
      renderedContent.push(rendered);
    }
  });

  // If no valid content after filtering, return null
  if (renderedContent.length === 0) {
    return null;
  }

  return <div className={proseClasses}>{renderedContent}</div>;
}
