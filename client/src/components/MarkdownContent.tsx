/*
 * MarkdownContent – renders Anytype markdown with Deep Space Lab styling.
 * Uses react-markdown + remark-gfm for full GFM support (tables, strikethrough, etc.)
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownContentProps {
  content: string;
  /** Accent colour for headings and blockquote border (default: cyan) */
  accentColor?: string;
  className?: string;
}

export default function MarkdownContent({
  content,
  accentColor = "#00d4ff",
  className = "",
}: MarkdownContentProps) {
  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1
        className="text-3xl font-bold mt-10 mb-3 text-foreground"
        style={{ fontFamily: "var(--font-display)", color: accentColor }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="text-2xl font-bold mt-8 mb-2"
        style={{ fontFamily: "var(--font-display)", color: accentColor }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-xl font-semibold mt-6 mb-2 text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className="text-base font-semibold mt-4 mb-1 text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {children}
      </h4>
    ),

    // Paragraph
    p: ({ children }) => (
      <p
        className="text-base text-muted-foreground leading-relaxed mb-4"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </p>
    ),

    // Links – open external links in new tab
    // Strip markdown backslash-escapes from URLs (e.g. schimmilab\_webpage → schimmilab_webpage)
    a: ({ href, children }) => {
      const cleanHref = href?.replace(/\\([^\\])/g, "$1");
      const isExternal = cleanHref?.startsWith("http");
      return (
        <a
          href={cleanHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          style={{ color: accentColor }}
        >
          {children}
        </a>
      );
    },

    // Inline code
    code: ({ children, className: cls }) => {
      // Block code is handled by <pre>
      const isBlock = cls?.startsWith("language-");
      if (isBlock) {
        return (
          <code
            className="block text-xs text-muted-foreground overflow-x-auto"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className="text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {children}
        </code>
      );
    },

    // Code block wrapper
    pre: ({ children }) => (
      <div className="my-4 border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-secondary/50">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <pre
          className="p-4 text-xs leading-relaxed overflow-x-auto"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {children}
        </pre>
      </div>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote
        className="border-l-2 pl-6 py-1 my-4 italic text-muted-foreground"
        style={{ borderColor: accentColor, fontFamily: "var(--font-body)" }}
      >
        {children}
      </blockquote>
    ),

    // Lists
    ul: ({ children }) => (
      <ul
        className="list-disc list-outside pl-5 space-y-1 text-muted-foreground mb-4"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className="list-decimal list-outside pl-5 space-y-1 text-muted-foreground mb-4"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-base leading-relaxed">{children}</li>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="my-8 border-border" />
    ),

    // Strong / em
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-muted-foreground">{children}</em>
    ),

    // Tables (GFM)
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-secondary/50">{children}</thead>
    ),
    th: ({ children }) => (
      <th
        className="px-4 py-2 text-left text-xs font-semibold text-foreground border border-border"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        className="px-4 py-2 text-muted-foreground border border-border"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </td>
    ),
  };

  // Anytype escapes underscores in markdown (\_) to prevent italic interpretation.
  // Normalize these before parsing so URLs like schimmilab\_webpage become schimmilab_webpage.
  const normalizedContent = content.replace(/\\([_*[\]()~`])/g, "$1");

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
