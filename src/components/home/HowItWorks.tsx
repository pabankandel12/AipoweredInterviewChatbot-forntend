export default function HowItWorks() {
  const steps = [
    "Create Account",
    "Choose Interview Type",
    "Practice with AI",
    "Get Feedback",
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold">
          How It Works
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className="text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {index + 1}
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {step}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}