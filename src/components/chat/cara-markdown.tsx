"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface CaraMarkdownProps {
  content: string;
  className?: string;
}

export function CaraMarkdown({ content, className }: CaraMarkdownProps) {
  return (
    <div
      className={cn(
        "max-w-[90%] text-[13px] leading-relaxed text-white/80 [&_*]:break-words",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-2 mt-3 text-[16px] font-semibold text-white first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-3 text-[15px] font-semibold text-white first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1.5 mt-2.5 text-[14px] font-semibold text-white first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-2.5 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2.5 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-white/85">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              {children}
            </a>
          ),
          code: ({ className: codeClass, children }) => {
            const isBlock = Boolean(codeClass);
            if (isBlock) {
              return (
                <code className="block whitespace-pre-wrap font-mono text-[12px] text-white/90">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[12px] text-white">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-2.5 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.06] p-3 last:mb-0">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-2.5 border-l-2 border-primary/60 pl-3 text-white/65 last:mb-0">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-white/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
