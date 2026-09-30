"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useInterviewStore from "@/store/interviewStore";
import { submitAnswer } from "@/lib/api";
import { Send, Loader2, Mic } from "lucide-react";

type BrowserSpeechResult = ArrayLike<{ transcript: string }> & {
  isFinal: boolean;
};

type BrowserSpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<BrowserSpeechResult>;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor;
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
};

export default function MessageInput() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const sessionId = useInterviewStore((state) => state.sessionId);
  const addMessage = useInterviewStore((state) => state.addMessage);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  const handleToggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser. You can type your answer instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";
    recognition.onresult = (event) => {
      const finalTranscript = Array.from(event.results)
        .slice(event.resultIndex)
        .filter((result) => result.isFinal)
        .map((result) => result[0]?.transcript.trim() ?? "")
        .filter(Boolean)
        .join(" ");

      if (finalTranscript) {
        setMessage((currentMessage) =>
          [currentMessage.trim(), finalTranscript].filter(Boolean).join(" "),
        );
      }
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceError(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Microphone access was denied. Allow microphone access or type your answer."
          : "Could not recognize speech. Try again or type your answer.",
      );
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    setVoiceError("");
    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      setVoiceError("Could not start voice input. Check microphone access and try again.");
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading || isListening) return;

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

    } catch (error: unknown) {
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
            placeholder="Type an answer or use the microphone..."
            className="w-full bg-transparent p-4 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none"
            disabled={loading}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1 text-xs text-slate-400 font-medium select-none pointer-events-none">
            <span>Press Enter to send</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleVoiceInput}
          disabled={loading}
          aria-label={isListening ? "Stop voice input" : "Dictate answer with microphone"}
          aria-pressed={isListening}
          title={isListening ? "Stop voice input" : "Dictate answer with microphone"}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition disabled:opacity-55 ${
            isListening
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Mic size={20} className={isListening ? "animate-pulse" : ""} />
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading || isListening || !message.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/20 outline-none transition disabled:opacity-55 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
      <p aria-live="polite" className="mx-auto mt-2 max-w-5xl text-xs text-slate-500">
        {isListening
          ? "Listening. Stop voice input when you are finished speaking."
          : voiceError}
      </p>
    </div>
  );
}