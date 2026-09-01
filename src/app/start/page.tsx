"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StartInterviewForm from "@/components/interview/StartInterviewForm";
import { Loader2 } from "lucide-react";

export default function StartPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-sm font-medium text-slate-500">Authenticating session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center px-6 pt-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl tracking-tight">
          Start Your AI Interview
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600 text-base">
          Upload your CV (PDF or DOCX), paste a job description, and practice real-world
          interview questions powered by AI. Get detailed scores and instant feedback.
        </p>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          <StartInterviewForm />
        </div>
      </div>

      {/* Footer Note */}
      <div className="pb-10 text-center text-sm text-gray-400 font-medium">
        Powered by AI Interview Engine • Practice Anytime, Anywhere
      </div>
    </div>
  );
}