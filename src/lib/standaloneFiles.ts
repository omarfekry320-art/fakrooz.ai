// Standalone files requested by the user: Vanilla HTML, CSS, JS, Vercel Function & Cloudflare Worker

export const STANDALONE_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fakrooz | فكروز - المساعد الذكي لكل مهامك</title>
  <!-- Google Fonts: Cairo -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <!-- Marked.js for Markdown parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="dark-theme">
  <!-- Header / Navbar -->
  <header class="app-header">
    <div class="header-container">
      <div class="brand">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 3 3v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-5a3 3 0 0 1 3-3V6a4 4 0 0 1 4-4z"/>
            <circle cx="9" cy="11" r="1" fill="currentColor"/>
            <circle cx="15" cy="11" r="1" fill="currentColor"/>
            <path d="M10 15h4"/>
            <path d="M12 2v2"/>
          </svg>
        </div>
        <div>
          <h1 class="brand-name">Fakrooz <span>فكروز</span></h1>
          <p class="brand-tagline">رفيقك الذكي لكل فكرة ومهمة</p>
        </div>
      </div>
      <div class="header-actions">
        <button id="themeToggleBtn" class="action-btn" title="تبديل الوضع الليلي / الفاتح">🌙</button>
        <button id="langToggleBtn" class="action-btn" title="تبديل اللغة">EN</button>
        <button id="newChatTopBtn" class="action-btn btn-primary">+ محادثة جديدة</button>
      </div>
    </div>
  </header>

  <!-- Main Container: Sidebar + Chat Area -->
  <div class="main-layout">
    <!-- Sidebar for Chat History -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <button id="newChatSidebarBtn" class="new-chat-btn">
          <span>+</span> محادثة جديدة
        </button>
      </div>
      <div class="history-list" id="historyList">
        <!-- Sessions rendered dynamically -->
      </div>
      <div class="sidebar-footer">
        <button id="clearAllBtn" class="clear-all-btn">🗑️ مسح كل المحادثات</button>
      </div>
    </aside>

    <!-- Chat Container -->
    <main class="chat-container">
      <!-- Quick Prompt Suggestions (shown when chat is new) -->
      <div class="quick-prompts-banner" id="quickPromptsBanner">
        <p class="suggestions-title">💡 أمثلة يمكنك البدء بها فوراً:</p>
        <div class="prompt-chips">
          <button class="chip-btn" data-prompt="اشرح لي كيف تعمل الحوسبة السحابية ببساطة">☁️ شرح الحوسبة السحابية</button>
          <button class="chip-btn" data-prompt="اكتب لي خطة عمل أسبوعية لزيادة الإنتاجية">📅 خطة تنظيم أسبوعية</button>
          <button class="chip-btn" data-prompt="كيف أبدأ بتعلم لغة بايثون من الصفر كلياً؟">🐍 تعلم بايثون من الصفر</button>
          <button class="chip-btn" data-prompt="ترجم هذه الرسالة إلى الإنجليزية باحترافية: نحن متحمسون للتعاون معكم في المشروع الجديد">🌍 ترجمة إيميل رسمي</button>
        </div>
      </div>

      <!-- Messages Thread -->
      <div class="messages-thread" id="messagesThread">
        <!-- Messages rendered by script.js -->
      </div>

      <!-- Typing Indicator -->
      <div class="typing-indicator" id="typingIndicator" style="display: none;">
        <div class="avatar-small">🤖</div>
        <div class="typing-bubble">
          <span>فكروز يكتب</span>
          <div class="dots">
            <span></span><span></span><span></span>
          </div>
        </div>
        <button id="stopBtn" class="stop-btn">⏹️ إيقاف الرد</button>
      </div>

      <!-- Input Bar -->
      <div class="chat-input-bar">
        <form id="chatForm" class="input-form">
          <textarea
            id="messageInput"
            rows="1"
            placeholder="اكتب سؤالك، كودك، أو فكرتك لفكروز... (Enter للإرسال، Shift+Enter لسطر جديد)"
            autocomplete="off"
          ></textarea>
          <button type="submit" id="sendBtn" class="send-btn" disabled title="إرسال">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13"/>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </form>
        <p class="input-footnote">فكروز مساعد ذكي يقدم إجابات مفيدة. استشر متخصصاً في المسائل الحساسة.</p>
      </div>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

