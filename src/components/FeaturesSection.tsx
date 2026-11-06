import React from 'react';
import { HelpCircle, FileText, Languages, Code2, GraduationCap, Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface FeaturesSectionProps {
  lang: Language;
  onTryFeature: (prompt: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ lang, onTryFeature }) => {
  const isAr = lang === 'ar';

  const features = [
    {
      icon: HelpCircle,
      title: isAr ? 'يجاوب على أي سؤال' : 'Answers Any Question',
      desc: isAr
        ? 'يقدم إجابات دقيقة ومنطقية في العلوم، التاريخ، الثقافة، والمسائل اليومية، مع الاعتراف بما لا يعرفه بكل أمانة.'
        : 'Provides deep, accurate, and structured answers across science, history, daily life, and reasoning.',
      prompt: isAr
        ? 'ما هي آلية عمل الحواسيب الكمومية وما الفرق بينها وبين الحواسيب التقليدية باختصار؟'
        : 'How do quantum computers work and how do they differ from classical computers in simple terms?',
      gradient: 'from-blue-500/20 to-indigo-500/20 text-blue-500',
    },
    {
      icon: FileText,
      title: isAr ? 'يكتب ويلخص باحترافية' : 'Writes & Summarizes',
      desc: isAr
        ? 'صياغة مقالات، خطابات، رسائل بريد إلكتروني، تقارير عمل، وتلخيص المقالات الطويلة في نقاط مركزة واضحة.'
        : 'Drafts emails, essays, summaries, and executive reports formatted for crystal-clear readability.',
      prompt: isAr
        ? 'لخص لي كتاب العادات الذرية (Atomic Habits) في 5 نصائح عملية يمكن تطبيقها في الحياة اليومية'
        : 'Summarize the core principles of Atomic Habits into 5 actionable rules for daily life.',
      gradient: 'from-purple-500/20 to-pink-500/20 text-purple-500',
    },
    {
      icon: Languages,
      title: isAr ? 'يترجم بدقة وفهم للسياق' : 'Context-Aware Translation',
      desc: isAr
        ? 'ترجمة فورية ونقية بين العربية والإنجليزية ومختلف اللغات مع مراعاة المصطلحات المتخصصة وروح النص.'
        : 'Nuanced translations that preserve tone, idioms, and technical terms across languages.',
      prompt: isAr
        ? 'ترجم هذه العبارة إلى 3 صيغ بالإنجليزية (رسمية، ودية، وموجزة): يسعدنا جداً انضمامكم إلى فريقنا ونتمنى لكم مسيرة موفقة'
        : 'Translate this Arabic sentence into 3 English versions (formal, casual, concise): يسعدنا جداً انضمامكم إلى فريقنا',
      gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-500',
    },
    {
      icon: Code2,
      title: isAr ? 'يساعد في البرمجة والتطوير' : 'Coding & Bug Fixing',
      desc: isAr
        ? 'كتابة أكواد نظيفة (JavaScript, Python, React, C++, SQL)، فحص الأخطاء، وشرح الخوارزميات مع زر نسخ مباشر.'
        : 'Generates clean code, discovers bug root causes, and explains algorithms with instant copy blocks.',
      prompt: isAr
        ? 'اكتب لي دالة في JavaScript/TypeScript لفلترة وترتيب مصفوفة من الكائنات حسب السعر والتقييم'
        : 'Write a TypeScript function to filter and sort an array of product objects by price and rating.',
      gradient: 'from-amber-500/20 to-orange-500/20 text-amber-500',
    },
    {
      icon: GraduationCap,
      title: isAr ? 'يشرح الدروس ويبسط العلوم' : 'Study & Concept Explanation',
      desc: isAr
        ? 'تبسيط الرياضيات، الفيزياء، الكيمياء، واللغات خطوة بخطوة بطريقة المعلم الصبور والداعم.'
        : 'Breaks down complex subjects, math problems, and academic topics step-by-step.',
      prompt: isAr
        ? 'اشرح لي مفهوم الاشتقاق والتكامل (Calculus) كأنني أتعلمه لأول مرة بأمثلة من واقع الحياة'
        : 'Explain the concept of Calculus with real-world intuitive analogies as if I am learning it for the first time.',
      gradient: 'from-sky-500/20 to-cyan-500/20 text-sky-500',
    },
    {
      icon: Lightbulb,
      title: isAr ? 'يدّي أفكار وحلول إبداعية' : 'Creative Ideas & Brainstorming',
      desc: isAr
        ? 'توليد أفكار لمشاريع، فيديوهات، قنوات يوتيوب، حملات تسويقية، وحلول مبتكرة لتحديات العمل اليومي.'
        : 'Sparks business models, content strategies, video hooks, and fresh creative approaches.',
      prompt: isAr
        ? 'اقترح لي 5 أفكار مشاريع تقنية ناشئة تعتمد على الذكاء الاصطناعي لحل مشاكل حقيقية في الشرق الأوسط'
        : 'Suggest 5 innovative tech startup ideas leveraging AI to solve real-world everyday problems.',
      gradient: 'from-rose-500/20 to-red-500/20 text-rose-500',
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          {isAr ? 'كل ما تحتاجه في مكان واحد مع فكروز' : 'Everything You Need in One Place with Fakrooz'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          {isAr
            ? 'تم تدريب فكروز وتخصيصه ليكون المساعد اليومي الشامل والأكثر فائدة وأناقة لك في دراستك وعملك وحياتك.'
            : 'Fakrooz is designed to be your universal, versatile assistant for study, career, and daily tasks.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-indigo-400/80 dark:hover:border-indigo-500/80 transition-all duration-200"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {feat.desc}
                </p>
              </div>

              <button
                onClick={() => onTryFeature(feat.prompt)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 pt-3 border-t border-slate-100 dark:border-slate-800/80 group-hover:gap-2.5 transition-all cursor-pointer"
              >
                <span>{isAr ? 'جرب هذه الميزة الآن' : 'Try this feature'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
