import { ChatSession, ChatMessage, Theme, Language } from '../types';

const STORAGE_KEY_SESSIONS = 'fakrooz_chat_sessions_v1';
const STORAGE_KEY_ACTIVE_ID = 'fakrooz_active_session_id';
const STORAGE_KEY_THEME = 'fakrooz_theme';
const STORAGE_KEY_LANG = 'fakrooz_lang';

export function createNewSession(lang: Language = 'ar'): ChatSession {
  const id = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = Date.now();
  const initialGreeting: ChatMessage = {
    id: 'msg_welcome_' + now,
    role: 'assistant',
    content:
      lang === 'ar'
        ? `أهلاً بك! أنا **Fakrooz (فكروز)**، رفيقك ومساعدك الذكي الشامل (مثل ChatGPT مع دعم البحث الحي في الويب والمعرفة المعاصرة).\n\nأستطيع مساعدتك في كل شيء حرفياً:\n- 🌐 **مواكبة الأحداث وأحدث الأخبار:** متصل بالإنترنت للبحث الحي في الويب.\n- 💻 **البرمجة وهندسة البرمجيات:** كتابة وتصحيح وشرح الأكواد بكافة اللغات مع أمثلة عملية.\n- 💡 **إجابات موسوعية:** شرح العلوم، الرياضيات، التاريخ، والتكنولوجيا.\n- ✍️ **الكتابة والتلخيص:** مقالات، سيناريوهات، رسائل عمل، وتحليل بيانات.\n- 🌍 **الترجمة المتقنة:** ترجمة دقيقة تراعي روح وسياق النص.\n\nاسألني عن أي شيء يدور في ذهنك وسأجيبك فوراً!`
        : `Hello! I am **Fakrooz**, your comprehensive AI companion (powered like ChatGPT with real-time web search and broad modern knowledge).\n\nI can assist you with literally everything:\n- 🌐 **Current Events & Latest Facts:** Connected to real-time live web search.\n- 💻 **Coding & Software Engineering:** Writing, debugging, and explaining code in any language.\n- 💡 **Encyclopedic Knowledge:** Deep explanations across science, tech, math, and humanities.\n- ✍️ **Writing & Summarization:** Essays, business correspondence, scripts, and reports.\n- 🌍 **Nuanced Translation:** Accurate translations capturing idiom and context.\n\nAsk me about anything right now!`,
    timestamp: now,
  };

  return {
    id,
    title: lang === 'ar' ? 'محادثة جديدة' : 'New Conversation',
    createdAt: now,
    updatedAt: now,
    messages: [initialGreeting],
  };
}

export function loadSessions(defaultLang: Language = 'ar'): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      const initial = [createNewSession(defaultLang)];
      saveSessions(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [createNewSession(defaultLang)];
      saveSessions(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load sessions from localStorage:', err);
    return [createNewSession(defaultLang)];
  }
}

export function saveSessions(sessions: ChatSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to localStorage:', err);
  }
}

export function getActiveSessionId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  } catch {
    return null;
  }
}

export function setActiveSessionId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch {
    // Ignore
  }
}

export function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to dark mode for modern AI feel
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch {
    // Ignore
  }
}

export function loadLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'ar' || saved === 'en') return saved;
    return 'ar';
  } catch {
    return 'ar';
  }
}

export function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  } catch {
    // Ignore
  }
}
