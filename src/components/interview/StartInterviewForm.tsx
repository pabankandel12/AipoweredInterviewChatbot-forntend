"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useInterviewStore from "@/store/interviewStore";
import { startInterview } from "@/lib/api";
import { FileText, AlertCircle, Loader2, Award, FileUp, MessageSquareText, Video } from "lucide-react";

export default function StartInterviewForm() {
  const router = useRouter();

  const setSession = useInterviewStore((state) => state.setSession);

  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [interviewMode, setInterviewMode] = useState<"text" | "video">("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    const isPdf = fileType === "application/pdf";
    const isDocx = selectedFile.name.endsWith(".docx") || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isPdf && !isDocx) {
      setError("Only PDF and DOCX resume formats are supported");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload your CV resume");
      return;
    }

    if (!jdText.trim()) {
      setError("Please enter the job description");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("Starting interview session...");
      const data = await startInterview(file, jdText, difficulty);

      // Store session ID in Zustand store
      setSession(data.interviewId);

      // Store first question in localStorage for page bootstrap
      if (data.firstQuestion) {
        localStorage.setItem("firstQuestion", data.firstQuestion);
      }

      router.push(interviewMode === "video" ? "/interview/live" : "/interview");
    } catch (err: unknown) {
      console.error(err);
      const apiMessage = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(
        apiMessage ||
          "Something went wrong while initializing the AI session. Make sure the AI microservice is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl space-y-6"
    >
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* CV Upload Dropzone */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Upload CV / Resume
        </label>
        
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition duration-200 ${
            file 
              ? "border-emerald-500 bg-emerald-50/10" 
              : "border-slate-300 hover:border-blue-500 hover:bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden"
          />

          {file ? (
            <div className="space-y-2 flex flex-col items-center">
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 line-clamp-1 max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                </p>
              </div>
              <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                Change file
              </span>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <div className="rounded-full bg-slate-100 p-3 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition duration-200">
                <FileUp size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Drag & drop your resume, or <span className="text-blue-600 group-hover:underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF or DOCX up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Description Field */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Job Description (JD)
        </label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-slate-200 p-4 text-sm placeholder-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Paste the target job description here to align the questions and match score..."
        />
      </div>

      {/* Difficulty Level & Target */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Interview format
        </label>
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Interview format">
          <button
            type="button"
            onClick={() => setInterviewMode("text")}
            aria-pressed={interviewMode === "text"}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition ${
              interviewMode === "text"
                ? "border-blue-700 bg-blue-50 text-blue-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MessageSquareText size={17} /> Text interview
          </button>
          <button
            type="button"
            onClick={() => setInterviewMode("video")}
            aria-pressed={interviewMode === "video"}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition ${
              interviewMode === "video"
                ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Video size={17} /> Live video interview
          </button>
        </div>
        {interviewMode === "video" && (
          <p className="text-xs text-slate-500">Camera access is requested after the interview starts. Video stays on this device and is not recorded.</p>
        )}
      </div>

      {/* Difficulty Level & Target */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["easy", "medium", "hard"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`rounded-2xl py-3.5 text-sm font-bold border capitalize transition duration-200 ${
                difficulty === level
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md shadow-indigo-500/10"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-500/10 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/20 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Analyzing Resume & Generating AI Questions...
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Award size={18} />
            {interviewMode === "video" ? "Generate & Start Live Interview" : "Generate Interview"}
          </span>
        )}
      </button>
    </form>
  );
}