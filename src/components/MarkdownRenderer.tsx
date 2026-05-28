import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple regex parser to convert raw course markdown into structured, safe HTML components.
  // This is highly robust since we can render exact elegant Tailwind items.
  const lines = content.split("\n");
  let inCodeBlock = false;
  let codeSnippet: string[] = [];

  const parsedElements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // Close code block
        parsedElements.push(
          <pre key={`code-${i}`} className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 rounded-xl font-mono text-xs overflow-x-auto my-3.5 border border-gray-200">
            <code>{codeSnippet.join("\n")}</code>
          </pre>
        );
        codeSnippet = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeSnippet.push(line);
      continue;
    }

    // Handle Headings (### or ## or #)
    if (line.trim().startsWith("### ")) {
      parsedElements.push(
        <h4 key={`h3-${i}`} className="font-display font-bold text-lg text-gray-900 mt-5.5 mb-2 leading-tight">
          {renderInlineMarkdown(line.replace("### ", ""))}
        </h4>
      );
      continue;
    }
    if (line.trim().startsWith("## ")) {
      parsedElements.push(
        <h3 key={`h2-${i}`} className="font-display font-bold text-xl text-gray-900 mt-6.5 mb-2.5 leading-tight pb-1.5 border-b border-gray-100">
          {renderInlineMarkdown(line.replace("## ", ""))}
        </h3>
      );
      continue;
    }
    if (line.trim().startsWith("# ")) {
      parsedElements.push(
        <h2 key={`h1-${i}`} className="font-display font-bold text-2xl text-gray-900 mt-7.5 mb-3 leading-tight">
          {renderInlineMarkdown(line.replace("# ", ""))}
        </h2>
      );
      continue;
    }

    // Handle Bullet points (* or -)
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      const rest = line.trim().substring(2);
      parsedElements.push(
        <div key={`bullet-${i}`} className="flex items-start space-x-2.5 my-1.5 ml-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF] mt-2 shrink-0"></span>
          <p className="text-gray-700 leading-relaxed text-[15px]">{renderInlineMarkdown(rest)}</p>
        </div>
      );
      continue;
    }

    // Handle Blockquotes (>)
    if (line.trim().startsWith("> ")) {
      parsedElements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-[#6C47FF] pl-4 pr-2 py-1.5 my-3.5 bg-[#6C47FF]/5 rounded-r-xl italic text-gray-700 text-sm">
          {renderInlineMarkdown(line.replace(/^>\s*/, ""))}
        </blockquote>
      );
      continue;
    }

    // Handle Empty Lines
    if (line.trim() === "") {
      parsedElements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Regular Paragraph
    parsedElements.push(
      <p key={`p-${i}`} className="text-gray-700 leading-relaxed text-[15px] my-2.5">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  return <div className="space-y-1">{parsedElements}</div>;
}

// Sub-parser for bold (**text**), code (`code`), and italics (*text*)
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let index = 0;

  // Pattern to find bold, inline code, or highlights
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const matches = text.split(regex);

  return matches.map((chunk, idx) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-gray-900">
          {chunk.slice(2, -2)}
        </strong>
      );
    }
    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      return (
        <code key={idx} className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 rounded text-[#FF6B6B] border border-gray-100">
          {chunk.slice(1, -1)}
        </code>
      );
    }
    if (chunk.startsWith("*") && chunk.endsWith("*")) {
      return (
        <em key={idx} className="italic text-gray-800">
          {chunk.slice(1, -1)}
        </em>
      );
    }
    return chunk;
  });
}
