"use client";

import { useEffect, useRef } from "react";
import useInterviewStore from "@/store/interviewStore";
import ChatMessage from "./ChatMessage";

export default function ChatPanel() {
  const messages = useInterviewStore((state) => state.messages);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatPane = chatScrollRef.current;
    if (chatPane) {
      chatPane.scrollTo({ top: chatPane.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      ref={chatScrollRef}
      role="log"
      aria-label="Interview conversation messages"
      aria-live="polite"
      className="h-full min-h-0 overflow-y-auto overscroll-contain bg-slate-50/70 px-4 py-5 [scrollbar-gutter:stable] md:px-6"
    >
      <div className="mx-auto max-w-3xl space-y-5 pb-2">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            score={message.score}
            isFeedback={message.isFeedback}
          />
        ))}
      </div>
    </div>
  );
}
