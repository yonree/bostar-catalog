'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: { id: string; name: string; slug: string; mainImage?: string; tagline?: string }[];
}

const suggestions = [
  '铝合金门窗喷粉推荐什么设备？',
  '粉末静电喷枪和液体静电喷枪有什么区别？',
  'DISK旋碟系统适合什么产品涂装？',
  '如何选择粉末喷枪的喷嘴？',
  '静电旋杯的优势是什么？',
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是BOSTAR AI产品顾问。我可以帮您解答产品选型、技术参数、使用维护等问题。请问有什么可以帮您的？\n\n涉及报价、定制方案、复杂工况时，建议联系人工技术人员获取更准确的建议。',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: 'zh',
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.reply,
          recommendations: data.data.recommendations?.products,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Use mock response when AI is not configured
        const mockMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getMockResponse(text),
        };
        setMessages((prev) => [...prev, mockMsg]);
      }
    } catch {
      const mockMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(text),
      };
      setMessages((prev) => [...prev, mockMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-14rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-neutral-800">AI产品顾问</h1>
        <p className="text-sm text-neutral-500 mt-1">基于博士达知识库，回答产品选型、技术参数、使用维护等问题</p>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-xs text-neutral-400 mb-2">推荐问题</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-sm bg-white border border-neutral-200 px-3 py-1.5 rounded-full hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-neutral-100 text-neutral-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 mb-2">为您推荐以下产品</p>
                  <div className="space-y-2">
                    {msg.recommendations.map((rec) => (
                      <a
                        key={rec.id}
                        href={`/products/${rec.slug}`}
                        className="flex items-center gap-2 p-2 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                      >
                        {rec.mainImage && (
                          <img src={rec.mainImage} alt={rec.name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <p className="text-xs font-medium text-brand-700">{rec.name}</p>
                          {rec.tagline && <p className="text-xs text-neutral-400">{rec.tagline}</p>}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-neutral-100 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-skeleton" />
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-skeleton" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-skeleton" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="输入您的问题..."
          className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <Button onClick={() => sendMessage(input)} loading={loading} className="shrink-0">
          发送
        </Button>
      </div>

      <p className="text-xs text-neutral-400 text-center mt-3">
        AI建议仅供参考，涉及报价、定制方案、复杂工况请咨询人工技术人员
      </p>
    </div>
  );
}

function getMockResponse(text: string): string {
  if (text.includes('铝合金') || text.includes('门窗')) {
    return '对于铝合金门窗的粉末喷涂，建议使用BSD-6020手动粉末静电喷枪或BSD-8010自动粉末静电喷枪（配往复机）。\n\n关键选型建议：\n1. 小批量、多品种 → BSD-6020手动款\n2. 大批量、单一品种 → BSD-8010自动款配往复机\n3. 建议使用环氧聚酯混合粉，户外推荐纯聚酯粉\n\n如需具体报价和方案，请提交询盘或联系我们的人工技术人员。';
  }
  if (text.includes('区别') || text.includes('粉末') && text.includes('液体')) {
    return '粉末静电喷涂和液体静电喷涂的主要区别：\n\n1. 涂料形态：粉末为固态粉末，液体为溶剂型/水性涂料\n2. 固化方式：粉末需高温烘烤固化，液体可自干或烘干\n3. 涂层厚度：粉末一般60-120μm，液体一般15-40μm\n4. 外观效果：液体可达镜面级，粉末常规是半哑光\n5. 环保：粉末无VOC排放，液体需处理废气\n\n具体选型需根据工件材质、使用环境、产能要求等因素综合评估。';
  }
  if (text.includes('DISK') || text.includes('旋碟')) {
    return 'BSD-DISK200静电旋碟喷涂系统适合以下产品的自动涂装：\n\n1. 汽车轮毂\n2. 家电外壳\n3. 金属管件\n4. 金属家具\n5. 建材型材\n\n核心优势：\n- 涂料利用率≥90%\n- 日产能可达10万件\n- PLC智能控制，无人化操作\n- 模块化设计，扩展灵活\n\n如需了解具体配置和方案，请联系我们的人工技术人员获取定制方案。';
  }
  return '感谢您的咨询！我是BOSTAR AI产品顾问，可以帮您解答：\n\n- 产品选型建议\n- 技术参数对比\n- 使用维护指南\n- 设备故障排查\n\n请具体描述您的需求（如喷涂工件类型、产能要求、涂料类型等），我会为您推荐合适的产品方案。\n\n如需报价和定制方案，请提交询盘或联系人工技术人员。';
}
