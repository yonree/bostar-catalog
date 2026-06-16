'use client';

import { useState } from 'react';
import { Markdown } from '@/components/ui/Markdown';

interface FaqItem {
  id?: string | number;
  question: string;
  answer: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="grid gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.id || faq.question} className="rounded border border-line bg-dark-soft p-5">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between text-left font-black hover:text-primary"
            >
              <span>{faq.question}</span>
              <span
                className="ml-4 shrink-0 text-xl font-normal text-steel transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
            </button>
            <div className={`faq-answer${isOpen ? ' open' : ''}`}>
              <Markdown className="leading-7 text-steel">{faq.answer}</Markdown>
            </div>
          </div>
        );
      })}
    </div>
  );
}
