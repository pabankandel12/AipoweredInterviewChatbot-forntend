"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useInterviewStore from "@/store/interviewStore";
import { getInterviewDetails } from "@/lib/api";
import ChatPanel from "@/components/interview/ChatPanel";
import MessageInput from "@/components/interview/MessageInput";
import Header from "@/components/layout/Header";
import { Loader2, Briefcase, Award, ArrowRight } from "lucide-react";

export default function InterviewPage() {
  const router = useRouter();
  
  const sessionId = useInterviewStore((state) => state.sessionId);
  const setMessages = useInterviewStore((state) => state.setMessages);
  
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterview = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const activeSessionId = sessionId || localStorage.getItem("sessionId");
      if (!activeSessionId) {
        router.push("/start");
        return;
      }

      try {
        const data = await getInterviewDetails(activeSessionId);
        setInterview(data);

        if (data.completed) {
          router.push(`/result?id=${activeSessionId}`);
          return;
        }

        // Reconstruct messages history
        const constructedMessages: any[] = [];
        
        if (data.conversations && data.conversations.length > 0) {
          data.conversations.forEach((item: any) => {
            constructedMessages.push({
              role: "assistant",
              content: item.question,
            });
            constructedMessages.push({
              role: "user",
              content: item.answer,
            });
            constructedMessages.push({
              role: "assistant",
              content: item.feedback,
              score: item.score,
              isFeedback: true,
            });
          });
        }

        // Add active question
        const currentQuestion = data.questions[data.currentIndex];
        if (currentQuestion) {
          constructedMessages.push({
            role: "assistant",
            content: currentQuestion,
          });
        } else if (data.questions.length > 0) {
          // Fallback if index mismatch
          constructedMessages.push({
            role: "assistant",
            content: "Please describe your background and key technical projects.",
          });
        }

        setMessages(constructedMessages);
      } catch (err: any) {
        console.error("Failed to load interview:", err);
        setError("Could not initialize the interview session. Make sure the backend is active.");
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [sessionId, router, setMessages]);

  const handleFinishEarly = () => {
    const activeSessionId = sessionId || localStorage.getItem("sessionId");
    router.push(`/result?id=${activeSessionId}`);
  };

  if (loading) {
    return (
      <div className="flex h-[85vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Setting up your interview environment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-6">
        <div className="rounded-full bg-red-100 p-4 text-red-600 inline-flex">
          <Briefcase size={36} />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">Session Error</h3>
        <p className="mt-2 text-slate-500">{error}</p>
        <button
          onClick={() => router.push("/start")}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md hover:bg-blue-500 transition"
        >
          Go to Start Page
        </button>
      </div>
    );
  }

  const currentQIndex = interview ? interview.currentIndex + 1 : 1;
  const totalQuestions = interview ? interview.questions.length : 3;
  const progressPercent = interview ? (interview.currentIndex / totalQuestions) * 100 : 0;

  return (
    <div className="flex h-[88vh] flex-col bg-slate-50">
      {/* Top Session Progress Header */}
      <div className="border-b bg-white px-6 py-4 shadow-sm relative z-10">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 capitalize border border-indigo-100">
                {interview?.difficulty} difficulty
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Resume Match: {interview?.matchScore}%
              </span>
            </div>
            <h2 className="font-bold text-slate-900 line-clamp-1">
              Active Session: {interview?.candidateName || "Candidate Profile"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Counter */}
            <div className="text-right space-y-0.5">
              <span className="text-xs font-bold text-slate-400 block">PROGRESS</span>
              <span className="text-sm font-bold text-slate-800">
                Question {Math.min(currentQIndex, totalQuestions)} of {totalQuestions}
              </span>
            </div>

            {/* Quick Exit */}
            <button
              onClick={handleFinishEarly}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              Finish Early
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Message Chat Pane */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel />
      </div>

      {/* Answer Message Input Box */}
      <div className="bg-white border-t border-slate-100 relative z-10 shadow-lg">
        <div className="mx-auto max-w-5xl">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}