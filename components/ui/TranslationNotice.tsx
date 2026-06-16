export function TranslationNotice({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={`rounded-[20px] border border-amber-300/60 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900 ${className}`}>
      English technical translation is pending manual verification. Verified Chinese source content may still appear below for some products, cases, and knowledge entries.
    </div>
  );
}
