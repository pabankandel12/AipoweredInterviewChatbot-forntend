"use client";

import { useEffect, useRef } from "react";

export default function VideoPanel() {
  const videoRef = useRef<HTMLVideoElement | null>(
    null
  );

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
      }
    };

    startCamera();
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
}