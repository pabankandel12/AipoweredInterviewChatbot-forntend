import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-[#071c2c] py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-end">
        <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-300">Your next practice session</p><h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Turn preparation into a habit.</h2><p className="mt-5 text-lg leading-8 text-slate-300">Bring your CV and a role description. We will help you practice the part that matters: your answers.</p></div>
        <Link href="/start" className="inline-flex items-center gap-2 rounded-xl bg-teal-300 px-6 py-3.5 font-bold text-[#062b35] transition hover:bg-teal-200">Start practicing <ArrowRight size={19} /></Link>
      </div>
    </section>
  );
}
