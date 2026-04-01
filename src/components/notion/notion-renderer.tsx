"use client";

import React, { Fragment } from "react";
import type { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Our data layer may attach children to any block. */
type BlockWithChildren = BlockObjectResponse & {
  children?: BlockWithChildren[];
};

export interface NotionRendererProps {
  blocks: BlockWithChildren[];
}

// ---------------------------------------------------------------------------
// Notion color → Tailwind class map
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<string, string> = {
  default: "",
  gray: "text-gray-500 dark:text-gray-400",
  brown: "text-amber-700 dark:text-amber-500",
  orange: "text-orange-600 dark:text-orange-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  green: "text-green-600 dark:text-green-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  pink: "text-pink-600 dark:text-pink-400",
  red: "text-red-600 dark:text-red-400",
  gray_background: "bg-gray-100 dark:bg-gray-800 rounded px-1",
  brown_background: "bg-amber-100 dark:bg-amber-900/40 rounded px-1",
  orange_background: "bg-orange-100 dark:bg-orange-900/40 rounded px-1",
  yellow_background: "bg-yellow-100 dark:bg-yellow-900/40 rounded px-1",
  green_background: "bg-green-100 dark:bg-green-900/40 rounded px-1",
  blue_background: "bg-blue-100 dark:bg-blue-900/40 rounded px-1",
  purple_background: "bg-purple-100 dark:bg-purple-900/40 rounded px-1",
  pink_background: "bg-pink-100 dark:bg-pink-900/40 rounded px-1",
  red_background: "bg-red-100 dark:bg-red-900/40 rounded px-1",
};

// ---------------------------------------------------------------------------
// Rich text renderer
// ---------------------------------------------------------------------------

function renderRichText(richTexts: RichTextItemResponse[]): React.ReactNode {
  if (!richTexts || richTexts.length === 0) return null;

  return richTexts.map((text, i) => {
    let content: React.ReactNode = text.plain_text;
    const { annotations } = text;

    // Apply color
    const colorClass = COLOR_MAP[annotations.color] ?? "";

    // Build inline styles via wrapping elements
    if (annotations.code) {
      content = (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">
          {content}
        </code>
      );
    }
    if (annotations.bold) {
      content = <strong>{content}</strong>;
    }
    if (annotations.italic) {
      content = <em>{content}</em>;
    }
    if (annotations.strikethrough) {
      content = <s>{content}</s>;
    }
    if (annotations.underline) {
      content = <u>{content}</u>;
    }

    // Wrap in link if present
    if (text.href) {
      content = (
        <a
          href={text.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-current underline-offset-2 hover:opacity-80"
        >
          {content}
        </a>
      );
    }

    if (colorClass) {
      return (
        <span key={i} className={colorClass}>
          {content}
        </span>
      );
    }

    return <Fragment key={i}>{content}</Fragment>;
  });
}

/** Extract plain text from a rich text array (for alt text, etc.) */
function plainText(richTexts: RichTextItemResponse[] | undefined): string {
  if (!richTexts) return "";
  return richTexts.map((t) => t.plain_text).join("");
}

// ---------------------------------------------------------------------------
// Individual block renderers
// ---------------------------------------------------------------------------

function renderBlock(block: BlockWithChildren): React.ReactNode {
  const { type, id } = block;
  const children = block.children;

  switch (type) {
    // ------ Paragraph ------
    case "paragraph": {
      const text = renderRichText(block.paragraph.rich_text);
      return (
        <p key={id}>
          {text}
          {children && <NotionRenderer blocks={children} />}
        </p>
      );
    }

    // ------ Headings ------
    case "heading_1": {
      return (
        <h1 key={id}>
          {renderRichText(block.heading_1.rich_text)}
          {children && <NotionRenderer blocks={children} />}
        </h1>
      );
    }
    case "heading_2": {
      return (
        <h2 key={id}>
          {renderRichText(block.heading_2.rich_text)}
          {children && <NotionRenderer blocks={children} />}
        </h2>
      );
    }
    case "heading_3": {
      return (
        <h3 key={id}>
          {renderRichText(block.heading_3.rich_text)}
          {children && <NotionRenderer blocks={children} />}
        </h3>
      );
    }

    // ------ List items (rendered individually — grouping happens in renderBlocks) ------
    case "bulleted_list_item": {
      return (
        <li key={id}>
          {renderRichText(block.bulleted_list_item.rich_text)}
          {children && children.length > 0 && <NotionRenderer blocks={children} />}
        </li>
      );
    }
    case "numbered_list_item": {
      return (
        <li key={id}>
          {renderRichText(block.numbered_list_item.rich_text)}
          {children && children.length > 0 && <NotionRenderer blocks={children} />}
        </li>
      );
    }

    // ------ To-do ------
    case "to_do": {
      const checked = block.to_do.checked;
      return (
        <div key={id} className="flex items-start gap-2 py-0.5">
          <input
            type="checkbox"
            checked={checked}
            readOnly
            className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600"
          />
          <span className={checked ? "line-through opacity-60" : ""}>
            {renderRichText(block.to_do.rich_text)}
          </span>
          {children && <NotionRenderer blocks={children} />}
        </div>
      );
    }

    // ------ Toggle ------
    case "toggle": {
      return (
        <details key={id} className="group my-2">
          <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
            <span className="mr-1 inline-block transition-transform group-open:rotate-90">
              ▶
            </span>
            {renderRichText(block.toggle.rich_text)}
          </summary>
          <div className="ml-5 mt-1">
            {children && <NotionRenderer blocks={children} />}
          </div>
        </details>
      );
    }

    // ------ Code ------
    case "code": {
      const language = block.code.language ?? "plain text";
      const caption = plainText(block.code.caption);
      return (
        <figure key={id} className="my-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between bg-gray-100 px-4 py-1.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <span>{language}</span>
            </div>
            <pre className="!mt-0 overflow-x-auto !rounded-t-none">
              <code className={`language-${language}`}>
                {plainText(block.code.rich_text)}
              </code>
            </pre>
          </div>
          {caption && (
            <figcaption className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // ------ Quote ------
    case "quote": {
      return (
        <blockquote key={id}>
          {renderRichText(block.quote.rich_text)}
          {children && <NotionRenderer blocks={children} />}
        </blockquote>
      );
    }

    // ------ Callout ------
    case "callout": {
      const icon = block.callout.icon;
      let emoji: string | null = null;
      if (icon?.type === "emoji") {
        emoji = icon.emoji;
      }
      return (
        <div
          key={id}
          className="my-4 flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
        >
          {emoji && <span className="mt-0.5 text-xl leading-none">{emoji}</span>}
          <div className="min-w-0 flex-1">
            {renderRichText(block.callout.rich_text)}
            {children && <NotionRenderer blocks={children} />}
          </div>
        </div>
      );
    }

    // ------ Divider ------
    case "divider": {
      return <hr key={id} />;
    }

    // ------ Image ------
    case "image": {
      const caption = plainText(block.image.caption);
      const alt = caption || "Image";
      const src = `/api/notion-image?blockId=${block.id}`;
      return (
        <figure key={id} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full rounded-lg"
          />
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // ------ Bookmark ------
    case "bookmark": {
      const url = block.bookmark.url;
      const caption = plainText(block.bookmark.caption);
      return (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 break-all">
            {caption || url}
          </span>
        </a>
      );
    }

    // ------ Embed ------
    case "embed": {
      const url = block.embed.url;
      const caption = plainText(block.embed.caption);
      return (
        <figure key={id} className="my-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={url}
              title={caption || "Embedded content"}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // ------ Video ------
    case "video": {
      const video = block.video;
      const caption = plainText(video.caption);
      let videoUrl = "";
      if (video.type === "external") {
        videoUrl = video.external.url;
      } else if (video.type === "file") {
        videoUrl = video.file.url;
      }

      const isYouTube = /youtube\.com|youtu\.be/.test(videoUrl);
      const isVimeo = /vimeo\.com/.test(videoUrl);

      if (isYouTube || isVimeo) {
        let embedUrl = videoUrl;
        if (isYouTube) {
          const match = videoUrl.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
          );
          if (match) {
            embedUrl = `https://www.youtube.com/embed/${match[1]}`;
          }
        } else if (isVimeo) {
          const match = videoUrl.match(/vimeo\.com\/(\d+)/);
          if (match) {
            embedUrl = `https://player.vimeo.com/video/${match[1]}`;
          }
        }
        return (
          <figure key={id} className="my-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={embedUrl}
                title={caption || "Video"}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
            {caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      }

      // Fallback: HTML5 video
      return (
        <figure key={id} className="my-6">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg"
            preload="metadata"
          />
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // ------ Table ------
    case "table": {
      const hasColumnHeader = block.table.has_column_header;
      const hasRowHeader = block.table.has_row_header;
      const rows = children ?? [];

      return (
        <div key={id} className="my-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {rows.map((row, rowIndex) => {
                if (row.type !== "table_row") return null;
                const cells = row.table_row.cells;
                const isHeaderRow = hasColumnHeader && rowIndex === 0;

                return (
                  <tr
                    key={row.id}
                    className={
                      isHeaderRow
                        ? "bg-gray-50 dark:bg-gray-800/50"
                        : ""
                    }
                  >
                    {cells.map((cell, cellIndex) => {
                      const isHeaderCell = isHeaderRow || (hasRowHeader && cellIndex === 0);
                      const Tag = isHeaderCell ? "th" : "td";
                      return (
                        <Tag
                          key={cellIndex}
                          className="border border-gray-200 px-3 py-2 text-left dark:border-gray-700"
                        >
                          {renderRichText(cell)}
                        </Tag>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // ------ Table row (rendered by table parent, skip standalone) ------
    case "table_row": {
      return null;
    }

    // ------ Column list & Column ------
    case "column_list": {
      const columns = children ?? [];
      return (
        <div key={id} className="my-4 flex flex-col gap-4 md:flex-row">
          {columns.map((col) => (
            <div key={col.id} className="flex-1 min-w-0">
              {col.children && <NotionRenderer blocks={col.children} />}
            </div>
          ))}
        </div>
      );
    }

    case "column": {
      // Columns are rendered by column_list parent; standalone renders its children
      return (
        <div key={id}>
          {children && <NotionRenderer blocks={children} />}
        </div>
      );
    }

    // ------ Unsupported / Unknown ------
    default: {
      // Gracefully skip unsupported block types
      return null;
    }
  }
}

// ---------------------------------------------------------------------------
// Block grouping (consecutive list items → <ul>/<ol> wrappers)
// ---------------------------------------------------------------------------

interface GroupedBlock {
  type: "single" | "bulleted_list" | "numbered_list";
  blocks: BlockWithChildren[];
}

function groupBlocks(blocks: BlockWithChildren[]): GroupedBlock[] {
  const groups: GroupedBlock[] = [];

  for (const block of blocks) {
    const lastGroup = groups[groups.length - 1];

    if (block.type === "bulleted_list_item") {
      if (lastGroup?.type === "bulleted_list") {
        lastGroup.blocks.push(block);
      } else {
        groups.push({ type: "bulleted_list", blocks: [block] });
      }
    } else if (block.type === "numbered_list_item") {
      if (lastGroup?.type === "numbered_list") {
        lastGroup.blocks.push(block);
      } else {
        groups.push({ type: "numbered_list", blocks: [block] });
      }
    } else {
      groups.push({ type: "single", blocks: [block] });
    }
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotionRenderer({ blocks }: NotionRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  const groups = groupBlocks(blocks);

  return (
    <>
      {groups.map((group, i) => {
        if (group.type === "bulleted_list") {
          return (
            <ul key={`ul-${i}`}>
              {group.blocks.map((block) => renderBlock(block))}
            </ul>
          );
        }

        if (group.type === "numbered_list") {
          return (
            <ol key={`ol-${i}`}>
              {group.blocks.map((block) => renderBlock(block))}
            </ol>
          );
        }

        // Single block
        return <Fragment key={group.blocks[0].id}>{renderBlock(group.blocks[0])}</Fragment>;
      })}
    </>
  );
}

export default NotionRenderer;
