import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const productLinks = [
  ["Start a session", "/start"],
  ["How it works", "/#how"],
  ["Practice areas", "/#categories"],
];

const accountLinks = [
  ["Create account", "/register"],
  ["Sign in", "/login"],
  ["Dashboard", "/dashboard"],
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_0.7fr_0.7fr]">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 text-[#102a43]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102a43] text-sm font-black text-teal-300">AI</span><span className="text-xl font-bold tracking-tight">Interview<span className="text-teal-600">.</span></span></Link>
          <p className="mt-5 text-sm leading-7 text-slate-600">Practice interviews built around your experience, your target role, and the answers you want to make stronger.</p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700"><CheckCircle2 size={17} /> Resume-aware practice sessions</p>
        </div>
        <div><h2 className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Practice</h2><nav className="mt-5 flex flex-col gap-3">{productLinks.map(([label, href]) => <Link key={label} href={href} className="text-sm font-medium transition hover:text-teal-700">{label}</Link>)}</nav></div>
        <div><h2 className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Account</h2><nav className="mt-5 flex flex-col gap-3">{accountLinks.map(([label, href]) => <Link key={label} href={href} className="text-sm font-medium transition hover:text-teal-700">{label}</Link>)}</nav><Link href="/start" className="mt-7 inline-flex items-center gap-1 text-sm font-bold text-[#102a43] transition hover:text-teal-700">Begin practicing <ArrowUpRight size={16} /></Link></div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} AIInterview. Built for intentional practice.</span><span>CV-guided questions · Immediate feedback</span></div></div>
    </footer>
  );
}
