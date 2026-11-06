import React from 'react';
import { MessageSquareText, Cpu, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HowItWorksProps {
  lang: Language;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const steps = [
    {
      num: '01',
      icon: MessageSquareText,
      title: isAr ? 'اكتب سؤالك أو فكرتك' : 'Type Your Question or Idea',
      desc: isAr
        ? 'بأي لغة وبأي أسلوب، اكتب ما يدور في ذهنك (سؤال، كود به عطل، نص تريد تلخيصه، أو فكرة جديدة).'
        : 'In any language or dialect, write whatever is on your mind: a question, buggy code, or an essay idea.',
    },
    {
      num: '02',
      icon: Cpu,
      title: isAr ? 'فكروز يحلل ويفكر بذكاء' : 'Fakrooz Analyzes & Reasons',
      desc: isAr
        ? 'يقوم محرك الذكاء الاصطناعي باستيعاب السياق، وتدقيق المعلومات، والتفكير في أفضل هيكل للإجابة.'
        : 'The AI engine grasps the context, verifies information, and crafts the optimal response structure.',
    },
    {
      num: '03',
      icon: CheckCircle2,
      title: isAr ? 'احصل على إجابة منسقة فوراً' : 'Get a Formatted Answer Instantly',
      desc: isAr
        ? 'تصلك الإجابة فوراً بصيغة Markdown منظمة، مع أكواد جاهزة للنسخ بنقرة واحدة، وخيارات لإعادة الصياغة.'
        : 'Receive a structured Markdown answer with one-click copyable code blocks and easy follow-ups.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            {isAr ? 'السهولة والسرعة' : 'Simple & Seamless'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4">
            {isAr ? 'إزاي بيشتغل فكروز؟ في 3 خطوات بسيطة' : 'How Fakrooz Works in 3 Easy Steps'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {isAr
              ? 'تجربة محادثة سلسلة ومباشرة لا تتطلب أي تسجيل معقد، ابدأ خلال ثانية واحدة.'
              : 'A frictionless conversation experience designed for instantaneous helpfulness.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-400 dark:text-slate-600">
                  {step.num}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-6">
                  <IconComp className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
