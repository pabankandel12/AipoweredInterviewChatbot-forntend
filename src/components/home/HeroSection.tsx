import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full border px-4 py-2 text-sm font-medium">
              🚀 AI Powered Interview Platform
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-7xl">
              Ace Your Next
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Job Interview
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Practice with an intelligent AI interviewer that
              asks real interview questions, analyzes your
              responses, and provides instant feedback.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/interview"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-white"
              >
                Start Interview
                <ArrowRight size={20} />
              </Link>

              <button className="flex items-center gap-2 rounded-xl border px-6 py-4">
                <Play size={18} />
                Watch Demo
              </button>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border bg-white p-6 shadow-xl">
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-100 p-4">
                  🤖 Tell me about yourself.
                </div>

                <div className="ml-auto w-fit rounded-xl bg-blue-600 p-4 text-white">
                  I am a BCA student passionate about software
                  development...
                </div>

                <div className="rounded-xl bg-slate-100 p-4">
                  Excellent answer. Can you explain a project
                  you've worked on?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}