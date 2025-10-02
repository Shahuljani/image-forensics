import React, { useRef, useState } from "react";

export default function CameraCapture({ onCapture }){
  const videoRef = useRef();
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStreaming(true);
    } catch (e){
      alert("Camera access denied or not available.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      onCapture(file);
      // stop after capture
      stopCamera();
    }, "image/jpeg", 0.95);
  };

  return (
    <div className="p-4 border rounded-lg flex flex-col items-center">
      <div className="mb-2">📷 Camera</div>
      <video ref={videoRef} className="w-full h-48 bg-black rounded mb-3" />
      <div className="flex gap-2">
        {!streaming ? (
          <button onClick={startCamera} className="px-3 py-2 rounded bg-green-600 text-white">Open Camera</button>
        ) : (
          <>
            <button onClick={capture} className="px-3 py-2 rounded bg-indigo-600 text-white">Capture</button>
            <button onClick={stopCamera} className="px-3 py-2 rounded bg-red-500 text-white">Close</button>
          </>
        )}
      </div>
    </div>
  );
}
