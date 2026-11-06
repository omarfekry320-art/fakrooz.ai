import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles, MessageSquare, Terminal, BookOpen, PenTool, Languages, Lightbulb } from 'lucide-react';
import { Language } from '../types';

interface LandingHeroProps {
  lang: Language;
  onStartChat: (initialPrompt?: string) => void;
  onOpenExportModal: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ lang, onStartChat, onOpenExportModal }) => {
  const isAr = lang === 'ar';

  const quickPills = [
    {
      icon: Terminal,
      title: isAr ? 'كود بايثون لتحليل البيانات' : 'Python data analysis script',
      prompt: isAr
        ? 'اكتب لي كود بايثون باستخدام Pandas لقراءة ملف CSV واستخراج المتوسطات وأهم الإحصائيات'
        : 'Write a Python script using pandas to load a CSV and compute summary statistics.',
    },
    {
      icon: PenTool,
      title: isAr ? 'كتابة مقال احترافي' : 'Professional article draft',
      prompt: isAr
        ? 'اكتب لي مقالاً مشوقاً من 400 كلمة حول تأثير الذكاء الاصطناعي في التعليم والعمل المستقبلي'
        : 'Write a compelling 400-word article on the impact of AI in education and future work.',
    },
    {
      icon: BookOpen,
      title: isAr ? 'شرح نظرية النسبية ببساطة' : 'Explain Relativity simply',
      prompt: isAr
        ? 'اشرح لي نظرية النسبية لآينشتاين بأسلوب مبسط جداً يفهمه طالب في المرحلة الإعدادية'
        : 'Explain Einstein’s theory of relativity in simple terms suitable for a middle school student.',
    },
    {
      icon: Languages,
      title: isAr ? 'ترجمة وصياغة إيميل رسمي' : 'Formal email translation',
      prompt: isAr
        ? 'ترجم هذه الرسالة إلى الإنجليزية المهنية: يسعدنا التقدم بعرض الشراكة ونتطلع للاجتماع معكم'
        : 'Translate this to Arabic professionally: We are delighted to submit our partnership proposal and look forward to meeting with you.',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-sky-400/20 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 blur-2xl pointer-events-none rounded-full" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>{isAr ? 'مساعدك الذكي الشامل — إصدار 2026 فائق السرعة' : 'Your Universal AI Companion — Ultra-Fast 2026 Edition'}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.25] sm:leading-[1.2] mb-6">
          {isAr ? (
            <>
              مع <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">Fakrooz (فكروز)</span>،
              <br className="hidden sm:inline" /> أي فكرة أو سؤال في متناول يدك!
            </>
          ) : (
            <>
              With <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 bg-clip-text text-transparent">Fakrooz</span>,
              <br className="hidden sm:inline" /> every idea & question is solved instantly!
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 font-normal">
          {isAr
            ? 'مساعد ذكاء اصطناعي عربي وإنجليزي ودود وسريع؛ يجاوب على أسئلتك، يكتب ويلخص، يبرمج ويصلح الأكواد، يشرح الدروس المعقدة، ويقدم استشارات ذكية بلغة طبيعية ومنسقة.'
            : 'A friendly and articulate AI companion in Arabic & English. Answers questions, crafts writing, codes and debugs, explains tough concepts, and sparks creative ideas with formatted Markdown.'}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <button
            onClick={() => onStartChat()}
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{isAr ? 'ابدأ المحادثة الآن' : 'Start Chatting Now'}</span>
            {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>

          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-sm"
          >
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span>{isAr ? 'كود المشروع & دليل النشر' : 'Source Files & Deploy'}</span>
          </button>
        </div>

        {/* Interactive Quick Prompts Section */}
        <div className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-3.5 px-1">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {isAr ? 'اضغط لتجربة سؤال سريع مباشرة مع فكروز:' : 'Click a prompt to ask Fakrooz immediately:'}
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
              {isAr ? 'جاهز للبدء فوراً' : 'Ready instantly'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickPills.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onStartChat(item.prompt)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-start transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.prompt}
                    </div>
                  </div>
                  <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isAr ? '←' : '→'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
