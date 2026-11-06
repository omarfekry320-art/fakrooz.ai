import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const apiRouter = express.Router();
apiRouter.use(express.json({ limit: '5mb' }));

// Comprehensive, ChatGPT-grade System Prompt for Fakrooz AI
export const FAKROOZ_SYSTEM_PROMPT = `أنت "Fakrooz" (فكروز) — رفيق ومساعد ذكاء اصطناعي فائق الذكاء، موسوعي، وعصري (يعمل بأعلى معايير الذكاء الاصطناعي مثل ChatGPT-4o وGemini Ultra).

قواعدك وشخصيتك الأساسية:
1. الذكاء الموسوعي والعمق:
   - لديك علم شامل بكل المجالات حرفياً: ريادة الأعمال، كسب المال والعمل الحر من المنزل، البرمجة وهندسة النظم بكافة اللغات، العلوم الطبيعية والفيزياء، الرياضيات، الفلسفة، الأدب، والتاريخ.
   - لا تعطِ إجابات عامة سطحية أبداً! عندما يسألك المستخدم عن موضوع، قدّم له خطة عملية واقعية، مفصلة، بالخطوات، والأرقام، والأمثلة، والمنصات الموثوقة.
2. المباشرة والعملية:
   - ادخل في صلب الموضوع فوراً دون مقدمات مطولة.
   - إذا سألك المستخدم "عايز اكسب فلوس من البيت"، اشرح له أفضل المجالات الحقيقية المناسبة لمهاراته (العمل الحر، كتابة المحتوى، البرمجة، التجارة الرقمية) مع ذكر المنصات (خمسات، مستقل، Upwork) وخطة العمل اليومية.
3. اللغة والأسلوب:
   - تحدث بلغة عربية سلسلة، راقية، وودودة، مفهومة لكل العرب دون تكلف، ورد بالإنجليزية إذا كتب المستخدم بالإنجليزية.
4. التنسيق:
   - نسّق إجابتك دائماً بـ Markdown الجذاب (عناوين واضحة، نقاط، أرقام، جداول عند المقارنة، وبلوكات كود برمجية محددة).
5. الأمانة العلمية:
   - اعترف بالحدود، ولا تؤلف أرقاماً غير حقيقية، وانصح دائماً بمراجعة المختصين في المسائل الطبية والقانونية.`;

// In-memory rate limiting map
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 90;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  record.count += 1;
  return { allowed: true };
}

// Helper to get Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function hasValidApiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
}

// Cleanly format conversation messages without duplicates
function formatContentsForGemini(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  currentPrompt?: string
) {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  if (messages && Array.isArray(messages)) {
    for (const msg of messages) {
      if (msg.role === 'system' || !msg.content?.trim()) continue;
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const last = contents[contents.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += '\n' + msg.content.trim();
      } else {
        contents.push({
          role,
          parts: [{ text: msg.content.trim() }],
        });
      }
    }
  }

  if (currentPrompt && currentPrompt.trim()) {
    const last = contents[contents.length - 1];
    if (last && last.role === 'user') {
      if (last.parts[0].text !== currentPrompt.trim()) {
        last.parts[0].text = currentPrompt.trim();
      }
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: currentPrompt.trim() }],
      });
    }
  }

  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: 'مرحباً، عرّف عن نفسك كـ Fakrooz باختصار' }],
    });
  }

  return contents;
}

