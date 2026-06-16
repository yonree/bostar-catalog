export function TechnologyAdvantageCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-hover rounded-[26px] border border-line bg-white p-7 shadow-card">
      <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-steel">{description}</p>
    </div>
  );
}
