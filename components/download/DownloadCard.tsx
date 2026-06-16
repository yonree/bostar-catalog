import type { DownloadView } from '@/lib/cms-data';
import { LocalizedLink } from '@/components/routing/LocalizedLink';

const fileTypeLabel: Record<string, string> = {
  PDF: 'PDF',
  Manual: 'Manual',
  Catalog: 'Catalog',
  Datasheet: 'Datasheet',
};

export function DownloadCard({ download }: { download: DownloadView }) {
  const label = fileTypeLabel[download.fileType] || download.fileType;

  return (
    <LocalizedLink
      href={`/downloads/${download.slug}`}
      className="card-hover group flex items-start gap-4 rounded-[24px] border border-line bg-white p-6 shadow-card"
    >
      <span className="shrink-0 rounded-full bg-primary-light px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        {label}
      </span>
      <div className="min-w-0">
        <h3 className="font-bold text-ink transition-colors group-hover:text-primary">{download.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-steel">{download.summary}</p>
        {download.version ? <p className="mt-3 text-xs text-steel/70">{download.version}</p> : null}
      </div>
    </LocalizedLink>
  );
}
