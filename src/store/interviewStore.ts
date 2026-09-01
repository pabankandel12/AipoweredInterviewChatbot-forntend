import { create } from "zustand";

interface Message {
  role: "user" | "assistant";
  content: string;
  feedback?: string;
  score?: number;
  isFeedback?: boolean; // flag to distinguish question from evaluation feedback
}

interface InterviewState {
  sessionId: string;
  messages: Message[];

  setSession: (id: string) => void;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  reset: () => void;
}

const useInterviewStore = create<InterviewState>((set) => ({
  sessionId: typeof window !== "undefined"
    ? localStorage.getItem("sessionId") || ""
    : "",

  messages: [],

  setSession: (id) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sessionId", id);
    }
    set({ sessionId: id });
  },

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  setMessages: (msgs) => set({ messages: msgs }),

  reset: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sessionId");
    }
    set({ sessionId: "", messages: [] });
  },
}));

export default useInterviewStore;