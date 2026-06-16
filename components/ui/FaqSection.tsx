import { Markdown } from '@/components/ui/Markdown';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { FaqView } from '@/lib/cms-data';

export function FaqSection({ faqs, title = '常见问题', description }: { faqs: FaqView[]; title?: string; description?: string }) {
  if (faqs.length === 0) return null;

  return (
    <section className="section bg-industrial">
      <div className="container">
        <SectionHeader title={title} description={description} />
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id || faq.question}>
              <h3 className="text-lg font-black text-ink">{faq.question}</h3>
              <div className="mt-3 leading-7 text-steel">
                <Markdown>{faq.answer}</Markdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
