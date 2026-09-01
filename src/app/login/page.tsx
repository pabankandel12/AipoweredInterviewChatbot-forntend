"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Force a header refresh by dispatching a custom event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      if (!err.response) {
        setError("Could not connect to the server. Please verify the backend is running.");
      } else {
        setError(err.response.data?.message || "Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-955 to-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Title Block */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20 mb-4 animate-bounce">
            <Sparkles size={28} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Log in to your account and continue your interview preparation
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3.5 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-950"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3.5 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-950"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/30 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Sign In
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-200">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
