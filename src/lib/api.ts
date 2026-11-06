import { ChatMessage, GroundingSource } from '../types';

export interface SendMessageOptions {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  prompt?: string;
  signal?: AbortSignal;
  onChunk: (chunk: string, sources?: GroundingSource[]) => void;
  onError: (errorText: string) => void;
  onComplete: (sources?: GroundingSource[]) => void;
}

export async function sendChatMessageStream({
  messages,
  prompt,
  signal,
  onChunk,
  onError,
  onComplete,
}: SendMessageOptions): Promise<void> {
  let accumulatedSources: GroundingSource[] = [];
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, prompt }),
      signal,
    });

    if (!response.ok) {
      let errorMsg = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.messageAr || errorData.message || errorData.error || errorMsg;
      } catch {
        // use fallback text
      }
      onError(errorMsg);
      return;
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by browser/environment');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.error) {
              onError(parsed.message || 'حدث خطأ في معالجة الرد');
              return;
            }
            if (Array.isArray(parsed.sources)) {
              accumulatedSources = parsed.sources;
            }
            if (parsed.text) {
              onChunk(parsed.text, accumulatedSources);
            }
            if (parsed.done) {
              onComplete(accumulatedSources);
              return;
            }
          } catch {
            // Ignore non-json or partial lines
          }
        }
      }
    }

    onComplete(accumulatedSources);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // User aborted stream deliberately
      onComplete();
      return;
    }

    console.error('API Stream Exception:', err);
    // Try fallback to regular non-streaming /api/chat if stream fails
    try {
      const fallbackRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, prompt }),
        signal,
      });
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data.reply) {
          onChunk(data.reply);
          onComplete();
          return;
        }
      }
    } catch {
      // fallback also failed
    }

    const isOffline = !navigator.onLine;
    const errorMsg = isOffline
      ? 'يبدو أنك غير متصل بالإنترنت. يرجى التحقق من اتصال الشبكة.'
      : 'تعذر الاتصال بالسيرفر. يرجى التأكد من تشغيل السيرفر أو المحاولة لاحقاً.';
    onError(errorMsg);
  }
}
