import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onOpenChat: () => void;
  onOpenExport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenChat, onOpenExport }) => {
  const isAr = lang === 'ar';

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">Fakrooz</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">فكروز</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'مساعد الذكاء الاصطناعي الشامل لكل المهام والأفكار' : 'Universal AI Companion for everyone'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={onOpenChat}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {isAr ? 'بدء محادثة' : 'Chat'}
          </button>
          <button
            onClick={onOpenExport}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {isAr ? 'ملفات الكود والنشر' : 'Deploy Code'}
          </button>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Google AI Studio
          </a>
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <span>{isAr ? 'صُنع بحب' : 'Crafted with care'}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
          <span>© 2026 Fakrooz</span>
        </div>
      </div>
    </footer>
  );
};
