"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, Users, X } from "lucide-react";

type MonitorStatus = { tone: "good" | "warning"; message: string };

function isFrameBlurry(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const width = 96;
  const height = 72;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return false;
  context.drawImage(video, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const luminance = new Float32Array(width * height);
  let sum = 0;
  for (let index = 0; index < luminance.length; index += 1) {
    const offset = index * 4;
    const value = 0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2];
    luminance[index] = value;
    sum += value;
  }
  const brightness = sum / luminance.length;
  if (brightness < 35) return true;

  let laplacianSum = 0;
  let laplacianSquareSum = 0;
  let samples = 0;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const laplacian = 4 * luminance[index] - luminance[index - 1] - luminance[index + 1] - luminance[index - width] - luminance[index + width];
      laplacianSum += laplacian;
      laplacianSquareSum += laplacian * laplacian;
      samples += 1;
    }
  }
  const variance = laplacianSquareSum / samples - (laplacianSum / samples) ** 2;
  return variance < 22;
}

export default function VideoPanel({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<MonitorStatus>({ tone: "good", message: "Camera monitor is starting…" });

  useEffect(() => {
    let stream: MediaStream | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
    let detector: { detectForVideo: (video: HTMLVideoElement, timestamp: number) => { detections: Array<{ boundingBox?: { originX: number; originY: number; width: number; height: number } }> }; close?: () => void } | undefined;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;

        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm");
        detector = await vision.FaceDetector.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.55,
        });

        intervalId = setInterval(() => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (!video || !canvas || !detector || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
          const faces = detector.detectForVideo(video, performance.now()).detections;
          if (faces.length === 0) {
            setStatus({ tone: "warning", message: "Face not detected — move into the camera frame." });
            return;
          }
          if (faces.length > 1) {
            setStatus({ tone: "warning", message: "More than one face detected — continue the interview alone." });
            return;
          }
          const box = faces[0].boundingBox;
          if (box) {
            const centerX = (box.originX + box.width / 2) / video.videoWidth;
            const centerY = (box.originY + box.height / 2) / video.videoHeight;
            const faceIsSmall = box.width / video.videoWidth < 0.16;
            if (faceIsSmall || centerX < 0.22 || centerX > 0.78 || centerY < 0.18 || centerY > 0.82) {
              setStatus({ tone: "warning", message: "You are out of frame — centre your face and move a little closer." });
              return;
            }
          }
          if (isFrameBlurry(video, canvas)) {
            setStatus({ tone: "warning", message: "Camera image looks unclear — improve lighting or clean the lens." });
            return;
          }
          setStatus({ tone: "good", message: "Face is visible and the camera frame looks clear." });
        }, 1800);
      } catch {
        setStatus({ tone: "warning", message: "Camera access was not available. You can continue the text interview." });
      }
    };

    startCamera();
    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      detector?.close?.();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const isWarning = status.tone === "warning";
  return (
    <aside className="absolute right-5 top-5 z-20 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><span className="inline-flex items-center gap-2 text-sm font-bold text-[#102a43]"><Camera size={16} className="text-teal-600" /> Practice camera</span><button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close camera preview"><X size={17} /></button></div>
      <div className="relative aspect-video bg-slate-950"><video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" /><canvas ref={canvasRef} className="hidden" /></div>
      <div className={`flex gap-2 px-4 py-3 text-xs leading-5 ${isWarning ? "bg-amber-50 text-amber-800" : "bg-teal-50 text-teal-800"}`}>{isWarning ? <AlertTriangle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}<span>{status.message}</span></div>
      <div className="flex items-center gap-2 px-4 py-2.5 text-[11px] text-slate-500"><Users size={13} /> Camera analysis stays in this browser.</div>
    </aside>
  );
}
