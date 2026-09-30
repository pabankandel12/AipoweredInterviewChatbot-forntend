const steps = [
  ["01", "Upload your CV"],
  ["02", "Add a target role"],
  ["03", "Practice your answers"],
  ["04", "Learn from feedback"],
];

export default function StatsSection() {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([number, label]) => (
          <div key={number} className="flex items-center gap-4 border-l border-slate-200 pl-5 first:border-l-0 first:pl-0">
            <span className="text-2xl font-bold text-teal-600">{number}</span>
            <span className="text-sm font-semibold text-slate-600">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
