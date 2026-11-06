import React, { useRef, useEffect, useState } from 'react';
import { Send, Square, Mic, MicOff, Sparkles, X } from 'lucide-react';
import { Language } from '../types';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStop: () => void;
  lang: Language;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStop,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  // Voice recognition via Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isAr
          ? 'عذراً، الإدخال الصوتي غير مدعوم في هذا المتصفح. جرّب متصفح Chrome أو Edge.'
          : 'Voice input is not supported in this browser. Try Chrome or Edge.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isAr ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Voice recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4 pt-1">
      {/* Floating Stop Generating Indicator if Loading */}
      {isLoading && (
        <div className="flex items-center justify-center mb-2.5">
          <button
            onClick={onStop}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{isAr ? 'إيقاف الرد' : 'Stop generating'}</span>
          </button>
        </div>
      )}

      {/* Input Box Card */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 rounded-2xl shadow-sm transition-all overflow-hidden"
      >
        <div className="flex items-start px-3 pt-2.5 pb-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAr
                ? 'اكتب سؤالك، كودك، أو فكرتك لفكروز... (Enter للإرسال، Shift+Enter لسطر جديد)'
                : 'Message Fakrooz... (Enter to send, Shift+Enter for new line)'
            }
            className="flex-1 bg-transparent border-0 outline-hidden resize-none text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed max-h-44 py-1"
          />

          {input.length > 0 && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mt-1"
              title="مسح"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Input Bar Footer */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1">
            {/* Voice Dictation */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                isListening
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 animate-pulse font-bold'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title={isAr ? 'إملاء صوتي' : 'Voice Input'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="text-[11px] hidden sm:inline">
                    {isAr ? 'جاري الاستماع...' : 'Listening...'}
                  </span>
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <span className="text-[11px] text-slate-400 hidden sm:inline ps-2">
              {isAr ? 'Fakrooz 2026 ذكاء اصطناعي فائق' : 'Fakrooz AI Engine'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              {isAr ? 'Shift + Enter لسطر جديد' : 'Shift + Enter for new line'}
            </span>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
              title={isAr ? 'إرسال الرسالة' : 'Send message'}
            >
              <span className="hidden sm:inline">{isAr ? 'إرسال' : 'Send'}</span>
              <Send className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </form>

      <p className="text-[11px] text-center text-slate-500 dark:text-slate-500 mt-2">
        {isAr
          ? 'فكروز مساعد ذكي يقدم إجابات دقيقة وتوجيهية. يُرجى مراجعة المختصين في المسائل الطبية والقانونية والمالية.'
          : 'Fakrooz may make mistakes. Verify critical facts and consult specialists for medical, legal, or financial decisions.'}
      </p>
    </div>
  );
};
