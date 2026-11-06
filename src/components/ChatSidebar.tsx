import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, X, Download, Search, AlertTriangle } from 'lucide-react';
import { ChatSession, Language } from '../types';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions: () => void;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAllSessions,
  isOpen,
  onClose,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportSession = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    let text = `# ${session.title}\n`;
    text += `Date: ${new Date(session.createdAt).toLocaleString()}\n\n---\n\n`;
    session.messages.forEach((m) => {
      text += `### ${m.role === 'user' ? 'User' : 'Fakrooz'}:\n${m.content}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fakrooz_chat_${session.id}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static top-0 bottom-0 z-50 w-72 sm:w-80 flex flex-col bg-slate-50 dark:bg-slate-900/95 border-e border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : isAr ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'محادثة جديدة' : 'New Chat'}</span>
          </button>

          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        {sessions.length > 3 && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث في المحادثات...' : 'Search chats...'}
                className="w-full text-xs ps-8 pe-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1 uppercase tracking-wider">
            {isAr ? 'سجل المحادثات' : 'Chat History'} ({sessions.length})
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
              {searchQuery ? (isAr ? 'لا توجد نتائج مطابقة' : 'No matches found') : (isAr ? 'لا توجد محادثات سابقة' : 'No chats yet')}
            </div>
          ) : (
            filteredSessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1 pe-2">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span className="truncate">{s.title || (isAr ? 'محادثة بدون عنوان' : 'Untitled Chat')}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleExportSession(s, e)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title={isAr ? 'تصدير المحادثة (Markdown)' : 'Export chat as Markdown'}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(s.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        title={isAr ? 'حذف المحادثة' : 'Delete chat'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Clear All */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
          {showClearConfirm ? (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs">
              <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{isAr ? 'تأكيد مسح كافة المحادثات؟' : 'Clear all chats?'}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    onClearAllSessions();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-center"
                >
                  {isAr ? 'نعم، امسح' : 'Yes, clear'}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="py-1 px-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={sessions.length <= 1 && sessions[0]?.messages?.length <= 1}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-400 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'مسح كل سجل المحادثات' : 'Clear all conversations'}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
