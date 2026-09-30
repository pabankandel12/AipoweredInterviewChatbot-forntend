"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useCamera() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	const [cameraError, setCameraError] = useState("");

	const stopCamera = useCallback(() => {
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		if (videoRef.current) videoRef.current.srcObject = null;
		setIsCameraActive(false);
	}, []);

	const startCamera = useCallback(async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			setCameraError("Camera access requires a supported browser and a secure connection.");
			return;
		}

		setCameraError("");
		setIsStarting(true);

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user" },
				audio: false,
			});
			streamRef.current = stream;

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
			}

			setIsCameraActive(true);
		} catch (error) {
			streamRef.current?.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
			const errorName = error instanceof DOMException ? error.name : "";
			setCameraError(
				errorName === "NotAllowedError" || errorName === "SecurityError"
					? "Camera access was denied. Allow camera access in your browser settings and try again."
					: errorName === "NotFoundError"
						? "No camera was found on this device. You can continue without video."
						: "Could not start the camera. Check that it is connected and try again.",
			);
		} finally {
			setIsStarting(false);
		}
	}, []);

	useEffect(() => {
		return () => {
			streamRef.current?.getTracks().forEach((track) => track.stop());
		};
	}, []);

	const toggleCamera = () => {
		if (isCameraActive) {
			stopCamera();
		} else {
			void startCamera();
		}
	};

	return {
		videoRef,
		isCameraActive,
		isStarting,
		cameraError,
		toggleCamera,
	};
}
