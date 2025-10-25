import React, { useRef, useState, useEffect } from "react";
import { Camera, Download, RefreshCw, X, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Photobooth() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(null);

  // Coffee-themed frames/filters
  const frames = [
    { id: "none", name: "No Frame", preview: "bg-gray-100" },
    { id: "coffee", name: "Coffee Cup", preview: "bg-amber-100" },
    { id: "latte", name: "Latte Art", preview: "bg-orange-100" },
    { id: "beans", name: "Coffee Beans", preview: "bg-yellow-100" },
  ];

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera is not supported in this browser. Please use Chrome, Firefox, or Edge.");
        return;
      }

      console.log("🎥 Requesting camera access...");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      
      console.log("✅ Camera access granted!");
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (err) {
      console.error("❌ Error accessing camera:", err);
      
      let errorMessage = "Unable to access camera. ";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage += "Please allow camera permissions in your browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage += "No camera found on this device.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage += "Camera is already in use by another application.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage += "Camera doesn't support the requested resolution.";
      } else if (err.name === "SecurityError") {
        errorMessage += "Camera access is blocked. Make sure you're using HTTPS or localhost.";
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }
      
      setError(errorMessage);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraOn(false);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply frame/filter
    applyFrame(context, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
  };

  // Apply frame overlay
  const applyFrame = (context, width, height) => {
    if (selectedFrame === "none") return;

    // Draw frame border
    const borderWidth = 40;
    context.strokeStyle = getFrameColor(selectedFrame);
    context.lineWidth = borderWidth;
    context.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);

    // Add text overlay
    context.fillStyle = getFrameColor(selectedFrame);
    context.font = "bold 48px Arial";
    context.textAlign = "center";
    context.fillText("☕ Atlas Coffee ☕", width / 2, height - 60);
  };

  // Get frame color
  const getFrameColor = (frameId) => {
    const colors = {
      coffee: "#6B4226",
      latte: "#D4A574",
      beans: "#8B6F47",
    };
    return colors[frameId] || "#6B4226";
  };

  // Download photo
  const downloadPhoto = () => {
    if (!capturedImage) return;

    const link = document.createElement("a");
    link.download = `atlas-coffee-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="h-screen bg-[#E2E1E6] p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4 w-full shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#6B4226] flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Photobooth</h1>
              <p className="text-sm text-gray-500">Capture your coffee moment</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="p-2 rounded-lg hover:bg-white transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 w-full flex-1 overflow-hidden">
        {/* Left Side - Single Camera View */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col h-full">
            {/* Single Camera View */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 flex-1">
              {!isCameraOn && !capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Start camera to take a photo</p>
                  </div>
                </div>
              )}
              {isCameraOn && !capturedImage && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Controls */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              {!isCameraOn && !capturedImage && (
                <>
                  <button
                    onClick={startCamera}
                    className="px-6 py-2.5 bg-[#6B4226] text-white rounded-lg hover:bg-[#55331f] transition flex items-center gap-2 text-sm font-medium"
                  >
                    <Camera className="h-4 w-4" />
                    Start Camera
                  </button>
                  {error ? (
                    <p className="text-red-500 text-xs text-center max-w-md">{error}</p>
                  ) : (
                    <p className="text-gray-500 text-[10px] text-center">
                      Click "Start Camera" and allow camera access when prompted
                    </p>
                  )}
                </>
              )}

              {isCameraOn && !capturedImage && (
                <>
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-2.5 bg-[#6B4226] text-white rounded-lg hover:bg-[#55331f] transition flex items-center gap-2 text-sm font-medium"
                  >
                    <Camera className="h-4 w-4" />
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                  >
                    Stop
                  </button>
                </>
              )}

              {capturedImage && (
                <>
                  <button
                    onClick={downloadPhoto}
                    className="px-6 py-2.5 bg-[#6B4226] text-white rounded-lg hover:bg-[#55331f] transition flex items-center gap-2 text-sm font-medium"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={retakePhoto}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm font-medium"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retake
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Frame Selection & Info */}
        <div className="space-y-3 overflow-y-auto">
          {/* Frame Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Frame Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {frames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`p-2 rounded-lg border-2 transition ${
                    selectedFrame === frame.id
                      ? "border-[#6B4226] bg-[#6B4226]/5"
                      : "border-gray-200 hover:border-[#6B4226]/30"
                  }`}
                >
                  <div className={`h-10 rounded-md ${frame.preview} mb-1`}></div>
                  <p className="text-[9px] font-medium text-gray-700">{frame.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">📸 Tips</h3>
            <ul className="text-[10px] text-gray-600 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#6B4226] mt-0.5">•</span>
                <span>Make sure you're on <strong>localhost</strong> or <strong>HTTPS</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B4226] mt-0.5">•</span>
                <span>Allow camera permissions when browser asks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B4226] mt-0.5">•</span>
                <span>Use good lighting for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B4226] mt-0.5">•</span>
                <span>Choose frame before capturing</span>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-[#6B4226] to-[#8B6F47] rounded-2xl shadow-sm p-4 text-white">
            <h3 className="text-xs font-semibold mb-1.5">How it works</h3>
            <p className="text-[10px] text-white/90 leading-relaxed">
              Each photo captures the same moment in all 4 frames. Perfect for creating a 2x2 photo strip!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
