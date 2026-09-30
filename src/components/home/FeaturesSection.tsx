import { BarChart3, FileSearch, MessageSquareText, ShieldCheck } from "lucide-react";

const features = [
  { icon: FileSearch, title: "Grounded in your CV", desc: "Your resume and job description shape the questions you receive." },
  { icon: MessageSquareText, title: "A focused interview flow", desc: "Move through one clear question at a time without losing context." },
  { icon: BarChart3, title: "Feedback you can use", desc: "See what was strong in your answer and what to improve next." },
  { icon: ShieldCheck, title: "Practice before it counts", desc: "Build confidence privately before the real conversation." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#f6f8fb] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Built for better practice</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#102a43] sm:text-5xl">Useful preparation, not generic prompts.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Each session starts with the experience you already have and the role you want next.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={22} /></div>
              <h3 className="mt-6 text-lg font-bold text-[#102a43]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