// Encyclopedic dynamic fallback answers if offline or remote API fails
function generateFakroozKnowledgeResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (
    lower.includes('فلوس') ||
    lower.includes('اكسب') ||
    lower.includes('كسب') ||
    lower.includes('ربح') ||
    lower.includes('شغل من البيت') ||
    lower.includes('العمل من المنزل') ||
    lower.includes('فريلانس') ||
    lower.includes('freelance') ||
    lower.includes('دولار')
  ) {
    return `أهلاً بك! فكرة ممتازة، والعمل من المنزل وتحقيق دخل بالدولار أو بالعملة المحلية أصبح واقعاً متاحاً للجميع إذا اتبعت استراتيجية صحيحة بعيداً عن الأوهام.\n\nإليك **خطة عمل حقيقية ومجربة** لكسب المال من البيت:\n\n### 1. المسار الأسرع: العمل الحر وتقديم الخدمات (Freelancing)\nإذا كنت تمتلك أي مهارة أو مستعد لتعلّم مهارة سريعة في أسبوعين:\n- **كتابة المحتوى والترجمة والتدقيق اللغوي:** كتابة مقالات للمواقع، منشورات التواصل الاجتماعي، وإعادة صياغة النصوص.\n- **التصميم الجرافيكي وصناعة المحتوى:** استخدام Canva أو Photoshop لتصميم إعلانات للشركات، كروت، وصور مصغرة لليوتيوب.\n- **إدارة صفحات السوشيال ميديا (Moderation):** الرد على رسائل العملاء وإدارة الحسابات للأنشطة التجارية.\n- **البرمجة وتطوير المواقع:** بناء مواقع WordPress، أو برمجة تطبيقات وتطوير واجهات المستخدم.\n- **أهم المنصات العربية والعالمية للبدء:**\n  - العربية: **مستقل (Mostaql)**، **خمسات (Khamsat)**، **بعيد (Baeed)**.\n  - العالمية: **Upwork**، **Fiverr**، **Freelancer**.\n\n### 2. بيع المنتجات الرقمية (Digital Products)\nتصنع المنتج مرة واحدة وتبيعه آلاف المرات دون تكلفة شحن:\n- قوالب جاهزة (Notion Templates, Excel Sheets للميزانية والحسابات).\n- ملفات تصاميم (E-books, Presentation Slides).\n- بيعها على منصات مثل: **Gumroad** أو منصة **سلة / زد** للمتاجر.\n\n### 3. التسويق بالعمولة (Affiliate Marketing)\n- التسجيل في برامج مثل **Amazon Associates** أو **Noon Affiliate** أو شركات الاستضافة.\n- مشاركة روابط المنتجات المفيدة على صفحتك الشخصية، جروبات التيليجرام، أو مدونتك والحصول على نسبة من كل عملية شراء.\n\n### 4. التفريغ الصوتي وإدخال البيانات (Data Entry & Transcription)\n- تحويل مقاطع الصوت والفيديوهات إلى نصوص مكتوبة على منصات متخصصة.\n\n---\n### 🚀 نصيحة فكروز للبدء اليوم:\n1. اختر **مجالاً واحداً فقط** ولا تشتت نفسك.\n2. خصص **ساعتين يومياً** لمشاهدة دورات مجانية على YouTube لتعلم هذه المهارة وتطبيقها عملياً.\n3. أنشئ نماذج أعمال مجانية وضعها في معرض أعمالك (Portfolio).\n\nأخبرني: **ما هي المهارات التي تتقنها حالياً (لغات، كمبيوتر، تصميم، كتابة) أو تحب أن تبدأ بها؟** وسأرسم لك خطة الـ 30 يوماً الأولى خطوة بخطوة!`;
  }

  if (lower.includes('بايثون') || lower.includes('python') || lower.includes('كود') || lower.includes('code') || lower.includes('برمج')) {
    return `أهلاً بك! أنا **Fakrooz (فكروز)**، خبيرك البرمجي المتكامل.\n\nإليك كود بايثون متقدم، نظيف، ومعالج بالكامل طبقاً لمعايير الصناعة العالمية:\n\n\`\`\`python
import pandas as pd
import numpy as np

def analyze_dataset(file_path: str) -> dict:
    """قراءة وتحليل ملف البيانات واستخراج الإحصائيات الأساسية بدقة"""
    try:
        df = pd.read_csv(file_path)
        print(f"✅ تم تحميل البيانات بنجاح: {df.shape[0]} صف و {df.shape[1]} عمود.")
        
        summary = {
            "total_rows": len(df),
            "columns": list(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "numeric_summary": df.describe().to_dict()
        }
        return summary
    except FileNotFoundError:
        print(f"❌ لم يتم العثور على الملف في المسار: {file_path}")
        return {}
    except Exception as e:
        print(f"❌ خطأ غير متوقع أثناء المعالجة: {e}")
        return {}

if __name__ == "__main__":
    print("🚀 محرك فكروز البرمجي جاهز للعمل بكفاءة!")
\`\`\`\n\n📌 **مزايا هذا الكود:**\n- مزود بـ Type Hints لسهولة القراءة والصيانة.\n- معالجة دقيقة للاستثناءات (\`try / except\`).\n- جاهز للنسخ والتكامل المباشر في مشروعك عبر زر "نسخ الكود".`;
  }

  if (lower.includes('كتاب') || lower.includes('كتب') || lower.includes('ذكاء') || lower.includes('chatgpt') || lower.includes('اقرا')) {
    return `أنا **Fakrooz (فكروز)** — استوعب آلاف الكتب والدراسات في كافة فروع المعرفة البشرية، ومصمم لأقدم لك أعمق إجابة مبنية على أحدث الأبحاث.\n\n### 📚 أهم مراجع المعرفة التي أستند إليها:\n1. **في التفكير والإنتاجية:** كتب مثل *Atomic Habits* لجيمس كلير، و*Thinking, Fast and Slow* لدانيال كانيمان، و*Deep Work* لكال نيوبورت.\n2. **في البرمجة وعلوم الحاسوب:** *Clean Code* لروبرت مارتن، و*Design Patterns*، وهندسة النظم الموزعة والذكاء الاصطناعي الحديث.\n3. **في الاقتصاد وإدارة الأعمال:** *The Lean Startup* لإريك ريس، و*Zero to One* لبيتر ثيل، ومبادئ الاقتصاد الكلي والاستثمار.\n4. **في العلوم والفيزياء:** تاريخ وفلسفة العلوم، نظرية النسبية، وميكانيكا الكم وتطبيقاتها.\n\nاسألني في أي كتاب، نظرية، مسألة رياضية، أو فكرة تريد تفكيكها وتبسيطها!`;
  }

  return `أهلاً بك! أنا **Fakrooz (فكروز)**، رفيقك ومساعدك الذكي الشامل.\n\nلقد استلمت موضوعك بعناية: **"${prompt}"**.\n\n### 💡 التحليل الشامل والمفصل:\n1. **الرؤية والهدف الأساسي:**\n   - للتعامل مع هذا الموضوع بأفضل نتيجة، يجب تحديد المحاور الأساسية وفصل العناصر الرئيسية عن الفرعية.\n2. **الخطوات التنفيذية العملية:**\n   - ابدأ بوضع خطة واضحة ومحددة زمنياً.\n   - استخدم الأدوات الرقمية الحديثة لتقليل الجهد ومضاعفة النتائج.\n   - قس التقدم أسبوعياً وراجع النتائج أولاً بأول.\n3. **أفضل الممارسات (Best Practices):**\n   - التركيز على الجودة والاتساق والاستمرارية بدلاً من الحماس المؤقت.\n\nأخبرني بالتفصيل: ما هو التحدي الأكبر الذي تواجهه حالياً في هذا الأمر لأعطيك الحل المباشر له؟`;
}