export const STANDALONE_CSS = `/* ========================================================
   Fakrooz AI Assistant - Pure CSS
   Supports Dark & Light Themes, Responsive Mobile & Desktop
   ======================================================== */

:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-surface: #1e293b;
  --border-color: #334155;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent-primary: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6);
  --user-bubble-bg: linear-gradient(135deg, #4f46e5, #7c3aed);
  --ai-bubble-bg: #1e293b;
  --code-bg: #0b0f19;
  --radius-lg: 16px;
  --radius-md: 10px;
  --font-family: 'Cairo', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body.light-theme {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-surface: #ffffff;
  --border-color: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --user-bubble-bg: linear-gradient(135deg, #4f46e5, #6366f1);
  --ai-bubble-bg: #ffffff;
  --code-bg: #1e293b;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--bg-primary);
  color: var(--text-main);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background-color 0.25s ease, color 0.25s ease;
}

/* Header */
.app-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 1.25rem;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand-name span {
  font-size: 0.95rem;
  color: var(--accent-primary);
  margin-inline-start: 4px;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--accent-gradient);
  color: #ffffff;
  border: none;
}

/* Layout */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: var(--bg-surface);
  border-inline-end: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.new-chat-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
  transition: opacity 0.2s;
}

.new-chat-btn:hover {
  opacity: 0.92;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-main);
  cursor: pointer;
  border: 1px solid transparent;
  font-size: 0.88rem;
  transition: all 0.2s;
  text-align: start;
}

.history-item:hover,
.history-item.active {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

.history-item .delete-chat {
  opacity: 0;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
}

.history-item:hover .delete-chat {
  opacity: 1;
}

.clear-all-btn {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1px dashed var(--border-color);
  color: var(--text-muted);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  color: #ef4444;
  border-color: #ef4444;
}

/* Chat Main */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.quick-prompts-banner {
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.suggestions-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--accent-primary);
}

.prompt-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip-btn {
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  font-size: 0.8rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.chip-btn:hover {
  border-color: var(--accent-primary);
  background: rgba(139, 92, 246, 0.1);
}

.messages-thread {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Message Bubble */
.message-row {
  display: flex;
  gap: 0.85rem;
  max-width: 850px;
  width: 100%;
  margin: 0 auto;
}

.message-row.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.user .msg-avatar {
  background: #3b82f6;
  color: white;
}

.assistant .msg-avatar {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
}

.msg-body {
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.msg-content {
  padding: 0.9rem 1.2rem;
  border-radius: var(--radius-lg);
  line-height: 1.7;
  font-size: 0.95rem;
  word-break: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user .msg-content {
  background: var(--user-bubble-bg);
  color: white;
  border-bottom-left-radius: 4px;
}

.assistant .msg-content {
  background: var(--ai-bubble-bg);
  border: 1px solid var(--border-color);
  border-bottom-right-radius: 4px;
}

/* Code Blocks & Copy Button */
.code-block-wrapper {
  margin: 0.75rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #334155;
  background: var(--code-bg);
  direction: ltr;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.75rem;
  background: #1e293b;
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: var(--font-mono);
}

.copy-code-btn {
  background: #334155;
  color: #e2e8f0;
  border: none;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.72rem;
}

.code-block-wrapper pre {
  padding: 0.75rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: #e2e8f0;
}

/* Message Actions */
.msg-actions {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.msg-action-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s;
}

.msg-action-btn:hover {
  color: var(--accent-primary);
  background: var(--bg-secondary);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 850px;
  width: 100%;
  margin: 0 auto 0.75rem auto;
  padding: 0 1.5rem;
}

.avatar-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.typing-bubble {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.dots span {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: var(--accent-primary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dots span:nth-child(1) { animation-delay: -0.32s; }
.dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.stop-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.78rem;
  cursor: pointer;
  font-family: inherit;
}

/* Chat Input Bar */
.chat-input-bar {
  padding: 1rem 1.5rem 1.25rem 1.5rem;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
}

.input-form {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  gap: 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.5rem 0.75rem;
  align-items: flex-end;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.input-form:focus-within {
  border-color: var(--accent-primary);
}

textarea#messageInput {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  max-height: 160px;
  padding: 0.4rem 0.2rem;
  line-height: 1.5;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-gradient);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.send-btn svg {
  width: 18px;
  height: 18px;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.input-footnote {
  text-align: center;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
`;

