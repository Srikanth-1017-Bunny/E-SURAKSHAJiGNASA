import React from 'react';
import { FaCheckCircle, FaLeaf, FaCoins, FaInfoCircle, FaRecycle, FaArrowRight, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ScanResults = ({ result, onReset }) => {
    if (!result) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Captured Image Preview */}
                <div className="w-full md:w-1/3 shrink-0">
                    <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl skew-y-1">
                        <img
                            src={result.imageUrl}
                            alt="Captured item"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {result.confidence}% Match
                        </div>
                    </div>
                </div>

                {/* Analysis Data */}
                <div className="flex-grow space-y-6 pt-4">
                    <header>
                        <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-xs mb-2">Identification Complete</p>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">{result.detectedItem}</h2>
                        <div className="flex flex-wrap gap-2">
                            {result.materials.map((m, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                                    {m}
                                </span>
                            ))}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 text-emerald-100 text-7xl group-hover:scale-110 transition-transform">
                                <FaCoins />
                            </div>
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Potential Value</p>
                            <h4 className="text-3xl font-black text-emerald-600">{result.ecoPoints} <span className="text-sm">Eco-Coins</span></h4>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 text-indigo-100 text-7xl group-hover:scale-110 transition-transform">
                                <FaLeaf />
                            </div>
                            <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-1">Recycling Impact</p>
                            <h4 className="text-3xl font-black text-indigo-600">High</h4>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex gap-4 items-start">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shrink-0">
                            <FaInfoCircle className="text-xl" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 mb-1 leading-tight">Expert Tip</p>
                            <p className="text-sm text-slate-500 font-medium">{result.recyclingTip}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link
                    to={`/user/list-product?category=${result.detectedItem}&aiScan=true`}
                    className="flex-1 bg-slate-900 text-white rounded-2xl py-5 px-8 font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-2xl shadow-slate-200 active:scale-[0.98]"
                >
                    List for Recycling <FaArrowRight />
                </Link>
                <button
                    onClick={onReset}
                    className="sm:w-auto bg-white border-2 border-slate-100 text-slate-500 rounded-2xl py-5 px-10 font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition active:scale-[0.98]"
                >
                    <FaRedo /> New Scan
                </button>
            </div>
        </div>
    );
};

export default ScanResults;
