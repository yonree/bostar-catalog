export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  headingLevel = 'h2',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  headingLevel?: 'h1' | 'h2';
}) {
  const HeadingTag = headingLevel;

  return (
    <div className={`mb-12 max-w-4xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      ) : null}
      <HeadingTag className="text-4xl font-black leading-[1.08] text-ink md:text-5xl">{title}</HeadingTag>
      {description ? (
        <p className="mt-5 max-w-3xl text-base leading-8 text-steel">{description}</p>
      ) : null}
    </div>
  );
}