export const STANDALONE_JS = `/**
 * Fakrooz AI - Pure Vanilla JavaScript Controller
 * Interacts with /api/chat or Serverless Backend
 */

// App State
let sessions = JSON.parse(localStorage.getItem('fakrooz_sessions') || '[]');
let currentSessionId = localStorage.getItem('fakrooz_active_id') || null;
let currentLanguage = localStorage.getItem('fakrooz_lang') || 'ar';
let isDark = localStorage.getItem('fakrooz_theme') !== 'light';
let abortController = null;

// DOM Elements
const messagesThread = document.getElementById('messagesThread');
const messageInput = document.getElementById('messageInput');
const chatForm = document.getElementById('chatForm');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const stopBtn = document.getElementById('stopBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const langToggleBtn = document.getElementById('langToggleBtn');
const historyList = document.getElementById('historyList');
const newChatSidebarBtn = document.getElementById('newChatSidebarBtn');
const newChatTopBtn = document.getElementById('newChatTopBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const quickPromptsBanner = document.getElementById('quickPromptsBanner');

// Initialize
function init() {
  applyTheme();
  applyLanguage();

  if (!sessions.length) {
    createNewChat();
  } else {
    if (!currentSessionId || !sessions.find(s => s.id === currentSessionId)) {
      currentSessionId = sessions[0].id;
    }
    renderHistory();
    renderCurrentSession();
  }

  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('fakrooz_theme', isDark ? 'dark' : 'light');
    applyTheme();
  });

  // Language Toggle
  langToggleBtn.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    localStorage.setItem('fakrooz_lang', currentLanguage);
    applyLanguage();
  });

  // New Chat
  newChatSidebarBtn.addEventListener('click', createNewChat);
  newChatTopBtn.addEventListener('click', createNewChat);

  // Clear All
  clearAllBtn.addEventListener('click', () => {
    if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من مسح جميع المحادثات؟' : 'Are you sure you want to clear all chats?')) {
      sessions = [];
      localStorage.removeItem('fakrooz_sessions');
      createNewChat();
    }
  });

  // Auto-resize textarea & enable send
  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 160) + 'px';
    sendBtn.disabled = !messageInput.value.trim();
  });

  // Enter to send, Shift+Enter for new line
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.value.trim() && !sendBtn.disabled) {
        handleSendMessage(messageInput.value.trim());
      }
    }
  });

  // Form submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (text) {
      handleSendMessage(text);
    }
  });

  // Stop button
  stopBtn.addEventListener('click', () => {
    if (abortController) {
      abortController.abort();
      hideTyping();
    }
  });

  // Quick prompt chips
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) {
        handleSendMessage(prompt);
      }
    });
  });
}

function applyTheme() {
  if (isDark) {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    themeToggleBtn.textContent = '🌙';
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    themeToggleBtn.textContent = '☀️';
  }
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  langToggleBtn.textContent = currentLanguage === 'ar' ? 'EN' : 'عربي';
}

function createNewChat() {
  const newSession = {
    id: 'chat_' + Date.now(),
    title: currentLanguage === 'ar' ? 'محادثة جديدة' : 'New Chat',
    messages: [
      {
        role: 'assistant',
        content: currentLanguage === 'ar'
          ? 'مرحباً! أنا **فكروز (Fakrooz)**، رفيقك ومساعدك الذكي. اكتب لي أي سؤال أو اطلب مني كتابة، برمجة، ترجمة، أو تلخيص، وسأساعدك فوراً!'
          : 'Hello! I am **Fakrooz**, your AI companion. Ask me any question, or request writing, coding, translation, or study help!',
        timestamp: Date.now()
      }
    ]
  };
  sessions.unshift(newSession);
  currentSessionId = newSession.id;
  saveData();
  renderHistory();
  renderCurrentSession();
}

function renderHistory() {
  historyList.innerHTML = '';
  sessions.forEach(session => {
    const item = document.createElement('div');
    item.className = 'history-item' + (session.id === currentSessionId ? ' active' : '');
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = session.title;
    titleSpan.style.overflow = 'hidden';
    titleSpan.style.textOverflow = 'ellipsis';
    titleSpan.style.whiteSpace = 'nowrap';
    titleSpan.style.maxWidth = '180px';
    
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-chat';
    delBtn.innerHTML = '✕';
    delBtn.title = 'حذف';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteSession(session.id);
    };

    item.appendChild(titleSpan);
    item.appendChild(delBtn);

    item.onclick = () => {
      currentSessionId = session.id;
      saveData();
      renderHistory();
      renderCurrentSession();
    };

    historyList.appendChild(item);
  });
}

function deleteSession(id) {
  sessions = sessions.filter(s => s.id !== id);
  if (!sessions.length) {
    createNewChat();
  } else {
    if (currentSessionId === id) {
      currentSessionId = sessions[0].id;
    }
    saveData();
    renderHistory();
    renderCurrentSession();
  }
}

function renderCurrentSession() {
  const session = sessions.find(s => s.id === currentSessionId);
  if (!session) return;

  messagesThread.innerHTML = '';

  // Show or hide quick prompts banner
  if (session.messages.length <= 1) {
    quickPromptsBanner.style.display = 'block';
  } else {
    quickPromptsBanner.style.display = 'none';
  }

  session.messages.forEach((msg, idx) => {
    appendMessageToUI(msg, idx);
  });

  scrollToBottom();
}

function appendMessageToUI(msg, idx) {
  const row = document.createElement('div');
  row.className = 'message-row ' + msg.role;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = msg.role === 'user' ? '👤' : '⚡';

  const body = document.createElement('div');
  body.className = 'msg-body';

  const content = document.createElement('div');
  content.className = 'msg-content';

  // Parse markdown if Marked is available
  if (window.marked) {
    content.innerHTML = marked.parse(msg.content);
  } else {
    content.textContent = msg.content;
  }

  // Detect code blocks and inject copy button
  content.querySelectorAll('pre code').forEach(codeEl => {
    const pre = codeEl.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = '<span>CODE</span>';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.textContent = 'نسخ الكود';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(codeEl.textContent);
      copyBtn.textContent = 'تم النسخ! ✓';
      setTimeout(() => copyBtn.textContent = 'نسخ الكود', 2000);
    };

    header.appendChild(copyBtn);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  });

  const actions = document.createElement('div');
  actions.className = 'msg-actions';

  const copyMsgBtn = document.createElement('button');
  copyMsgBtn.className = 'msg-action-btn';
  copyMsgBtn.textContent = '📋 نسخ';
  copyMsgBtn.onclick = () => {
    navigator.clipboard.writeText(msg.content);
    copyMsgBtn.textContent = 'تم النسخ ✓';
    setTimeout(() => copyMsgBtn.textContent = '📋 نسخ', 2000);
  };
  actions.appendChild(copyMsgBtn);

  body.appendChild(content);
  body.appendChild(actions);

  row.appendChild(avatar);
  row.appendChild(body);

  messagesThread.appendChild(row);
}

// Send Message Flow
async function handleSendMessage(text) {
  const session = sessions.find(s => s.id === currentSessionId);
  if (!session) return;

  // Add User Message
  session.messages.push({
    role: 'user',
    content: text,
    timestamp: Date.now()
  });

  // Update title if it was default
  if (session.messages.length === 2) {
    session.title = text.slice(0, 30);
  }

  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendBtn.disabled = true;

  saveData();
  renderHistory();
  renderCurrentSession();
  showTyping();

  // Call Backend API
  abortController = new AbortController();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: session.messages.map(m => ({ role: m.role, content: m.content })),
        prompt: text
      }),
      signal: abortController.signal
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || ('Server error: ' + response.status));
    }

    const data = await response.json();
    const reply = data.reply || 'لم يتم استلام رد صالح من المساعد.';

    session.messages.push({
      role: 'assistant',
      content: reply,
      timestamp: Date.now()
    });
  } catch (error) {
    if (error.name !== 'AbortError') {
      session.messages.push({
        role: 'assistant',
        content: '⚠️ حدث خطأ: ' + error.message,
        timestamp: Date.now()
      });
    }
  } finally {
    hideTyping();
    abortController = null;
    saveData();
    renderCurrentSession();
  }
}

function showTyping() {
  typingIndicator.style.display = 'flex';
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.style.display = 'none';
}

function scrollToBottom() {
  messagesThread.scrollTop = messagesThread.scrollHeight;
}

function saveData() {
  localStorage.setItem('fakrooz_sessions', JSON.stringify(sessions));
  localStorage.setItem('fakrooz_active_id', currentSessionId);
}

// Run on load
document.addEventListener('DOMContentLoaded', init);
`;

