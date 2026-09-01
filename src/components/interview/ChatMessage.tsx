import { Sparkles, Bot, User, CheckCircle } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  score?: number;
  isFeedback?: boolean;
}

export default function ChatMessage({
  role,
  content,
  score,
  isFeedback,
}: ChatMessageProps) {
  const isUser = role === "user";

  // Case 1: Render User's Answer Bubble (Right-aligned)
  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-3">
        <div className="flex flex-col items-end max-w-[80%]">
          <span className="text-[10px] font-bold text-slate-400 mr-2 mb-1 uppercase tracking-wider flex items-center gap-1">
            <User size={10} />
            Your Answer
          </span>
          <div className="rounded-3xl rounded-tr-none bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-medium text-white shadow-md leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Render AI Evaluation Feedback Card (Left-aligned, distinct styling)
  if (isFeedback) {
    const scoreColor = 
      score && score >= 85 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
      score && score >= 70 ? "bg-blue-50 text-blue-700 border-blue-100" :
      "bg-amber-50 text-amber-700 border-amber-100";

    return (
      <div className="flex justify-start items-start gap-3 animate-fade-in">
        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Sparkles size={18} className="animate-pulse" />
        </div>
        
        <div className="flex-1 max-w-2xl rounded-3xl border border-indigo-100/60 bg-indigo-50/15 p-5 shadow-sm border-l-4 border-l-indigo-500 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-500" />
              AI Evaluation
            </h4>
            
            {score !== undefined && (
              <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${scoreColor}`}>
                Score: {score}/100
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {content}
          </p>
        </div>
      </div>
    );
  }

  // Case 3: Render Standard AI Interviewer Question (Left-aligned)
  return (
    <div className="flex justify-start items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 border border-slate-200">
        <Bot size={18} />
      </div>
      
      <div className="flex flex-col max-w-[80%]">
        <span className="text-[10px] font-bold text-slate-400 ml-2 mb-1 uppercase tracking-wider flex items-center gap-1">
          <Bot size={10} />
          AI Interviewer
        </span>
        
        <div className="rounded-3xl rounded-tl-none bg-white border border-slate-200/80 px-5 py-3.5 text-sm font-medium text-slate-800 shadow-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}