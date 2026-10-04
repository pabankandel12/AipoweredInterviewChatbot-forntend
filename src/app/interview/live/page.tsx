"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, ArrowLeft, Camera, CameraOff, Loader2, ShieldCheck, Video } from "lucide-react";
import ChatPanel from "@/components/interview/ChatPanel";
import MessageInput from "@/components/interview/MessageInput";
import useCamera from "@/hooks/useCamera";
import { getInterviewDetails } from "@/lib/api";
import useInterviewStore from "@/store/interviewStore";

interface InterviewDetails {
  candidateName: string;
  difficulty: string;
  matchScore: number;
  currentIndex: number;
  questions: string[];
  completed: boolean;
  conversations: Array<{
    question: string;
    answer: string;
    feedback?: string;
    score?: number;
  }>;
}

interface InterviewChatMessage {
  role: "assistant" | "user";
  content: string;
  score?: number;
  isFeedback?: boolean;
}

export default function LiveInterviewPage() {
  const router = useRouter();
  const sessionId = useInterviewStore((state) => state.sessionId);
  const setMessages = useInterviewStore((state) => state.setMessages);
  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const {
    videoRef,
    isCameraActive,
    isStarting,
    cameraError,
    motionDetected,
    motionError,
    qualityError,
    frameQuality,
    isPageVisible,
    faceStatus,
    faceError,
    toggleCamera,
  } = useCamera();

  useEffect(() => {
    const loadInterview = async () => {
      if (!localStorage.getItem("token")) {
        router.push("/login");
        return;
      }

      const activeSessionId = sessionId || localStorage.getItem("sessionId");
      if (!activeSessionId) {
        router.push("/start");
        return;
      }

      try {
        const data = (await getInterviewDetails(activeSessionId)) as InterviewDetails;
        if (data.completed) {
          router.push(`/result?id=${activeSessionId}`);
          return;
        }

        const messages: InterviewChatMessage[] = data.conversations.flatMap((item) => [
          { role: "assistant", content: item.question },
          { role: "user", content: item.answer },
          {
            role: "assistant",
            content: item.feedback || "Answer received.",
            score: item.score,
            isFeedback: true,
          },
        ]);
        const currentQuestion = data.questions[data.currentIndex];
        if (currentQuestion) {
          messages.push({ role: "assistant", content: currentQuestion });
        }

        setInterview(data);
        setMessages(messages);
      } catch (error) {
        console.error("Failed to load live interview:", error);
        setPageError("Could not load this interview session. Return to text interview and try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadInterview();
  }, [router, sessionId, setMessages]);

  const finishInterview = () => {
    const activeSessionId = sessionId || localStorage.getItem("sessionId");
    if (activeSessionId) router.push(`/result?id=${activeSessionId}`);
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-700" size={28} />
        <p className="text-sm font-medium text-slate-600">Preparing live interview...</p>
      </main>
    );
  }

  if (pageError || !interview) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-xl font-bold text-slate-900">Live interview unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">{pageError || "No active interview session was found."}</p>
        <Link href="/interview" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
          <ArrowLeft size={16} /> Return to interview
        </Link>
      </main>
    );
  }

  const totalQuestions = interview.questions.length;
  const currentQuestionNumber = Math.min(interview.currentIndex + 1, totalQuestions);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-800">Live video mode</span>
              <span className="capitalize">{interview.difficulty} difficulty</span>
              <span>Resume match {interview.matchScore}%</span>
            </div>
            <h1 className="mt-1 truncate text-lg font-bold text-slate-900">
              {interview.candidateName || "Interview session"}
              <span className="ml-2 text-sm font-medium text-slate-500">
                Question {currentQuestionNumber} of {totalQuestions}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Text mode
            </Link>
            <button
              type="button"
              onClick={finishInterview}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Finish
            </button>
          </div>
        </div>
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-emerald-600 transition-[width]"
            style={{ width: `${totalQuestions ? (interview.currentIndex / totalQuestions) * 100 : 0}%` }}
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl items-start gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-4" aria-labelledby="camera-title">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 id="camera-title" className="text-sm font-bold text-slate-900">Camera preview</h2>
              <p className="mt-1 text-xs text-slate-500">Face and motion checks run on this device. Video is not recorded.</p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${isCameraActive ? "text-emerald-700" : "text-slate-500"}`}>
              <span className={`h-2 w-2 rounded-full ${isCameraActive ? "bg-emerald-500" : "bg-slate-300"}`} />
              {isCameraActive ? "Camera on" : "Camera off"}
            </span>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-md bg-slate-950">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              aria-label="Your live camera preview"
              className={`h-full w-full object-cover ${isCameraActive ? "scale-x-[-1]" : "invisible"}`}
            />
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-slate-300">
                <Video size={36} strokeWidth={1.5} />
                <p className="text-sm">Turn on your camera when you are ready.</p>
              </div>
            )}
            {isCameraActive && (
              <div
                role="status"
                aria-live="polite"
                className={`absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  faceStatus === "out-of-frame" || motionDetected || frameQuality === "unclear" || !isPageVisible
                    ? "bg-amber-400 text-amber-950"
                    : faceStatus === "error"
                      ? "bg-red-600 text-white"
                      : "bg-slate-900/75 text-white"
                }`}
              >
                {faceStatus === "out-of-frame" || faceStatus === "error" || frameQuality === "unclear" || !isPageVisible ? (
                  <AlertTriangle size={14} />
                ) : (
                  <Activity size={14} />
                )}
                {faceStatus === "loading"
                  ? "Starting face check..."
                  : faceStatus === "out-of-frame"
                    ? "Please stay in frame"
                    : faceStatus === "error"
                      ? "Face check unavailable"
                        : !isPageVisible
                          ? "Interview tab is inactive"
                        : frameQuality === "unclear"
                          ? "Camera image needs improvement"
                        : motionDetected
                        ? "Movement detected"
                        : faceStatus === "in-frame"
                          ? "Face in frame · watching for movement"
                          : "Watching for movement"}
              </div>
            )}
          </div>

          {isCameraActive && faceStatus === "out-of-frame" && (
            <p role="alert" className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
              Your face is missing, too close to an edge, or more than one person is visible. Centre yourself in the camera frame and continue alone.
            </p>
          )}
          {isCameraActive && frameQuality === "unclear" && (
            <p role="alert" className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
              The camera image looks unclear or poorly lit. Improve the lighting, clean the lens, and make sure your face and background are easy to see.
            </p>
          )}
          {isCameraActive && !isPageVisible && (
            <p role="alert" className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
              The interview page is not active. Return to this tab and keep it open while you answer.
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleCamera}
              disabled={isStarting}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition disabled:opacity-60 ${
                isCameraActive ? "bg-slate-800 hover:bg-slate-700" : "bg-emerald-700 hover:bg-emerald-600"
              }`}
            >
              {isStarting ? <Loader2 className="animate-spin" size={17} /> : isCameraActive ? <CameraOff size={17} /> : <Camera size={17} />}
              {isStarting ? "Starting camera" : isCameraActive ? "Turn camera off" : "Turn camera on"}
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={15} /> Camera is not shared or saved
            </span>
          </div>

          {cameraError && (
            <p role="alert" className="mt-3 text-sm text-red-700">{cameraError}</p>
          )}
          {motionError && (
            <p role="alert" className="mt-3 text-sm text-red-700">{motionError}</p>
          )}
          {qualityError && (
            <p role="alert" className="mt-3 text-sm text-red-700">{qualityError}</p>
          )}
          {faceError && (
            <p role="alert" className="mt-3 text-sm text-red-700">{faceError}</p>
          )}
        </section>

        <section className="flex min-h-136 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white" aria-label="Interview conversation">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-900">Interview conversation</h2>
            <p className="mt-1 text-xs text-slate-500">Listen to each question or dictate your answer with the microphone.</p>
          </div>
          <div className="min-h-92 flex-1 overflow-hidden">
            <ChatPanel />
          </div>
          <MessageInput />
        </section>
      </div>
    </main>
  );
}
