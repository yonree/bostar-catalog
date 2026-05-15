import Link from 'next/link';

const solutions = [
  { title: 'Aluminum Profile Coating', desc: 'Automatic powder/gun spraying solutions for window frames, curtain walls, and industrial profiles. Multi-color fast changeover support.' },
  { title: 'Automotive Parts Coating', desc: 'DISK electrostatic disk system for wheel hubs, bumpers, and metal components. High transfer efficiency ≥90%.' },
  { title: 'Home Appliance Coating', desc: 'Reciprocator-based automatic lines for refrigerator panels, washing machine shells, and microwave housings.' },
  { title: 'Metal Furniture Coating', desc: 'Manual + automatic hybrid solutions for office furniture, outdoor furniture, and shelving systems.' },
  { title: 'Pipe & Tube Coating', desc: 'Specialized conveying systems for pipe internal/external powder coating with uniform thickness control.' },
  { title: 'Construction Hardware', desc: 'Dedicated hangers and tooling for small hardware parts, bolts, nuts, and fasteners.' },
];

export default function EnSolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-800 mb-2">Solutions</h1>
      <p className="text-sm text-neutral-500 mb-8">Industry-specific electrostatic spraying solutions tailored to your needs</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {solutions.map((s) => (
          <div key={s.title} className="bg-white rounded-xl border border-neutral-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-medium text-neutral-800 mb-2">{s.title}</h3>
            <p className="text-sm text-neutral-500 mb-4">{s.desc}</p>
            <Link href="/en/inquiry" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Request Details &rarr;</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
