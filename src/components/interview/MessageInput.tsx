"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useInterviewStore from "@/store/interviewStore";
import { submitAnswer } from "@/lib/api";
import { Send, Loader2, Sparkles } from "lucide-react";

export default function MessageInput() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionId = useInterviewStore((state) => state.sessionId);
  const addMessage = useInterviewStore((state) => state.addMessage);

  const handleSend = async () => {
    if (!message.trim()) return;

    if (!sessionId) {
      alert("Session not found. Please start the interview again.");
      router.push("/start");
      return;
    }

    const userAnswer = message;

    // 1. Add the user's answer immediately to the chat panel
    addMessage({
      role: "user",
      content: userAnswer,
    });

    setMessage("");
    setLoading(true);

    try {
      // 2. Submit the answer to the Express backend
      console.log(`Submitting answer for session ${sessionId}...`);
      const data = await submitAnswer(sessionId, userAnswer);

      // 3. Add the AI evaluation feedback
      addMessage({
        role: "assistant",
        content: data.feedback || "Answer received and evaluated.",
        score: data.score,
        isFeedback: true,
      });

      // 4. Handle interview termination or next question
      if (data.completed) {
        addMessage({
          role: "assistant",
          content: "🎉 Congratulations! You have completed all the questions for this interview. Generating your final report now...",
        });

        // Redirect to results after 2.5 seconds
        setTimeout(() => {
          router.push(`/result?id=${sessionId}`);
        }, 2500);
      } else if (data.nextQuestion) {
        // Give a tiny delay before displaying the next question for better conversational pacing
        setTimeout(() => {
          addMessage({
            role: "assistant",
            content: data.nextQuestion,
          });
        }, 800);
      }

    } catch (error: any) {
      console.error("Error submitting answer:", error);
      addMessage({
        role: "assistant",
        content: "⚠️ Error connecting to AI evaluation server. Please try submitting your response again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="mx-auto max-w-5xl flex gap-3 items-end">
        {/* Text Input Area */}
        <div className="flex-1 relative rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 focus-within:bg-white transition duration-150">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Type your detailed answer here..."
            className="w-full bg-transparent p-4 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none"
            disabled={loading}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1 text-xs text-slate-400 font-medium select-none pointer-events-none">
            <span>Press Enter to send</span>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/20 outline-none transition disabled:opacity-55 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
}