export const VERCEL_API_CHAT = `// api/chat.js (Vercel Serverless Function)
// Node.js runtime with @google/genai SDK

import { GoogleGenAI } from '@google/genai';

const FAKROOZ_SYSTEM_PROMPT = \`أنت "Fakrooz" (فكروز) — رفيق ومساعد ذكاء اصطناعي فائق الذكاء، ودود، محترم، وواضح.
1. رد بنفس لغة المستخدم (عربي/إنجليزي)، وبلهجة مهذبة ومفهومة.
2. ساعد في أي شيء: أسئلة، كتابة، برمجة، ترجمة، شرح وتلخيص.
3. اعترف بما لا تعرفه ولا تختلق معلومات.
4. ارفض بأدب أي طلب ضار أو غير قانوني.
5. في المواضيع الطبية والقانونية والمالية قدّم توجيهات عامة وانصح بمراجعة مختص.\`;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is missing in environment variables on Vercel.'
    });
  }

  const { messages, prompt } = req.body || {};

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });

    // Format chat contents
    const contents = [];
    if (Array.isArray(messages)) {
      for (const m of messages) {
        if (m.role === 'system') continue;
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || '' }]
        });
      }
    }
    if (prompt && (!messages || !messages.length)) {
      contents.push({ role: 'user', parts: [{ text: prompt }] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: FAKROOZ_SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
      }
    });

    // Extract live web sources if available
    const sources = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(groundingChunks)) {
      for (const gc of groundingChunks) {
        if (gc.web?.uri && gc.web?.title) {
          sources.push({ title: gc.web.title, url: gc.web.uri });
        }
      }
    }

    return res.status(200).json({ reply: response.text || '', sources });
  } catch (error) {
    console.error('Vercel API Error:', error);
    return res.status(500).json({
      error: 'Generation failed',
      message: error.message || 'Error communicating with AI service'
    });
  }
}
`;

