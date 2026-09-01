"use client";

import {
  Mic,
  Video,
  PhoneOff,
} from "lucide-react";

export default function InterviewControls() {
  return (
    <div className="flex items-center justify-center gap-4 border-t bg-white p-4">
      <button className="rounded-full bg-gray-100 p-4">
        <Mic size={22} />
      </button>

      <button className="rounded-full bg-gray-100 p-4">
        <Video size={22} />
      </button>

      <button className="rounded-full bg-red-600 p-4 text-white">
        <PhoneOff size={22} />
      </button>
    </div>
  );
}