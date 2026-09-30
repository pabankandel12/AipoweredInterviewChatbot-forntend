"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BriefcaseBusiness, LogOut, Menu, X } from "lucide-react";

type CurrentUser = { name: string; email: string };

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return setCurrentUser(null);
    try {
      setCurrentUser(JSON.parse(storedUser) as CurrentUser);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
    window.dispatchEvent(new Event("auth-change"));
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = currentUser
    ? [{ name: "Home", href: "/" }, { name: "Dashboard", href: "/dashboard" }]
    : [
        { name: "How it works", href: "/#how" },
        { name: "Practice areas", href: "/#categories" },
        { name: "What you get", href: "/#features" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102a43] text-sm font-black text-teal-300">AI</span>
          <span className="text-lg font-bold tracking-tight text-[#102a43]">Interview<span className="text-teal-600">.</span></span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-semibold text-slate-600 transition hover:text-teal-700">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <span className="max-w-36 truncate text-sm font-semibold text-slate-600">Hi, {currentUser.name.split(" ")[0]}</span>
              <Link href="/start" className="inline-flex items-center gap-2 rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#163b5a]"><BriefcaseBusiness size={16} /> Practice</Link>
              <button onClick={handleLogout} className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" title="Log out" aria-label="Log out"><LogOut size={18} /></button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 text-sm font-bold text-slate-700 transition hover:text-teal-700">Sign in</Link>
              <Link href="/register" className="inline-flex items-center gap-1 rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#163b5a]">Create account <ArrowUpRight size={16} /></Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((value) => !value)} className="rounded-lg p-2 text-[#102a43] transition hover:bg-slate-100 md:hidden" aria-label="Toggle navigation">
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => <Link key={link.name} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800">{link.name}</Link>)}
          </nav>
          <div className="mt-4 border-t border-slate-200 pt-4">
            {currentUser ? (
              <div className="space-y-3"><p className="px-3 text-sm text-slate-500">Signed in as {currentUser.email}</p><Link href="/start" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl bg-[#102a43] py-3 text-sm font-bold text-white"><BriefcaseBusiness size={17} /> Start practice</Link><button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700"><LogOut size={17} /> Log out</button></div>
            ) : (
              <div className="grid grid-cols-2 gap-3"><Link href="/login" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 py-3 text-center text-sm font-bold text-slate-700">Sign in</Link><Link href="/register" onClick={() => setOpen(false)} className="rounded-xl bg-[#102a43] py-3 text-center text-sm font-bold text-white">Create account</Link></div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
