import type { ProductParameter } from '@/types';

interface ProductParametersProps {
  parameters: ProductParameter[];
}

export function ProductParameters({ parameters }: ProductParametersProps) {
  if (parameters.length === 0) return null;

  const grouped = parameters.reduce(
    (acc, p) => {
      const group = p.groupName || '基本参数';
      if (!acc[group]) acc[group] = [];
      acc[group].push(p);
      return acc;
    },
    {} as Record<string, ProductParameter[]>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800">技术参数</h3>
      {Object.entries(grouped).map(([group, params]) => (
        <div key={group} className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-600">
            {group}
          </div>
          <div className="divide-y divide-neutral-100">
            {params.map((p) => (
              <div key={p.id} className="flex items-center px-4 py-2.5 text-sm">
                <span className="text-neutral-500 flex-1">{p.paramName}</span>
                <span className="text-neutral-800 font-medium">
                  {p.paramValue}
                  {p.unit && <span className="text-neutral-400 ml-1">{p.unit}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
