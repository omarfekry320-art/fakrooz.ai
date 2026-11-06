import React, { useState } from 'react';
import { Bot, User, Copy, Check, RotateCw, AlertCircle, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { MarkdownRenderer, detectIsArabic } from '../lib/markdown';

interface ChatMessageProps {
  message: ChatMessageType;
  isLastAssistant: boolean;
  onRegenerate?: () => void;
  lang: 'ar' | 'en';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastAssistant,
  onRegenerate,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isArabic = detectIsArabic(message.content);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`group w-full max-w-4xl mx-auto flex gap-3 sm:gap-4 my-2 px-2 sm:px-4 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        ) : (
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900/60 rounded-[10px] flex items-center justify-center text-white backdrop-blur-xs">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200" />
            </div>
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className={`flex flex-col max-w-[88%] sm:max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name and time */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          <span>{isUser ? (lang === 'ar' ? 'أنت' : 'You') : 'Fakrooz (فكروز)'}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Bubble */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`relative px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xs transition-colors ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs sm:rounded-br-xs'
              : message.error
              ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 rounded-bl-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 rounded-bl-xs'
          }`}
        >
          {message.error ? (
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">{message.content}</p>
                <p className="text-xs text-rose-600 dark:text-rose-300">
                  {lang === 'ar'
                    ? 'يمكنك الضغط على زر "إعادة المحاولة" أدناه للمحاولة مرة أخرى.'
                    : 'Click "Regenerate" below to retry sending the message.'}
                </p>
              </div>
            </div>
          ) : isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {message.content}
            </div>
          ) : (
            <div>
              {message.isStreaming && !message.content ? (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-1 text-sm select-none">
                  <span className="font-medium text-xs text-indigo-600 dark:text-indigo-400">
                    {lang === 'ar' ? 'فكروز يفكر ويكتب الآن...' : 'Fakrooz is thinking & typing...'}
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dot-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dot-3" />
                  </div>
                </div>
              ) : (
                <>
                  <MarkdownRenderer content={message.content} />
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 ms-1 bg-indigo-500 animate-pulse align-middle" />
                  )}
                </>
              )}

              {/* Live Web Grounding Sources (Google Search Grounding) */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    <span>🌐</span>
                    <span>{lang === 'ar' ? 'المصادر المباشرة من الويب:' : 'Live Web Sources:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {message.sources.map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-[11px] text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors max-w-[240px] truncate"
                        title={src.title}
                      >
                        <span className="truncate">{src.title || src.url}</span>
                        <span className="text-[10px] opacity-70">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons (Copy, Regenerate) */}
        {!message.isStreaming && (
          <div className="flex items-center gap-1.5 mt-1 px-1">
            <button
              onClick={handleCopyMessage}
              type="button"
              className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-2 py-0.5 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title={lang === 'ar' ? 'نسخ الرسالة' : 'Copy message'}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">
                    {lang === 'ar' ? 'تم النسخ' : 'Copied'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                </>
              )}
            </button>

            {!isUser && isLastAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                type="button"
                className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 px-2 py-0.5 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title={lang === 'ar' ? 'إعادة توليد الرد' : 'Regenerate response'}
              >
                <RotateCw className="w-3 h-3" />
                <span>{lang === 'ar' ? 'إعادة التوليد' : 'Regenerate'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
