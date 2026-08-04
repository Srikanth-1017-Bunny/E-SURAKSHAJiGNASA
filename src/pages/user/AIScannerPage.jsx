import React, { useState } from 'react';
import { useAIScan } from '../../hooks/useAIScan';
import CameraCapture from '../../components/scanner/CameraCapture';
import ScanResults from '../../components/scanner/ScanResults';
import { FaRecycle, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AIScannerPage = () => {
    const { status, result, error, scanImage, resetScan } = useAIScan();
    const [isScanning, setIsScanning] = useState(false);

    const handleCapture = (file) => {
        setIsScanning(false);
        scanImage(file);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <Link to="/user/home" className="p-3 bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm active:scale-95">
                        <FaArrowLeft />
                    </Link>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 justify-center">
                            AI <span className="text-emerald-600">Vision</span> Scanner
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">E-Waste Identification Protocol</p>
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                </header>

                <main className="relative">
                    {/* Idle State / Initial View */}
                    {status === 'idle' && !isScanning && (
                        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fadeIn">
                            <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/20">
                                <FaRecycle className="text-5xl animate-spin-slow" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Identify Your <span className="text-emerald-600 underline decoration-emerald-500/30">E-Waste</span></h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                Our AI system identifies components, estimates their environmental impact, and calculates Eco-Points in seconds.
                            </p>
                            <button
                                onClick={() => setIsScanning(true)}
                                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg hover:bg-slate-800 transition shadow-2xl shadow-slate-200 active:scale-[0.98]"
                            >
                                Start Scanning
                            </button>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by GreenTech Computer Vision</p>
                        </div>
                    )}

                    {/* Camera Active State */}
                    {isScanning && (
                        <div className="animate-fadeIn">
                            <CameraCapture
                                onCapture={handleCapture}
                                onCancel={() => setIsScanning(false)}
                            />
                        </div>
                    )}

                    {/* Processing State */}
                    {(status === 'uploading' || status === 'analyzing') && (
                        <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-fadeIn">
                            <div className="relative w-40 h-40 mx-auto mb-10">
                                <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-8 border-t-emerald-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaSpinner className="text-4xl text-emerald-500 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                                {status === 'uploading' ? 'Transmitting Data...' : 'AI Analyzing...'}
                            </h3>
                            <div className="max-w-md mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full bg-emerald-500 transition-all duration-1000 ${status === 'analyzing' ? 'w-full' : 'w-1/2'}`}></div>
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verifying with core network</p>
                        </div>
                    )}

                    {/* Results State */}
                    {status === 'completed' && (
                        <ScanResults
                            result={result}
                            onReset={resetScan}
                        />
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="max-w-2xl mx-auto text-center py-20 animate-fadeIn">
                            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaRecycle className="text-3xl rotate-45" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Scanner Interrupted</h3>
                            <p className="text-slate-500 mb-8 font-medium">{error}</p>
                            <button
                                onClick={resetScan}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition active:scale-95"
                            >
                                Reinitialize Scanner
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AIScannerPage;
