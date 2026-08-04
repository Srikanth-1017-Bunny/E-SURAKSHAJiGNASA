import React, { useRef, useState, useEffect } from 'react';
import { FaCamera, FaUpload, FaSync, FaTimes } from 'react-icons/fa';

const CameraCapture = ({ onCapture, onCancel }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        startCamera();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer back camera
            });
            streamRef.current = mediaStream;
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Unable to access camera. Please ensure permissions are granted or use upload instead.");
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
            onCapture(file);
        }, 'image/jpeg', 0.8);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onCapture(file);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 group">
            {/* Video Feed */}
            {!error ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-white bg-slate-900">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <FaTimes className="text-2xl" />
                    </div>
                    <p className="font-bold mb-6">{error}</p>
                    <label className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black cursor-pointer hover:bg-emerald-700 transition active:scale-95 flex items-center gap-2">
                        <FaUpload /> Select Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            )}

            {/* Scanning Grid Overlay */}
            {!error && stream && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-[1.5px] border-emerald-500/30 grid grid-cols-3 grid-rows-3 opacity-50">
                        {Array(9).fill(0).map((_, i) => <div key={i} className="border-[0.5px] border-emerald-500/20"></div>)}
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-emerald-500/50 to-transparent animate-scanLine h-0.5"></div>
                </div>
            )}

            {/* Controls Overlay */}
            {!error && stream && (
                <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
                    <button
                        onClick={onCancel}
                        className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all active:scale-90"
                    >
                        <FaTimes />
                    </button>

                    <button
                        onClick={capturePhoto}
                        className="w-20 h-20 bg-white p-1 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-2xl active:scale-95 border-4 border-emerald-500"
                    >
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-emerald-500">
                            <FaCamera className="text-2xl" />
                        </div>
                    </button>

                    <label className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all active:scale-90 cursor-pointer">
                        <FaUpload />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            )}

            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default CameraCapture;
