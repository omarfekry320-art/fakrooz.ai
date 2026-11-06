/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ChatSession,
  ChatMessage as ChatMessageType,
  Theme,
  Language,
} from './types';
import {
  loadSessions,
  saveSessions,
  getActiveSessionId,
  setActiveSessionId,
  loadTheme,
  saveTheme,
  loadLanguage,
  saveLanguage,
  createNewSession,
} from './lib/storage';
import { sendChatMessageStream } from './lib/api';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorks } from './components/HowItWorks';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ExportModal } from './components/ExportModal';
import { Footer } from './components/Footer';
import { PanelLeft, Sparkles, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadLanguage());
  const [theme, setTheme] = useState<Theme>(() => loadTheme());
  const [currentTab, setCurrentTab] = useState<'home' | 'chat'>('home');
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions(lang));
  const [activeSessionId, setActiveSessionIdState] = useState<string>(() => {
    const saved = getActiveSessionId();
    const existing = loadSessions(lang);
    if (saved && existing.some((s) => s.id === saved)) return saved;
    return existing[0]?.id || '';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync Theme with HTML class
  useEffect(() => {
    saveTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Sync Language and Direction
  useEffect(() => {
    saveLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Active Session ID
  useEffect(() => {
    if (activeSessionId) {
      setActiveSessionId(activeSessionId);
    }
  }, [activeSessionId]);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions);
    }
  }, [sessions]);

  // Get current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll to bottom of messages thread
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (currentTab === 'chat') {
      scrollToBottom('auto');
    }
  }, [currentTab, activeSessionId]);

  // Theme toggle handler
  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Language toggle handler
  const handleLangToggle = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Create new chat
  const handleNewChat = () => {
    const newSession = createNewSession(lang);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionIdState(newSession.id);
  };

  // Delete chat
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewSession(lang);
        setActiveSessionIdState(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionIdState(filtered[0].id);
      }
      return filtered;
    });
  };

  // Clear all chats
  const handleClearAllSessions = () => {
    const fresh = createNewSession(lang);
    setSessions([fresh]);
    setActiveSessionIdState(fresh.id);
  };

  // Start chat with prefilled prompt from Landing page
  const handleStartChatWithPrompt = (initialPrompt?: string) => {
    setCurrentTab('chat');
    if (initialPrompt) {
      setTimeout(() => {
        handleSendMessage(initialPrompt);
      }, 50);
    }
  };

  // Send message flow (with streaming SSE)
  const handleSendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim() || isLoading || !activeSession) return;

    const userMessage: ChatMessageType = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: userPrompt,
      timestamp: Date.now(),
    };

    const assistantPlaceholderId = 'ast_' + Date.now();
    const assistantMessage: ChatMessageType = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Update active session with user message and streaming assistant placeholder
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSession.id) return s;

        const updatedMessages = [...s.messages, userMessage, assistantMessage];
        let newTitle = s.title;

        // Auto generate short title if it's currently default
        if (s.messages.length <= 1) {
          newTitle = userPrompt.slice(0, 32);
        }

        return {
          ...s,
          title: newTitle,
          updatedAt: Date.now(),
          messages: updatedMessages,
        };
      })
    );

    setIsLoading(true);
    scrollToBottom();

    // Prepare history for API
    const historyPayload = activeSession.messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    historyPayload.push({ role: 'user', content: userPrompt });

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let accumulatedResponse = '';

    await sendChatMessageStream({
      messages: historyPayload,
      signal: abortController.signal,
      onChunk: (chunk: string, sources?: any) => {
        accumulatedResponse += chunk;
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSession.id) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantPlaceholderId
                  ? {
                      ...m,
                      content: accumulatedResponse,
                      isStreaming: true,
                      sources: sources || m.sources,
                    }
                  : m
              ),
            };
          })
        );
        scrollToBottom('smooth');
      },
      onError: (errorText: string) => {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSession.id) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantPlaceholderId
                  ? {
                      ...m,
                      content: errorText,
                      error: true,
                      isStreaming: false,
                    }
                  : m
              ),
            };
          })
        );
        setIsLoading(false);
      },
      onComplete: (sources?: any) => {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSession.id) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantPlaceholderId
                  ? {
                      ...m,
                      content: accumulatedResponse || (lang === 'ar' ? 'تم الرد بنجاح.' : 'Response completed.'),
                      isStreaming: false,
                      sources: sources || m.sources,
                    }
                  : m
              ),
            };
          })
        );
        setIsLoading(false);
        abortControllerRef.current = null;
      },
    });
  };

  // Stop Generation
  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSession?.id) return s;
        return {
          ...s,
          messages: s.messages.map((m) =>
            m.isStreaming ? { ...m, isStreaming: false } : m
          ),
        };
      })
    );
  };

  // Regenerate Response
  const handleRegenerateResponse = () => {
    if (!activeSession || activeSession.messages.length < 2 || isLoading) return;

    // Find last user message
    let lastUserPrompt = '';
    for (let i = activeSession.messages.length - 1; i >= 0; i--) {
      if (activeSession.messages[i].role === 'user') {
        lastUserPrompt = activeSession.messages[i].content;
        break;
      }
    }

    if (!lastUserPrompt) return;

    // Remove last assistant message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSession.id) return s;
        const lastMsg = s.messages[s.messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          return {
            ...s,
            messages: s.messages.slice(0, s.messages.length - 1),
          };
        }
        return s;
      })
    );

    // Re-send
    setTimeout(() => {
      handleSendMessage(lastUserPrompt);
    }, 50);
  };

  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        lang={lang}
        onLangToggle={handleLangToggle}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onNewChat={handleNewChat}
      />

      {/* Main View Area */}
      {currentTab === 'home' ? (
        <main className="flex-1">
          <LandingHero
            lang={lang}
            onStartChat={handleStartChatWithPrompt}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />

          <FeaturesSection
            lang={lang}
            onTryFeature={(prompt) => handleStartChatWithPrompt(prompt)}
          />

          <HowItWorks lang={lang} />

          {/* Quick Banner to Start Chat */}
          <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 text-white shadow-xl shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-indigo-200 animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                {isAr ? 'جاهز تبدأ تسأل فكروز؟' : 'Ready to talk to Fakrooz?'}
              </h2>
              <p className="max-w-xl mx-auto text-indigo-100 text-sm sm:text-base mb-6">
                {isAr
                  ? 'لا تنتظر! جرب طرح سؤال في البرمجة، أو اطلب تلخيص مقال، أو ترجمة نص فوري الآن.'
                  : 'Start asking questions, generating code, or requesting summaries right now in seconds.'}
              </p>
              <button
                onClick={() => handleStartChatWithPrompt()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-indigo-600 hover:bg-slate-100 font-bold text-base shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{isAr ? 'فتح واجهة المحادثة' : 'Open Chat Interface'}</span>
                {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </section>

          <Footer
            lang={lang}
            onOpenChat={() => setCurrentTab('chat')}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        </main>
      ) : (
        /* Chat View Mode */
        <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
          {/* Chat Sidebar */}
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSession?.id || ''}
            onSelectSession={(id) => setActiveSessionIdState(id)}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            onClearAllSessions={handleClearAllSessions}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            lang={lang}
          />

          {/* Chat Workspace */}
          <section className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden relative">
            {/* Mobile Sidebar Toggle Button */}
            <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                <PanelLeft className="w-4 h-4 text-indigo-500" />
                <span>{isAr ? 'سجل المحادثات' : 'History'}</span>
              </button>

              <span className="text-xs font-semibold text-slate-500 truncate max-w-[200px]">
                {activeSession?.title}
              </span>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto py-6 px-2 sm:px-4 space-y-4">
              {activeSession?.messages?.map((msg, idx) => {
                const isLastAssistant =
                  msg.role === 'assistant' && idx === activeSession.messages.length - 1;

                return (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isLastAssistant={isLastAssistant}
                    onRegenerate={handleRegenerateResponse}
                    lang={lang}
                  />
                );
              })}

              {/* Typing indicator bubble */}
              {isLoading && activeSession?.messages[activeSession.messages.length - 1]?.role === 'user' && (
                <div className="w-full max-w-4xl mx-auto flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 p-0.5 shadow-md shadow-indigo-500/20">
                    <div className="w-full h-full bg-slate-900/60 rounded-[10px] flex items-center justify-center text-white">
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-4 py-2.5 text-xs text-slate-500 shadow-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {isAr ? 'فكروز يفكر ويكتب' : 'Fakrooz is thinking'}
                    </span>
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dot-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dot-2" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dot-3" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onStop={handleStopGenerating}
              lang={lang}
            />
          </section>
        </div>
      )}

      {/* Export & Deploy Code Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
