import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  isRtl?: boolean;
}

export function detectIsArabic(text: string): boolean {
  if (!text) return true;
  // Check if first 100 characters contain Arabic characters
  const sample = text.slice(0, 200);
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(sample);
}

// Separate component for code block with copy button
export const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const displayLang = language || 'code';

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/95 text-slate-100 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/80 text-xs font-mono text-slate-400 border-b border-slate-700/60">
        <span className="uppercase tracking-wider font-semibold text-indigo-400">{displayLang}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans transition-all hover:bg-slate-700/80 hover:text-slate-200 text-slate-300"
          title="نسخ الكود"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ الكود</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-sm leading-relaxed" dir="ltr">
        <pre className="font-mono text-slate-200">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split content by code blocks to render them with our interactive CodeBlock component
  // Regex matches ```lang\ncode```
  const codeBlockRegex = /```([a-zA-Z0-9_\-+]*)\n([\s\S]*?)```/g;

  const parts: Array<{ type: 'markdown' | 'code'; content: string; language?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        content: content.substring(lastIndex, match.index),
      });
    }

    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trimEnd(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      content: content.substring(lastIndex),
    });
  }

  return (
    <div className="markdown-content text-sm sm:text-base">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeBlock key={idx} code={part.content} language={part.language} />;
        }

        // Render markdown HTML safely
        const rawHtml = marked.parse(part.content, {
          gfm: true,
          breaks: true,
        }) as string;

        const isArabicText = detectIsArabic(part.content);

        return (
          <div
            key={idx}
            dir={isArabicText ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: rawHtml }}
            className="prose-container"
          />
        );
      })}
    </div>
  );
};
