import Link from "next/link";
import { BarChart3, BriefcaseBusiness, Code2, LayoutPanelTop, MessageSquareText, Server } from "lucide-react";

const categories = [
  ["Software engineering", "Architecture, APIs, debugging", Code2],
  ["Frontend development", "Interfaces, performance, accessibility", LayoutPanelTop],
  ["Backend development", "Systems, data, reliability", Server],
  ["Data and analytics", "Insights, metrics, decision-making", BarChart3],
  ["Behavioral interview", "Experience, ownership, collaboration", MessageSquareText],
  ["Career foundations", "Introductions, goals, confidence", BriefcaseBusiness],
] as const;

export default function CategoriesSection() {
  return (
    <section id="categories" className="bg-[#eef7f6] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Practice with intent</p><h2 className="mt-3 text-4xl font-bold tracking-tight text-[#102a43] sm:text-5xl">Prepare for the conversation ahead.</h2></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([title, description, Icon]) => (
            <Link key={title} href="/start" className="group flex items-start gap-4 rounded-2xl border border-teal-900/10 bg-white p-5 transition hover:border-teal-300 hover:shadow-md">
              <span className="rounded-xl bg-teal-50 p-3 text-teal-700"><Icon size={21} /></span>
              <span><span className="block font-bold text-[#102a43] group-hover:text-teal-700">{title}</span><span className="mt-1 block text-sm text-slate-600">{description}</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
