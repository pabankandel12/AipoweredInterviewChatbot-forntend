"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getInterviewDetails } from "@/lib/api";
import { 
  Award, BarChart2, BookOpen, CheckCircle, HelpCircle, ArrowLeft, 
  RefreshCw, FileText, ChevronDown, ChevronUp, Loader2, Sparkles 
} from "lucide-react";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!interviewId) {
      setError("No interview ID provided");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await getInterviewDetails(interviewId);
        setInterview(data);
      } catch (err: any) {
        console.error("Error loading interview details:", err);
        setError("Could not retrieve interview results. Make sure you are authorized.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interviewId, router]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Retrieving your results...
        </p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4">
        <div className="inline-flex rounded-full bg-red-100 p-4 text-red-600">
          <HelpCircle size={36} />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Unable to load results</h2>
        <p className="mt-2 text-slate-600">{error || "Interview session not found."}</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md hover:bg-blue-500 transition"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const getPerformanceRating = (score: number) => {
    if (score >= 85) return { text: "Outstanding", color: "text-emerald-500 bg-emerald-50 border-emerald-200" };
    if (score >= 70) return { text: "Strong Pass", color: "text-blue-500 bg-blue-50 border-blue-200" };
    if (score >= 50) return { text: "Needs Practice", color: "text-amber-500 bg-amber-50 border-amber-200" };
    return { text: "Critical Review Needed", color: "text-red-500 bg-red-50 border-red-200" };
  };

  const rating = getPerformanceRating(interview.overallScore || 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header Block */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {interview.difficulty} difficulty
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-0.5">
                  <CheckCircle size={12} />
                  Evaluated
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Interview Report: {interview.candidateName}
              </h1>
              <p className="text-sm text-slate-500 max-w-xl line-clamp-1">
                JD: {interview.jd}
              </p>
            </div>

            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <RefreshCw size={16} />
              Practice Again
            </Link>
          </div>
        </div>

        {/* Scores Overview Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Overall Performance */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall Score</span>
            <div className="relative flex items-center justify-center">
              <div className="text-5xl font-black text-slate-950">{interview.overallScore}%</div>
            </div>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${rating.color}`}>
              {rating.text}
            </span>
          </div>

          {/* CV Match Score */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Resume Match</span>
            <div className="text-5xl font-black text-slate-950">{interview.matchScore}%</div>
            <span className="text-xs text-slate-400 font-medium">Similarity to job description</span>
          </div>

          {/* Questions Answered */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Progress</span>
            <div className="text-5xl font-black text-slate-950">
              {interview.conversations?.length || 0} / {interview.questions?.length || 0}
            </div>
            <span className="text-xs text-slate-400 font-medium">Questions evaluated</span>
          </div>
        </div>

        {/* Skills Tag Section */}
        {interview.skills && interview.skills.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-blue-600" />
              Identified Key Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {interview.skills.map((skill: string) => (
                <span key={skill} className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-600 uppercase">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Questions & Answers */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Question-by-Question Breakdown</h2>
          
          <div className="space-y-4">
            {interview.conversations?.map((entry: any, index: number) => {
              const isOpen = expandedQuestion === index;
              
              return (
                <div 
                  key={index}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
                >
                  {/* Collapsible Trigger */}
                  <button
                    onClick={() => setExpandedQuestion(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-slate-400">QUESTION {index + 1}</span>
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                          entry.score >= 85 ? "bg-emerald-50 text-emerald-700" :
                          entry.score >= 70 ? "bg-blue-50 text-blue-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          Score: {entry.score}/100
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-950 line-clamp-2 md:line-clamp-none">
                        {entry.question}
                      </h3>
                    </div>
                    <div>
                      {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </div>
                  </button>

                  {/* Body */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6 animate-fade-in">
                      
                      {/* Candidate Answer */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen size={14} />
                          Your Answer
                        </h4>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 leading-relaxed shadow-inner">
                          {entry.answer}
                        </div>
                      </div>

                      {/* AI Feedback */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                          AI Evaluator Feedback
                        </h4>
                        <div className="rounded-2xl border border-indigo-100/50 bg-indigo-50/20 p-5 text-sm text-slate-700 leading-relaxed border-l-4 border-l-indigo-600">
                          {entry.feedback}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading results...
        </p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}