export const CLOUDFLARE_WORKER = `// worker.js (Cloudflare Workers)
// Direct call to Gemini REST API with GEMINI_API_KEY secret

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured in worker secrets' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const messages = body.messages || [];
      const prompt = body.prompt;

      const contents = [];
      for (const m of messages) {
        if (m.role === 'system') continue;
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || '' }]
        });
      }
      if (prompt && !messages.length) {
        contents.push({ role: 'user', parts: [{ text: prompt }] });
      }

      const geminiUrl = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`;

      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{
              text: 'أنت Fakrooz (فكروز) مساعد ذكي ودود ومحترم. ساعد في أي شيء ورد بنفس لغة المستخدم.'
            }]
          }
        })
      });

      const geminiData = await geminiRes.json();
      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return new Response(JSON.stringify({ reply: text }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
`;

export const DEPLOYMENT_GUIDE_AR = `# 🚀 دليل نشر وتثبيت فكروز (Fakrooz AI) خطوة بخطوة

مرحباً بك! هذا الدليل يوضح لك كيف تنشر موقع ومساعد فكروز مجاناً في 5 دقائق مع ربطه بالـ AI.

---

## 🔑 أولاً: الحصول على مفتاح Gemini API المجاني
1. ادخل على **[Google AI Studio](https://aistudio.google.com/)**.
2. اضغط على **"Get API key"** ثم **"Create API key"**.
3. انسخ المفتاح واحتفظ به في مكان آمن (مثل: \`AIzaSy...\`).

---

## ⚡ الطريقة الأولى: النشر السريع على Vercel (موصى بها)
1. أنشئ مجلداً جديداً على جهازك باسم \`fakrooz\`.
2. ضع فيه الملفات التالية:
   - \`index.html\`
   - \`style.css\`
   - \`script.js\`
   - وأنشئ مجلداً باسم \`api\` وضع بداخله ملف \`chat.js\` (انسخ كود Vercel Serverless Function أعلاه).
   - وأنشئ ملف \`package.json\` فيه:
     \`\`\`json
     {
       "dependencies": {
         "@google/genai": "^2.4.0"
       }
     }
     \`\`\`
3. ارفع المشروع إلى حسابك على **GitHub**.
4. افتح **[Vercel.com](https://vercel.com)** وسجل دخول بحساب GitHub.
5. اضغط **"Add New Project"** واختر مستودع فكروز.
6. في قسم **Environment Variables** (المتغيرات البيئية):
   - Key: \`GEMINI_API_KEY\`
   - Value: (الصق مفتاحك الخاص)
7. اضغط **Deploy**. في أقل من دقيقة ستحصل على رابط عالمي سريع للموقع!

---

## 🌩️ الطريقة الثانية: النشر على Cloudflare Pages & Workers
1. ارفع ملفات الواجهة (\`index.html\`, \`style.css\`, \`script.js\`) على **Cloudflare Pages**.
2. أنشئ Worker من لوحة تحكم Cloudflare والصق كود \`worker.js\`.
3. ادخل على **Worker Settings > Variables** وأضف Secret باسم \`GEMINI_API_KEY\`.
4. في ملف \`script.js\`، حدد رابط الـ Worker في دالة الـ fetch بدلاً من \`/api/chat\`.

---

## 💻 التشغيل محلياً على جهازك (Node.js)
1. افتح موجه الأوامر (Terminal) في مجلد المشروع.
2. ثبت الحزم: \`npm install\`
3. أنشئ ملف \`.env\` واكتب بداخله:
   \`\`\`
   GEMINI_API_KEY=مفتاحك_هنا
   PORT=3000
   \`\`\`
4. شغّل المشروع: \`npm run dev\`
5. افتح المتصفح على: \`http://localhost:3000\`.

🎉 مبروك! موقعك جاهز وذكي ويعمل بكامل طاقته.
`;
