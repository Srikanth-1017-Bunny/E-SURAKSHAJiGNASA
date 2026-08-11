import React, { useState } from 'react';
import { Download, Filter, Search, BarChart, FileText, Bell, CheckCircle } from 'lucide-react';

const HeaderPanel = ({ title, desc }) => (
    <div className="bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-black text-slate-800">{title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
        </div>
        <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2">
            <Download size={14} /> Export Data
        </button>
    </div>
);

export const GovReportsPage = () => (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <HeaderPanel title="E-Waste Generation Reports" desc="Monthly generation and collection metrics" />
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Recent Reports</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Search reports..." className="pl-9 pr-4 py-2 border rounded-lg text-sm outline-none" />
                </div>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr><th className="p-4 rounded-tl-lg">Report Name</th><th className="p-4">Date Generated</th><th className="p-4">Size</th><th className="p-4 rounded-tr-lg">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3].map(i => (
                        <tr key={i} className="hover:bg-slate-50">
                            <td className="p-4 font-medium">Q{i} E-Waste Collection Analysis.pdf</td>
                            <td className="p-4">August {i * 5}, 2026</td>
                            <td className="p-4">{(Math.random() * 5 + 1).toFixed(1)} MB</td>
                            <td className="p-4 text-blue-600 font-medium cursor-pointer">Download</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const GovAnalyticsPage = () => (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <HeaderPanel title="AI Predictive Analytics" desc="E-Waste forecasts and predictive insights" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><BarChart size={18} className="text-emerald-500" /> Projection (Next 30 Days)</h3>
                <div className="h-48 flex items-end justify-between px-2 gap-2">
                    {[40, 60, 45, 80, 50, 90, 75].map((h, i) => (
                        <div key={i} className="w-full bg-emerald-100 rounded-t-sm relative group hover:bg-emerald-500 transition-colors" style={{ height: `${h}%` }}>
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100">{h}kg</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 text-center">Expected 15% increase in Mobile recycling</div>
            </div>
            <div className="bg-indigo-900 rounded-2xl shadow-sm p-8 text-white">
                <h3 className="font-bold text-indigo-100 mb-4">Insight Confidence Limit</h3>
                <p className="text-4xl font-black text-white mb-2">94.2%</p>
                <p className="text-indigo-200 text-sm leading-relaxed mb-6">Our Vision Model suggests a high influx of laptop and PC disposal in the IT corridor zones over the next weekend based on current trends.</p>
                <button className="px-4 py-2 bg-indigo-500/30 text-indigo-100 rounded-lg text-sm font-bold border border-indigo-400 hover:bg-indigo-500/50">Recalibrate Model</button>
            </div>
        </div>
    </div>
);

export const GovRecyclersPage = () => (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <HeaderPanel title="Certified Recyclers" desc="Manage active partner facilities" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['GreenEarth India', 'TechScrap Solutions', 'EcoRecycle Corp'].map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center font-bold text-emerald-600 border border-emerald-100">{r[0]}</div>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">ACTIVE</span>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{r}</h3>
                    <p className="text-xs text-slate-500 mb-4">Authorized capacity: {500 + i * 200} tons/month</p>
                    <button className="w-full py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100">View Audits</button>
                </div>
            ))}
        </div>
    </div>
);

export const GovNotificationsPage = () => (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <HeaderPanel title="System Notifications" desc="Alerts and broadcasts" />
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-6 border-b border-slate-50 hover:bg-slate-50 flex gap-4">
                    <div className="mt-1"><Bell size={18} className="text-blue-500" /></div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Zone {i} Target Reached</h4>
                        <p className="text-xs text-slate-500 mt-1">Collection target for Zone {i} exceeded daily minimum by 20%.</p>
                        <span className="text-[10px] text-slate-400 font-bold block mt-3 uppercase">2 hours ago</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const GovSettingsPage = () => (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
        <HeaderPanel title="Platform Settings" desc="System configuration and parameters" />
        <div className="bg-white rounded-2xl border border-slate-100 p-8 max-w-2xl">
            <h3 className="font-bold text-slate-800 mb-6 border-b pb-4">Reward Rates (Eco Points)</h3>
            <div className="space-y-4">
                {['Base Multiplier', 'Peak Hour Surge', 'Collector Commission'].map(s => (
                    <div key={s} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <span className="text-sm font-semibold text-slate-700">{s}</span>
                        <input type="text" defaultValue="1.0x" className="w-20 text-center px-2 py-1 border rounded bg-white text-sm" />
                    </div>
                ))}
                <button className="w-full mt-4 py-3 bg-[#2563eb] text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700">Save Configuration</button>
            </div>
        </div>
    </div>
);