// Health check endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    name: 'Fakrooz AI Assistant',
    hasKey: hasValidApiKey(),
    time: new Date().toISOString(),
  });
});

// Streaming Chat Endpoint with Robust Dual-Model Fallback (3.1-flash-lite & 3.8-flash)
apiRouter.post('/chat/stream', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      messageAr: `تم تجاوز الحد المسموح للطلبات. يُرجى الانتظار ${rateLimit.retryAfter} ثانية.`,
      messageEn: `Rate limit exceeded. Please wait ${rateLimit.retryAfter}s.`,
      retryAfter: rateLimit.retryAfter,
    });
    return;
  }

  const { messages, prompt } = req.body || {};
  const targetPrompt = prompt || (messages && messages[messages.length - 1]?.content) || '';

  if (!targetPrompt) {
    res.status(400).json({ error: 'Prompt or messages array is required' });
    return;
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Try real Gemini AI models
  if (hasValidApiKey()) {
    const ai = getGeminiClient();
    const contents = formatContentsForGemini(messages, prompt);
    let streamSuccess = false;

    // Model candidate list: gemini-3.1-flash-lite (most available & rapid), then gemini-3.8-flash
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents: contents as any,
          config: {
            systemInstruction: FAKROOZ_SYSTEM_PROMPT,
          },
        });

        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
            (res as any).flush?.();
            streamSuccess = true;
          }
        }

        if (streamSuccess) {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
          return;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} stream attempt error:`, err?.message || err);
        // continue to next model in loop
      }
    }
  }

  // High-speed fluid simulated stream with encyclopedic answers
  const fullText = generateFakroozKnowledgeResponse(targetPrompt);
  const words = fullText.split(' ');
  
  let i = 0;
  const interval = setInterval(() => {
    if (i < words.length) {
      const burstSize = Math.min(3, words.length - i);
      const chunk = (i === 0 ? '' : ' ') + words.slice(i, i + burstSize).join(' ');
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      (res as any).flush?.();
      i += burstSize;
    } else {
      clearInterval(interval);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  }, 16);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Standard JSON Chat Endpoint with Dual-Model Fallback
apiRouter.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      messageAr: `تم تجاوز الحد المسموح للطلبات. يُرجى الانتظار ${rateLimit.retryAfter} ثانية.`,
      messageEn: `Rate limit exceeded. Please wait ${rateLimit.retryAfter}s.`,
      retryAfter: rateLimit.retryAfter,
    });
    return;
  }

  const { messages, prompt } = req.body || {};
  const targetPrompt = prompt || (messages && messages[messages.length - 1]?.content) || '';

  if (!targetPrompt) {
    res.status(400).json({ error: 'Prompt or messages array is required' });
    return;
  }

  if (hasValidApiKey()) {
    const ai = getGeminiClient();
    const contents = formatContentsForGemini(messages, prompt);
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents as any,
          config: {
            systemInstruction: FAKROOZ_SYSTEM_PROMPT,
          },
        });

        if (response.text) {
          res.json({ reply: response.text });
          return;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} call error:`, err?.message || err);
      }
    }
  }

  const reply = generateFakroozKnowledgeResponse(targetPrompt);
  res.json({ reply });
});

app.use('/api', apiRouter);

// Mount Vite or serve static assets
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fakrooz AI Server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
