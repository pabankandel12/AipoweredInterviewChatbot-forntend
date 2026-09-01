"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, User, LayoutDashboard, Briefcase } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth); // handle changes across tabs
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");
      window.dispatchEvent(new Event("auth-change"));
    }
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = currentUser
    ? [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Features", href: "/#features" },
        { name: "Categories", href: "/#categories" },
        { name: "How It Works", href: "/#how" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 transition hover:opacity-90">
          AI<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Interview</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth CTA / User Profile */}
        <div className="hidden items-center gap-4 md:flex">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Hi, {currentUser.name.split(" ")[0]}
              </span>
              
              <Link
                href="/start"
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition hover:scale-102"
              >
                <Briefcase size={16} />
                Practice Now
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                title="Log Out"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition hover:scale-102"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-1 text-slate-700 hover:bg-slate-50 md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-5 md:hidden animate-fade-in">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-slate-700 hover:text-blue-600 transition"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-slate-100 my-1" />

            {currentUser ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-500 px-1">
                  Logged in as {currentUser.email}
                </span>
                
                <Link
                  href="/start"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  <Briefcase size={18} />
                  Practice Now
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}