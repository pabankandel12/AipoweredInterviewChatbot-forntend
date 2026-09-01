"use client";

import { useEffect, useRef } from "react";
import useInterviewStore from "@/store/interviewStore";
import ChatMessage from "./ChatMessage";

export default function ChatPanel() {
  const messages = useInterviewStore((state) => state.messages);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scrolls to the bottom of the chat pane whenever a new message is appended
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50/40 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            score={message.score}
            isFeedback={message.isFeedback}
          />
        ))}
        
        {/* Anchor point for scrolling */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}