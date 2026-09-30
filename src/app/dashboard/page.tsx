"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getHistory } from "@/lib/api";
import useInterviewStore from "@/store/interviewStore";
import { 
  Briefcase, Calendar, Award, CheckCircle, Clock, ArrowRight, PlusCircle, 
  BarChart2, ShieldAlert, Sparkles, Loader2, Video
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const setSession = useInterviewStore((state) => state.setSession);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err: any) {
        console.error("Failed to load interview history:", err);
        setError("Could not load your interview history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // Calculate summary stats
  const totalInterviews = history.length;
  const completedInterviews = history.filter(h => h.completed).length;
  const inProgressInterviews = totalInterviews - completedInterviews;
  
  const completedHistory = history.filter(h => h.completed && h.overallScore);
  const avgScore = completedHistory.length > 0
    ? Math.round(completedHistory.reduce((sum, h) => sum + h.overallScore, 0) / completedHistory.length)
    : 0;

  const maxMatchScore = history.length > 0
    ? Math.max(...history.map(h => h.matchScore || 0))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 shadow-xl text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                <Sparkles size={12} />
                AI Interview Prep
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Hi, {user?.name || "Candidate"}!
              </h1>
              <p className="text-slate-300 max-w-xl">
                Track your progress, review detailed AI evaluations of your responses, and continue practicing to land your dream role.
              </p>
            </div>

            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-md transition hover:scale-105 hover:bg-slate-50"
            >
              <PlusCircle size={18} />
              Start New Interview
            </Link>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <ShieldAlert className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Stat 1 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Total Interviews</span>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Briefcase size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-950">{totalInterviews}</span>
              <span className="text-xs text-slate-400">sessions created</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Average Performance</span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <Award size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-950">{avgScore}%</span>
              <span className="text-xs text-slate-400">overall score</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Max Match Score</span>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <BarChart2 size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-950">{maxMatchScore}%</span>
              <span className="text-xs text-slate-400">resume match</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Active Sessions</span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-950">{inProgressInterviews}</span>
              <span className="text-xs text-slate-400">in-progress sessions</span>
            </div>
          </div>

        </div>

        {/* History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Your Practice Sessions</h2>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="rounded-2xl bg-slate-50 p-4 text-slate-400">
                <Briefcase size={36} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No interview sessions yet</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Get started by uploading your resume and specifying a job description. Practice makes perfect!
              </p>
              <Link
                href="/start"
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition"
              >
                Create Your First Session
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {history.map((session) => (
                <div 
                  key={session._id} 
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/65 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 capitalize">
                          {session.difficulty} level
                        </span>
                        <h3 className="font-bold text-slate-950 line-clamp-1 group-hover:text-blue-600 transition">
                          {session.candidateName || "Candidate Profile"}
                        </h3>
                      </div>
                      
                      {/* Completion status */}
                      {session.completed ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
                          <CheckCircle size={12} />
                          Complete
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-full px-2.5 py-1">
                          <Clock size={12} />
                          In Progress
                        </span>
                      )}
                    </div>

                    {/* Scores row */}
                    <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-3 text-center text-xs">
                      <div>
                        <p className="text-slate-400 font-medium">Resume Match</p>
                        <p className="text-lg font-bold text-slate-900 mt-0.5">{session.matchScore || 0}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Evaluation Score</p>
                        <p className="text-lg font-bold text-slate-900 mt-0.5">
                          {session.completed ? `${session.overallScore || 0}%` : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Skills pills */}
                    {session.skills && session.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {session.skills.slice(0, 4).map((skill: string) => (
                          <span key={skill} className="rounded-md bg-blue-50/50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-100/50 uppercase">
                            {skill}
                          </span>
                        ))}
                        {session.skills.length > 4 && (
                          <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                            +{session.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar size={12} />
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>

                    {session.completed ? (
                      <Link
                        href={`/result?id=${session._id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-500 transition"
                      >
                        View Results
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => {
                            setSession(session._id);
                            router.push("/interview");
                          }}
                          className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-500 transition"
                        >
                          Resume Prep
                          <ArrowRight size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSession(session._id);
                            router.push("/interview/live");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
                        >
                          <Video size={15} /> Start Live Interview
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
