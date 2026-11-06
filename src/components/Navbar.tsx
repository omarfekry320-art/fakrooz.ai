import React from 'react';
import { Bot, Moon, Sun, Globe, MessageSquare, Home, Code2, Sparkles } from 'lucide-react';
import { Theme, Language } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'chat';
  onTabChange: (tab: 'home' | 'chat') => void;
  theme: Theme;
  onThemeToggle: () => void;
  lang: Language;
  onLangToggle: () => void;
  onOpenExportModal: () => void;
  onNewChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  theme,
  onThemeToggle,
  lang,
  onLangToggle,
  onOpenExportModal,
  onNewChat,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-900/40 rounded-[10px] flex items-center justify-center text-white backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 dark:from-indigo-400 dark:via-purple-300 dark:to-sky-400 bg-clip-text text-transparent">
                Fakrooz
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                فكروز
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:inline">
              {isAr ? 'رفيقك الذكي لكل مهمة وفكرة' : 'Your intelligent companion'}
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'home'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>
          <button
            onClick={() => onTabChange('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'chat'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isAr ? 'الدردشة' : 'Chat'}</span>
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Export Code & Setup Guide Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-all"
            title={isAr ? 'كود المشروع ودليل النشر' : 'Project Code & Deployment Guide'}
          >
            <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">{isAr ? 'ملفات المشروع والنشر' : 'Code & Deploy'}</span>
          </button>

          {/* New Chat Button (visible in chat mode or mobile) */}
          <button
            onClick={() => {
              onNewChat();
              if (currentTab !== 'chat') onTabChange('chat');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>{isAr ? '+ محادثة جديدة' : '+ New Chat'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onLangToggle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors text-xs font-semibold"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors"
            title={theme === 'dark' ? (isAr ? 'تفعيل الوضع الفاتح' : 'Light Mode') : (isAr ? 'تفعيل الوضع الليلي' : 'Dark Mode')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
