"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useInterviewStore from "@/store/interviewStore";
import { submitAnswer } from "@/lib/api";
import { Loader2, Mic, Send, Square } from "lucide-react";

type VoiceResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type BrowserRecognition = {
  continuous: boolean; interimResults: boolean; lang: string; start: () => void; stop: () => void;
  onresult: ((event: VoiceResultEvent) => void) | null; onend: (() => void) | null; onerror: (() => void) | null;
};
type BrowserRecognitionConstructor = new () => BrowserRecognition;

declare global { interface Window { SpeechRecognition?: BrowserRecognitionConstructor; webkitSpeechRecognition?: BrowserRecognitionConstructor; } }

export default function MessageInput() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const recognitionRef = useRef<BrowserRecognition | null>(null);
  const sessionId = useInterviewStore((state) => state.sessionId);
  const addMessage = useInterviewStore((state) => state.addMessage);

  const toggleVoiceInput = () => {
    if (listening) { recognitionRef.current?.stop(); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setVoiceNotice("Voice input is not supported in this browser. Use Chrome or type your answer."); return; }
    const recognition = new Recognition();
    recognition.continuous = false; recognition.interimResults = false; recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim();
      setMessage((current) => [current, transcript].filter(Boolean).join(current ? " " : ""));
      setVoiceNotice("Voice answer added. Review it before sending.");
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setVoiceNotice("Voice input could not understand the audio. Please try again."); };
    recognitionRef.current = recognition; setVoiceNotice(""); setListening(true); recognition.start();
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!sessionId) { router.push("/start"); return; }
    const userAnswer = message.trim();
    addMessage({ role: "user", content: userAnswer }); setMessage(""); setLoading(true);
    try {
      const data = await submitAnswer(sessionId, userAnswer);
      addMessage({ role: "assistant", content: data.feedback || "Answer received and evaluated.", score: data.score, isFeedback: true });
      if (data.completed) { addMessage({ role: "assistant", content: "You have completed this practice session. Preparing your final report…" }); setTimeout(() => router.push(`/result?id=${sessionId}`), 1800); }
      else if (data.nextQuestion) setTimeout(() => addMessage({ role: "assistant", content: data.nextQuestion }), 600);
    } catch {
      addMessage({ role: "assistant", content: "We could not evaluate that answer. Please try again." });
    } finally { setLoading(false); }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <div className="mx-auto flex max-w-5xl gap-3 items-end">
        <div className="flex-1"><div className="relative rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-teal-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-teal-500"><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSend(); } }} rows={2} placeholder="Write your answer, or use the microphone…" className="w-full resize-none bg-transparent p-4 pr-14 text-sm text-slate-800 placeholder-slate-400 outline-none" disabled={loading} /><button onClick={toggleVoiceInput} disabled={loading} className={`absolute bottom-3 right-3 rounded-xl p-2 transition ${listening ? "bg-red-100 text-red-700" : "text-teal-700 hover:bg-teal-100"}`} aria-label={listening ? "Stop voice input" : "Start voice input"}>{listening ? <Square size={18} fill="currentColor" /> : <Mic size={19} />}</button></div>{voiceNotice && <p className="mt-1.5 text-xs text-slate-500">{voiceNotice}</p>}</div>
        <button onClick={handleSend} disabled={loading || !message.trim()} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#102a43] text-white transition hover:bg-[#163b5a] disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}</button>
      </div>
    </div>
  );
}
