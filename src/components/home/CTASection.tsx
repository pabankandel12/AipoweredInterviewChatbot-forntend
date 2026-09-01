"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-28 text-center text-white">
      
      {/* Glow effect background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        <h2 className="text-4xl font-bold leading-tight md:text-5xl">
          Ready To Land Your Dream Job?
        </h2>

        <p className="mt-6 text-lg text-white/80">
          Practice with AI-powered interviews, get instant feedback,
          and improve your confidence before real interviews.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/interview"
            className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition hover:scale-105"
          >
            Start Free Interview
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/60">
          No credit card required • Free practice interviews
        </p>
      </div>
    </section>
  );
}