export type Role = 'user' | 'assistant' | 'system';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
  sources?: GroundingSource[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';

export interface PromptExample {
  id: string;
  icon: string;
  category: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  prompt: {
    ar: string;
    en: string;
  };
}
