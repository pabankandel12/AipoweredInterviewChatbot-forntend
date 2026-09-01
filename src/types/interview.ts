export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface InterviewState {
  messages: Message[];
  addMessage: (message: Message) => void;
}