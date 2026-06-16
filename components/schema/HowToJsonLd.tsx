import { JsonLd } from '@/components/schema/JsonLd';

export function HowToJsonLd({ name, steps }: { name: string; steps: string[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        step: steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text: step,
        })),
      }}
    />
  );
}
