'use client';
import { useState } from 'react';

export default function EnAiPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'What equipment is suitable for aluminum profiles?',
    'DISK electrostatic disk spraying advantages',
    'Manual vs automatic powder spray gun comparison',
    'Powder coating common troubleshooting',
  ];

  const getMockResponse = (msg: string): string => {
    if (msg.toLowerCase().includes('aluminum') || msg.toLowerCase().includes('profile'))
      return 'For aluminum profile powder coating, we recommend BSD-6020 Manual Spray Gun for small batch or BSD-8010 Automatic Gun with reciprocator for mass production. Key tips: use epoxy-polyester hybrid powder for indoor, pure polyester for outdoor.\n\nPlease submit an inquiry for pricing.';
    if (msg.toLowerCase().includes('disk') || msg.toLowerCase().includes('旋碟'))
      return 'The BSD-DISK200 Electrostatic Disk Spray System suits: automotive wheel hubs, appliance shells, metal pipes, furniture, construction profiles. Key features: paint utilization ≥90%, daily capacity 100,000 pcs, PLC intelligent control.';
    return 'Thanks for your inquiry! I am the BOSTAR AI Product Advisor. Please describe your workpiece type, production volume, and coating requirements for tailored product recommendations. For pricing and custom solutions, please submit an inquiry or contact our sales team.';
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply = getMockResponse(userMsg);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">AI Product Advisor</h1>
      <p className="text-sm text-neutral-500 mb-6">Ask questions and get product recommendations powered by AI</p>

      <div className="bg-white rounded-xl border border-neutral-100 p-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2 pt-4">
            <p className="text-sm text-neutral-500 mb-3">Suggested questions:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="block w-full text-left text-sm px-3 py-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-600"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 px-4 py-2 rounded-lg flex items-center gap-1">
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Describe your needs..."
          className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-neutral-400 mt-3 text-center">AI responses are for reference only. For accurate pricing and solutions, please contact our sales team.</p>
    </div>
  );
}
