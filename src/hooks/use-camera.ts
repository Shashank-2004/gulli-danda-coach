import { useRef, useState, useCallback, useEffect } from "react";

function getCameraErrorMessage(error: unknown) {
  const err = error as { name?: string };

  if (err?.name === "NotAllowedError") {
    return "Camera permission denied. Please enable it in your browser settings.";
  }

  if (err?.name === "NotFoundError") {
    return "Camera not available on this device.";
  }

  if (err?.name === "NotReadableError") {
    return "Camera is already in use by another application.";
  }

  return "Failed to start camera. Please try again.";
}

export function useCamera(activeKey: string | null) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    requestIdRef.current += 1;
    stopStream();
    setIsActive(false);
    setIsLoading(false);
  }, [stopStream]);

  const startCamera = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    stopStream();
    setIsActive(false);
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API unavailable");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("Video element not ready");
      }

      streamRef.current = stream;
      video.srcObject = stream;
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;

      if (video.readyState < 1) {
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve();
        });
      }

      await video.play();

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      setIsActive(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Camera Error:", err);

      if (requestId !== requestIdRef.current) {
        return;
      }

      stopStream();
      setIsActive(false);
      setIsLoading(false);
      setError(getCameraErrorMessage(err));
    }
  }, [stopStream]);

  useEffect(() => {
    if (!activeKey) {
      stopCamera();
      return;
    }

    void startCamera();

    return () => {
      stopCamera();
    };
  }, [activeKey, startCamera, stopCamera]);

  return {
    videoRef,
    isActive,
    isLoading,
    error,
    startCamera,
    stopCamera,
  };
}
