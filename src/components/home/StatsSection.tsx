export default function StatsSection() {
  const stats = [
    {
      number: "10K+",
      label: "Mock Interviews",
    },
    {
      number: "5K+",
      label: "Students",
    },
    {
      number: "95%",
      label: "Success Rate",
    },
    {
      number: "24/7",
      label: "AI Availability",
    },
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="text-center"
            >
              <h3 className="text-4xl font-bold">
                {item.number}
              </h3>

              <p className="mt-2 text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}