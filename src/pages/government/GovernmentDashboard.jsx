import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import {
    Users, Activity, CheckCircle,
    MapPin, FileText, AlertTriangle,
    Bell, Coins, TrendingUp, Zap
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// ── Leaflet icon fix ─────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const makeMapIcon = (color = '#3b82f6') => new L.DivIcon({
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"></div>`,
    className: 'custom-div-icon',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

const formatTime = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const GovernmentDashboard = () => {
    const navigate = useNavigate();

    // Live data states
    const [activePickups, setActivePickups] = useState([]);
    const [completedPickups, setCompletedPickups] = useState([]);
    const [pendingTickets, setPendingTickets] = useState([]);
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);

    const mapCenter = [17.3850, 78.4867]; // Hyderabad default

    // ── Real-time: Active (Assigned) assignments ──────────────────────────────
    useEffect(() => {
        const q = query(collection(db, 'assignments'), where('status', '==', 'Assigned'));
        const unsub = onSnapshot(q, (snap) => {
            setActivePickups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    // ── Real-time: Completed assignments ─────────────────────────────────────
    useEffect(() => {
        const q = query(collection(db, 'assignments'), where('status', '==', 'Completed'));
        const unsub = onSnapshot(q, (snap) => {
            setCompletedPickups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    // ── Real-time: Pending (Submitted) tickets ────────────────────────────────
    useEffect(() => {
        const q = query(collection(db, 'tickets'), where('status', '==', 'Submitted'));
        const unsub = onSnapshot(q, (snap) => {
            setPendingTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    // ── Real-time: Pending Withdrawals ────────────────────────────────
    useEffect(() => {
        const q = query(collection(db, 'withdrawalRequests'), where('status', '==', 'Pending'));
        const unsub = onSnapshot(q, (snap) => {
            setPendingWithdrawals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const handleApproveWithdrawal = async (id) => {
        try {
            await updateDoc(doc(db, 'withdrawalRequests', id), {
                status: 'Approved',
                processedAt: serverTimestamp()
            });
        } catch (e) {
            console.error('Error approving withdrawal:', e);
        }
    };

    const handleRejectWithdrawal = async (id) => {
        try {
            await updateDoc(doc(db, 'withdrawalRequests', id), {
                status: 'Rejected',
                processedAt: serverTimestamp()
            });
        } catch (e) {
            console.error('Error rejecting withdrawal:', e);
        }
    };

    // Derive map markers from active pickups that have coordinates
    const mapMarkers = activePickups
        .filter(a => a.ticketLocation?.lat && a.ticketLocation?.lng)
        .map(a => ({
            lat: a.ticketLocation.lat,
            lng: a.ticketLocation.lng,
            label: `${a.item} — ${a.collectorName || 'Collector'}`,
            priority: a.priority,
        }));

    // Today's completed pickups (same calendar day)
    const todayStr = new Date().toDateString();
    const todaysCompleted = completedPickups.filter(a => {
        if (!a.completedAt) return false;
        const d = a.completedAt.seconds ? new Date(a.completedAt.seconds * 1000) : new Date(a.completedAt);
        return d.toDateString() === todayStr;
    });

    const kpis = [
        {
            label: 'Active Pickups',
            value: activePickups.length,
            icon: <Activity size={24} className="text-blue-500" />,
            bg: 'bg-blue-50',
            sub: 'Live right now',
            subColor: 'text-blue-500',
        },
        {
            label: 'Pending Requests',
            value: pendingTickets.length,
            icon: <FileText size={24} className="text-amber-500" />,
            bg: 'bg-amber-50',
            sub: 'Awaiting verification',
            subColor: 'text-amber-500',
        },
        {
            label: 'Today\'s Completed',
            value: todaysCompleted.length,
            icon: <CheckCircle size={24} className="text-emerald-500" />,
            bg: 'bg-emerald-50',
            sub: 'OTP verified',
            subColor: 'text-emerald-500',
        },
        {
            label: 'Total Completed',
            value: completedPickups.length,
            icon: <TrendingUp size={24} className="text-indigo-500" />,
            bg: 'bg-indigo-50',
            sub: 'All time',
            subColor: 'text-indigo-500',
        },
        {
            label: 'Green Coins Credited',
            value: completedPickups.reduce((s, a) => s + (a.estimatedValue || 0), 0),
            icon: <span className="text-2xl">🟢</span>,
            bg: 'bg-teal-50',
            sub: 'Auto after OTP verify',
            subColor: 'text-teal-600',
        },
    ];

    return (
        <div className="space-y-6">

            {/* ── Header ─────────────────────────────────────────────── */}
            <header className="flex items-center justify-between bg-gradient-to-r from-emerald-900 to-teal-900 p-4 md:p-6 rounded-2xl shadow-lg border border-emerald-800 gap-4">
                <div>
                    <h1 className="text-lg md:text-2xl font-[1000] text-white tracking-tight drop-shadow-md">Smart City Command Center</h1>
                    <p className="text-xs text-emerald-100 font-bold uppercase tracking-widest mt-1 opacity-90">
                        Live Operations • E-Waste Management Platform
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        <span className="text-xs font-bold text-emerald-300">Live</span>
                    </div>
                    <button className="relative p-2.5 bg-white/10 text-emerald-50 rounded-xl hover:bg-white/20 border border-white/10 transition-all backdrop-blur-sm">
                        <Bell size={20} />
                        {pendingTickets.length > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {pendingTickets.length}
                            </span>
                        )}
                    </button>
                    <div className="text-right hidden md:block text-white">
                        <p className="text-sm font-bold drop-shadow-md">Municipal Officer</p>
                        <p className="text-xs text-emerald-200">Central District</p>
                    </div>
                </div>
            </header>

            {/* ── KPI Cards ──────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border-t-4 border-t-emerald-600 border-x border-b border-slate-200 shadow-md flex flex-col gap-3 hover:shadow-lg transition-all transform hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center shadow-inner`}>
                            {kpi.icon}
                        </div>
                        <div>
                            <h4 className="text-3xl font-[1000] text-slate-800 tracking-tight">{kpi.value}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">{kpi.label}</p>
                            {kpi.sub && <p className={`text-[10px] font-semibold ${kpi.subColor} mt-0.5`}>{kpi.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Grid: Map + Recent Activity ───────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                {/* Live Operations Map */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '420px' }}>
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin className="text-blue-600" size={20} />
                            <h2 className="text-base font-bold text-slate-800">Live Operations Map</h2>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Pickup</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Priority</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full bg-slate-100 relative min-h-[360px]">
                        <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%', minHeight: '360px' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='© OSM' />
                            {mapMarkers.map((m, i) => (
                                <Marker
                                    key={i}
                                    position={[m.lat, m.lng]}
                                    icon={makeMapIcon(m.priority === 'High' ? '#ef4444' : '#10b981')}
                                >
                                    <Popup>
                                        <div className="text-xs font-bold">
                                            <p className="text-slate-800">{m.label}</p>
                                            <p className="text-slate-500 font-normal mt-1">Priority: {m.priority || 'Low'}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                            {mapMarkers.length === 0 && (
                                /* Static demo markers when no live data */
                                <>
                                    <Marker position={[17.3850, 78.4867]} icon={makeMapIcon('#10b981')}><Popup>Collector: Active</Popup></Marker>
                                    <Marker position={[17.4000, 78.5000]} icon={makeMapIcon('#3b82f6')}><Popup>Pickup: In Progress</Popup></Marker>
                                    <Marker position={[17.3700, 78.4500]} icon={makeMapIcon('#ef4444')}><Popup>High Priority Pickup</Popup></Marker>
                                </>
                            )}
                        </MapContainer>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-800">Live Activity Feed</h2>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Real-time</span>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 max-h-[380px]">
                        {activePickups.length === 0 && completedPickups.slice(-5).length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                <Activity size={32} className="mx-auto mb-2 opacity-30" />
                                No live activity
                            </div>
                        ) : (
                            <>
                                {activePickups.slice(0, 5).map((a, i) => (
                                    <div key={a.id || i} className="px-4 py-3 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 text-xs font-black">⚡</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{a.item} — Pickup In Progress</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                Collector: {a.collectorName || 'Assigned'} · {a.pickupAddress?.slice(0, 30) || ''}…
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {[...completedPickups].reverse().slice(0, 5).map((a, i) => (
                                    <div key={a.id || i} className="px-4 py-3 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle size={14} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{a.item} — Completed ✓</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                🟢 {a.estimatedValue || 0} Coins credited · {a.collectorName || ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Workflow Info Banner ────────────────────────────────── */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 rounded-2xl p-6 border border-emerald-800 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap size={18} className="text-amber-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest drop-shadow-sm">Automated Reward Workflow</h3>
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm">No Manual Approval Needed</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                            { step: '1', label: 'Citizen Uploads', icon: '📱', color: 'text-blue-400' },
                            { step: '2', label: 'Officer Assigns Collector', icon: '👮', color: 'text-amber-400' },
                            { step: '3', label: 'Collector Picks Up', icon: '🚚', color: 'text-purple-400' },
                            { step: '4', label: 'OTP Verified', icon: '🔐', color: 'text-rose-400' },
                            { step: '5', label: 'Rewards Auto-Credited', icon: '🟢', color: 'text-emerald-400' },
                        ].map((s) => (
                            <div key={s.step} className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                                    {s.icon}
                                </div>
                                <p className={`text-[10px] font-bold ${s.color} uppercase tracking-wider leading-tight`}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Pending Withdrawal Requests Table ──────────────────────── */}
            {pendingWithdrawals.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Pending Withdrawal Requests</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Collectors requesting to withdraw their earnings</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left">Collector</th>
                                    <th className="px-4 py-3 text-left">Amount (₹)</th>
                                    <th className="px-4 py-3 text-left">Method</th>
                                    <th className="px-4 py-3 text-left">Details</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pendingWithdrawals.map((w, i) => (
                                    <tr key={w.id || i} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{w.collectorName || '—'}</td>
                                        <td className="px-4 py-4 text-sm font-black text-emerald-600">₹{w.amount}</td>
                                        <td className="px-4 py-4 text-xs font-semibold text-slate-600">{w.method}</td>
                                        <td className="px-4 py-4 text-[10px] text-slate-500">
                                            {w.method === 'UPI' ? (
                                                <p><span className="font-bold">UPI ID:</span> {w.upiId}</p>
                                            ) : (
                                                <>
                                                    <p><span className="font-bold">Bank:</span> {w.bankDetails?.bankName}</p>
                                                    <p><span className="font-bold">A/C:</span> {w.bankDetails?.accountNumber}</p>
                                                    <p><span className="font-bold">IFSC:</span> {w.bankDetails?.ifscCode}</p>
                                                    <p><span className="font-bold">Name:</span> {w.bankDetails?.accountHolder}</p>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleApproveWithdrawal(w.id)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold text-[10px] rounded-lg">Approve</button>
                                                <button onClick={() => handleRejectWithdrawal(w.id)} className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 font-bold text-[10px] rounded-lg">Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Recent Completed Pickups Table ──────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Completed Pickups</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Green Coins & earnings credited automatically after OTP verification</p>
                    </div>
                    <button
                        onClick={() => navigate('/government/tickets')}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                        View All Tickets
                    </button>
                </div>
                {completedPickups.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                        <CheckCircle size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="font-bold">No completed pickups yet</p>
                        <p className="text-sm mt-1">Completions will appear here in real time</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left">Ticket</th>
                                    <th className="px-4 py-3 text-left">Device</th>
                                    <th className="px-4 py-3 text-left">Collector</th>
                                    <th className="px-4 py-3 text-left">Green Coins</th>
                                    <th className="px-4 py-3 text-left">Completed At</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[...completedPickups].reverse().slice(0, 10).map((a, i) => (
                                    <tr key={a.id || i} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{a.ticketId || '—'}</td>
                                        <td className="px-4 py-4 text-xs font-semibold text-slate-600">{a.item}</td>
                                        <td className="px-4 py-4 text-xs text-slate-600">{a.collectorName || '—'}</td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-black text-amber-600">🟢 {a.estimatedValue || 0}</span>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-400">
                                            {a.completedAt ? formatTime(a.completedAt) : '—'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                                                ✓ Completed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default GovernmentDashboard;
