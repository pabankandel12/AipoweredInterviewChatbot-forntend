import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Target } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#071c2c] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(20,184,166,0.25),transparent_25%),radial-gradient(circle_at_18%_85%,rgba(59,130,246,0.18),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1.5 text-sm font-semibold text-teal-100">
              <Sparkles size={15} /> Interview practice that adapts to you
            </span>
            <h1 className="mt-7 text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Walk into your next interview <span className="text-teal-300">prepared.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Upload your CV, add the role you want, and practice questions shaped around the skills employers are looking for.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/start" className="flex items-center justify-center gap-2 rounded-xl bg-teal-300 px-6 py-3.5 font-bold text-[#062b35] transition hover:bg-teal-200">
                Start a practice session <ArrowRight size={20} />
              </Link>
              <Link href="/#how" className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
                See how it works
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-teal-300" /> CV-aware questions</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-teal-300" /> Immediate feedback</span>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white p-4 text-slate-900 shadow-2xl shadow-black/25">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Live practice plan</p>
                  <p className="mt-1 font-bold text-slate-800">Software engineer interview</p>
                </div>
                <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">72% role match</div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Target size={17} className="text-teal-600" /> Current question</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">How did you design an API that remained reliable as usage increased?</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 w-2/3 rounded-full bg-teal-500" /></div>
                  <p className="mt-2 text-xs font-medium text-slate-400">Question 3 of 6</p>
                </div>
                <div className="rounded-xl bg-[#e9f8f5] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Feedback signal</p>
                  <p className="mt-3 text-3xl font-bold text-slate-800">Strong</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Add a concrete result to make your answer more memorable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
