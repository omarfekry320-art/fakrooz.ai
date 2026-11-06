import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Server, Cloud, BookOpen, Lightbulb } from 'lucide-react';
import {
  STANDALONE_HTML,
  STANDALONE_CSS,
  STANDALONE_JS,
  VERCEL_API_CHAT,
  CLOUDFLARE_WORKER,
  DEPLOYMENT_GUIDE_AR,
} from '../lib/standaloneFiles';
import { Language } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<
    'html' | 'css' | 'js' | 'vercel' | 'cloudflare' | 'guide' | 'roadmap'
  >('guide');
  const [copied, setCopied] = useState(false);

  const FUTURE_ROADMAP = `# 💡 أفكار واقتراحات لتطوير مساعد "Fakrooz" في المستقبل

1. 🎙️ **المحادثة الصوتية المباشرة (Voice-to-Voice)**:
   - ربط فكروز بنموذج صوتي مباشر ليتحدث معك بصوته وتتحدث معه بالمايك كأنك تتكلم في الهاتف!

2. 📷 **فهم الصور والملفات (Multimodal)**:
   - إضافة زر رفع صور (حل مسائل الرياضيات من الصور، استخراج النصوص، تحليل التقارير، وتلخيص ملفات PDF).

3. 🔍 **البحث الحي في الويب (Google Search Grounding)**:
   - تمكين فكروز من الوصول لآخر الأخبار والأسعار وأحدث المعلومات بالبحث على الإنترنت.

4. 🤖 **الأدوار المخصصة (Custom Personas)**:
   - إضافة أوضاع خاصة مثل: "مبرمج محترف"، "مدرس لغة إنجليزية"، "طاهٍ خبير"، "مدرب لياقة".

5. 📱 **تطبيق موبايل (PWA / React Native)**:
   - تحويل الموقع لتطبيق هاتف مع حفظ الردود بدون إنترنت (Offline access).
`;

  const tabs = [
    { id: 'guide', label: isAr ? '📖 دليل النشر والربط' : 'Deploy Guide', icon: BookOpen },
    { id: 'html', label: 'index.html', icon: FileCode },
    { id: 'css', label: 'style.css', icon: FileCode },
    { id: 'js', label: 'script.js', icon: FileCode },
    { id: 'vercel', label: 'api/chat.js (Vercel)', icon: Server },
    { id: 'cloudflare', label: 'worker.js (Cloudflare)', icon: Cloud },
    { id: 'roadmap', label: isAr ? '🚀 أفكار للتطوير' : 'Future Roadmap', icon: Lightbulb },
  ];

  let currentContent = '';
  let currentFileName = 'code.txt';

  switch (activeTab) {
    case 'html':
      currentContent = STANDALONE_HTML;
      currentFileName = 'index.html';
      break;
    case 'css':
      currentContent = STANDALONE_CSS;
      currentFileName = 'style.css';
      break;
    case 'js':
      currentContent = STANDALONE_JS;
      currentFileName = 'script.js';
      break;
    case 'vercel':
      currentContent = VERCEL_API_CHAT;
      currentFileName = 'chat.js';
      break;
    case 'cloudflare':
      currentContent = CLOUDFLARE_WORKER;
      currentFileName = 'worker.js';
      break;
    case 'guide':
      currentContent = DEPLOYMENT_GUIDE_AR;
      currentFileName = 'DEPLOYMENT_GUIDE.md';
      break;
    case 'roadmap':
      currentContent = FUTURE_ROADMAP;
      currentFileName = 'ROADMAP.md';
      break;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl h-[88vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-500" />
              <span>{isAr ? 'ملفات كود فكروز ودليل النشر والتثبيت' : 'Fakrooz Source Files & Deploy Guide'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'ملفات HTML / CSS / JS خام وجاهزة للنشر والربط بالـ AI مع توثيق شامل'
                : 'Pure Vanilla files ready to copy or deploy to Vercel/Cloudflare'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 px-4 pt-3 overflow-x-auto border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl font-medium whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action bar for current tab */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">
            {currentFileName}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{isAr ? 'تم النسخ بنجاح!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ الكود' : 'Copy Code'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 font-medium transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'تحميل الملف' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed selection:bg-indigo-600 selection:text-white" dir="ltr">
          <pre>
            <code>{currentContent}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>{isAr ? 'جاهز للاستخدام الحر بدون أي قيود' : 'Ready for production deployment'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
