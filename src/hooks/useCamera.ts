"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FaceStatus = "off" | "loading" | "in-frame" | "out-of-frame" | "error";
export type FrameQuality = "checking" | "clear" | "unclear";

const faceModelUrl =
	"https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";
const visionWasmUrl =
	"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";

export default function useCamera() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	const [cameraError, setCameraError] = useState("");
	const [motionDetected, setMotionDetected] = useState(false);
	const [motionError, setMotionError] = useState("");
	const [qualityError, setQualityError] = useState("");
	const [faceStatus, setFaceStatus] = useState<FaceStatus>("off");
	const [faceError, setFaceError] = useState("");
	const [frameQuality, setFrameQuality] = useState<FrameQuality>("checking");
	const [isPageVisible, setIsPageVisible] = useState(true);

	const stopCamera = useCallback(() => {
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		if (videoRef.current) videoRef.current.srcObject = null;
		setMotionDetected(false);
		setMotionError("");
		setQualityError("");
		setFaceStatus("off");
		setFaceError("");
		setFrameQuality("checking");
		setIsCameraActive(false);
	}, []);

	const startCamera = useCallback(async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			setCameraError("Camera access requires a supported browser and a secure connection.");
			return;
		}

		setCameraError("");
		setMotionDetected(false);
		setMotionError("");
		setQualityError("");
		setFaceStatus("loading");
		setFaceError("");
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
			setFaceStatus("off");
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

	useEffect(() => {
		const updatePageVisibility = () => {
			setIsPageVisible(document.visibilityState === "visible" && document.hasFocus());
		};
		const handleWindowFocus = () => setIsPageVisible(document.visibilityState === "visible");
		const handleWindowBlur = () => setIsPageVisible(false);

		updatePageVisibility();
		document.addEventListener("visibilitychange", updatePageVisibility);
		window.addEventListener("focus", handleWindowFocus);
		window.addEventListener("blur", handleWindowBlur);

		return () => {
			document.removeEventListener("visibilitychange", updatePageVisibility);
			window.removeEventListener("focus", handleWindowFocus);
			window.removeEventListener("blur", handleWindowBlur);
		};
	}, []);

	useEffect(() => {
		if (!isCameraActive) return;

		const video = videoRef.current;
		if (!video) return;

		let disposed = false;
		let faceDetector: { close: () => void } | null = null;
		let faceInterval: ReturnType<typeof setInterval> | undefined;
		let lastFaceStatus: "in-frame" | "out-of-frame" | null = null;

		const canvas = document.createElement("canvas");
		canvas.width = 64;
		canvas.height = 36;
		const context = canvas.getContext("2d", { willReadFrequently: true });

		let previousFrame: Uint8ClampedArray | null = null;
		let motionTimeout: ReturnType<typeof setTimeout> | undefined;
		let unclearSamples = 0;
		let clearSamples = 0;

		const sampleFrame = () => {
			if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
			if (!context) {
				setMotionError("Motion detection is unavailable in this browser.");
				clearInterval(sampleInterval);
				return;
			}

			try {
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				const frame = context.getImageData(0, 0, canvas.width, canvas.height).data;

				if (previousFrame) {
					let changedPixels = 0;
					for (let index = 0; index < frame.length; index += 4) {
						const currentLuminance =
							(frame[index] * 0.299) +
							(frame[index + 1] * 0.587) +
							(frame[index + 2] * 0.114);
						const previousLuminance =
							(previousFrame[index] * 0.299) +
							(previousFrame[index + 1] * 0.587) +
							(previousFrame[index + 2] * 0.114);

						if (Math.abs(currentLuminance - previousLuminance) > 28) {
							changedPixels += 1;
						}
					}

					const changedPixelRatio = changedPixels / (canvas.width * canvas.height);
					if (changedPixelRatio > 0.035) {
						setMotionDetected(true);
						if (motionTimeout) clearTimeout(motionTimeout);
						motionTimeout = setTimeout(() => setMotionDetected(false), 1500);
					}
				}

				previousFrame = new Uint8ClampedArray(frame);
			} catch {
				setMotionError("Could not analyze camera frames for motion.");
				clearInterval(sampleInterval);
			}
		};
		const sampleInterval = setInterval(sampleFrame, 300);

		const sampleQuality = () => {
			if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

			const qualityCanvas = document.createElement("canvas");
			qualityCanvas.width = 120;
			qualityCanvas.height = 68;
			const qualityContext = qualityCanvas.getContext("2d", { willReadFrequently: true });
			if (!qualityContext) return;

			try {
				qualityContext.drawImage(video, 0, 0, qualityCanvas.width, qualityCanvas.height);
				const { data } = qualityContext.getImageData(0, 0, qualityCanvas.width, qualityCanvas.height);
				let totalLuminance = 0;
				const luminance = new Float32Array(qualityCanvas.width * qualityCanvas.height);

				for (let pixel = 0; pixel < luminance.length; pixel += 1) {
					const offset = pixel * 4;
					luminance[pixel] =
						data[offset] * 0.299 +
						data[offset + 1] * 0.587 +
						data[offset + 2] * 0.114;
					totalLuminance += luminance[pixel];
				}

				let laplacianTotal = 0;
				let laplacianSquaredTotal = 0;
				let sampleCount = 0;
				for (let y = 1; y < qualityCanvas.height - 1; y += 1) {
					for (let x = 1; x < qualityCanvas.width - 1; x += 1) {
						const index = y * qualityCanvas.width + x;
						const laplacian =
							luminance[index - 1] +
							luminance[index + 1] +
							luminance[index - qualityCanvas.width] +
							luminance[index + qualityCanvas.width] -
							4 * luminance[index];
						laplacianTotal += laplacian;
						laplacianSquaredTotal += laplacian * laplacian;
						sampleCount += 1;
					}
				}

				const averageLuminance = totalLuminance / luminance.length;
				const averageLaplacian = laplacianTotal / sampleCount;
				const sharpness =
					laplacianSquaredTotal / sampleCount - averageLaplacian * averageLaplacian;
				const isUnclear = averageLuminance < 35 || averageLuminance > 235 || sharpness < 20;

				if (isUnclear) {
					unclearSamples += 1;
					clearSamples = 0;
					if (unclearSamples >= 2) setFrameQuality("unclear");
				} else {
					clearSamples += 1;
					unclearSamples = 0;
					if (clearSamples >= 2) setFrameQuality("clear");
				}
			} catch {
				setQualityError("Could not analyze camera image quality.");
				if (qualityInterval) clearInterval(qualityInterval);
			}
		};
		const qualityInterval = setInterval(sampleQuality, 1200);

		const startFaceDetection = async () => {
			try {
				// Load the computer-vision bundle only after the user turns on the
				// camera. Loading it at route render time can crash some browsers.
				const vision = await import("@mediapipe/tasks-vision");
				const visionFiles = await vision.FilesetResolver.forVisionTasks(visionWasmUrl);
				if (disposed) return;

				const detector = await vision.FaceDetector.createFromOptions(visionFiles, {
					baseOptions: { modelAssetPath: faceModelUrl },
					runningMode: "VIDEO",
					minDetectionConfidence: 0.5,
				});
				if (disposed) {
					detector.close();
					return;
				}

				faceDetector = detector;
				const detectFace = () => {
					if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

					try {
					const detections = detector.detectForVideo(video, performance.now()).detections;
					const face = detections[0]?.boundingBox;
					const centerX = face ? (face.originX + face.width / 2) / video.videoWidth : 0;
					const centerY = face ? (face.originY + face.height / 2) / video.videoHeight : 0;
					const isOutOfFrame = detections.length !== 1 || !face || face.width / video.videoWidth < 0.16 || centerX < 0.22 || centerX > 0.78 || centerY < 0.18 || centerY > 0.82;
					const nextStatus = isOutOfFrame ? "out-of-frame" : "in-frame";
						if (nextStatus !== lastFaceStatus) {
							lastFaceStatus = nextStatus;
							setFaceStatus(nextStatus);
						}
					} catch {
						setFaceError("Could not check whether your face is in the camera frame.");
						setFaceStatus("error");
						if (faceInterval) clearInterval(faceInterval);
					}
				};

				detectFace();
				faceInterval = setInterval(detectFace, 500);
			} catch {
				if (!disposed) {
					setFaceError("Face detection could not start. Check your internet connection and try again.");
					setFaceStatus("error");
				}
			}
		};

		void startFaceDetection();

		return () => {
			disposed = true;
			clearInterval(sampleInterval);
			if (qualityInterval) clearInterval(qualityInterval);
			if (motionTimeout) clearTimeout(motionTimeout);
			if (faceInterval) clearInterval(faceInterval);
			faceDetector?.close();
		};
	}, [isCameraActive]);

	return {
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
	};
}
