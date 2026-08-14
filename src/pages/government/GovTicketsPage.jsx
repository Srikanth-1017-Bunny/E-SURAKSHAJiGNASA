import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Search, X, MapPin, Clock, UserCheck, FileText, Navigation, CheckCircle, Building2, Star, Zap } from 'lucide-react';

const formatTime = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isToday) return `Today, ${timeStr}`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + `, ${timeStr}`;
};

const getPriorityStyle = (priority) => {
    switch (priority) {
        case 'High': return 'text-red-600 bg-red-50 border-red-200';
        case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
        default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
};

const determinePriority = (value) => {
    if (value >= 3000) return 'High';
    if (value >= 1500) return 'Medium';
    return 'Low';
};

const getCategoryIcon = (category) => {
    const map = { 'Mobile': '📱', 'Laptop': '💻', 'Television': '📺', 'Refrigerator': '🧊', 'Washing Machine': '🫧' };
    return map[category] || '📦';
};

// Haversine formula — distance in km between two lat/lng points
const haversineKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Extract city name from address string
const extractCity = (address = '') => {
    const lower = address.toLowerCase();
    if (lower.includes('hyderabad') || lower.includes('hyd')) return 'Hyderabad';
    if (lower.includes('nizamabad') || lower.includes('nzb')) return 'Nizamabad';
    if (lower.includes('medchal') || lower.includes('med')) return 'Medchal';
    return null;
};

const COLLECTOR_COLORS = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
];

const GovTicketsPage = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('pending');
    const [search, setSearch] = useState('');
    const [assignModal, setAssignModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'tickets'), (snap) => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setAllTickets(docs);
            setLoading(false);
        });
        return unsub;
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'users'), where('role', '==', 'collector'));
        const unsub = onSnapshot(q, (snap) => {
            setCollectors(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const pending = allTickets.filter(t => t.status === 'Submitted');
    const assigned = allTickets.filter(t => ['Assigned', 'In Progress'].includes(t.status));
    const completed = allTickets.filter(t => ['Completed', 'Collected', 'recycled'].includes(t.status));

    const displayed = tab === 'pending' ? pending : tab === 'assigned' ? assigned : completed;
    const filtered = displayed.filter(t =>
        !search ||
        (t.ticketId || t.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.deviceBrand || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.pickupAddress || '').toLowerCase().includes(search.toLowerCase())
    );

    // Get the city from the ticket's address
    const ticketCity = useMemo(() => {
        if (!assignModal) return null;
        return extractCity(assignModal.pickupAddress || '');
    }, [assignModal]);

    // Filter collectors by city, then sort by distance
    const sortedCollectors = useMemo(() => {
        if (!assignModal) return collectors;
        const ticketLat = assignModal.location?.lat;
        const ticketLng = assignModal.location?.lng;
        const city = extractCity(assignModal.pickupAddress || '');

        return [...collectors]
            .filter(c => {
                // If we can identify the ticket's city, only show collectors from that city
                if (city) {
                    const cCity = c.address?.city || '';
                    return cCity.toLowerCase() === city.toLowerCase();
                }
                return true;
            })
            .map(c => {
                const cLat = c.location?.lat || c.address?.lat;
                const cLng = c.location?.lng || c.address?.lng;
                let distKm = null;
                if (ticketLat && ticketLng && cLat && cLng) {
                    distKm = haversineKm(ticketLat, ticketLng, cLat, cLng);
                }
                return { ...c, distKm };
            })
            .sort((a, b) => {
                if (a.distKm === null && b.distKm === null) return 0;
                if (a.distKm === null) return 1;
                if (b.distKm === null) return -1;
                return a.distKm - b.distKm;
            });
    }, [assignModal, collectors]);

    const handleAssign = async () => {
        if (!selected || !assignModal) return;
        setAssigning(true);
        try {
            const otp = Math.floor(100000 + Math.random() * 900000);
            await updateDoc(doc(db, 'tickets', assignModal.id), {
                status: 'Assigned',
                collectorId: selected.uid,
                collectorName: selected.displayName || selected.name || selected.email?.split('@')[0],
                assignedTime: serverTimestamp(),
                otp,
            });
            await addDoc(collection(db, 'assignments'), {
                ticketId: assignModal.ticketId || assignModal.id,
                item: `${assignModal.deviceBrand || ''} ${assignModal.deviceModel || ''}`.trim(),
                pickupAddress: assignModal.pickupAddress || '',
                priority: determinePriority(assignModal.estimatedValue || 0),
                icon: getCategoryIcon(assignModal.deviceCategory),
                collectorId: selected.uid,
                collectorName: selected.displayName || selected.name || '',
                status: 'Assigned',
                assignedAt: serverTimestamp(),
                userName: assignModal.userName || '',
                userEmail: assignModal.userEmail || '',
                userPhone: assignModal.userPhone || '',
                ticketLocation: assignModal.location || null,
                estimatedValue: assignModal.estimatedValue || 0,
                grade: assignModal.grade || '',
                deviceImage: assignModal.image || null,
                ticketRef: assignModal.id,
                otp,
            });
            await addDoc(collection(db, 'notifications'), {
                userId: selected.uid,
                title: 'New E-Waste Collection Assigned',
                message: `Collect ${assignModal.deviceBrand || ''} ${assignModal.deviceModel || ''} from ${assignModal.pickupAddress || 'user location'}.`,
                type: 'info', read: false, createdAt: serverTimestamp(),
            });
        } catch (e) { console.error(e); }
        setAssigning(false);
        setAssignModal(null);
        setSelected(null);
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-xl font-black text-slate-800">Tickets Management</h1>
                <p className="text-sm text-slate-500 mt-0.5">{allTickets.length} total · {pending.length} pending assignment</p>
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                    {[
                        { key: 'pending', label: `Pending (${pending.length})` },
                        { key: 'assigned', label: `Assigned (${assigned.length})` },
                        { key: 'completed', label: `Completed (${completed.length})` },
                    ].map(({ key, label }) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} className="text-slate-400" /></button>}
                </div>
            </div>

            {/* Ticket List */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                    <FileText size={40} className="mb-3 text-slate-300" />
                    <p className="font-bold text-slate-600">No {tab} tickets</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filtered.map((t) => {
                        const priority = determinePriority(t.estimatedValue || 0);
                        return (
                            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4">
                                <div className="flex flex-wrap items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
                                        {getCategoryIcon(t.deviceCategory)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <p className="font-black text-slate-800 text-sm">{t.ticketId || t.id?.slice(0, 8)}</p>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyle(priority)}`}>{priority}</span>
                                            {t.status && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${t.status === 'Submitted' ? 'bg-amber-100 text-amber-700' : t.status === 'Assigned' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{t.status}</span>}
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">{t.deviceBrand} {t.deviceModel}</p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {t.pickupAddress || 'No address'}</p>
                                        {t.userName && <p className="text-xs text-blue-500 font-bold mt-0.5">👤 {t.userName}</p>}
                                        {t.collectorName && <p className="text-xs text-emerald-600 font-bold mt-0.5">🚛 {t.collectorName}</p>}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Clock size={10} /> {formatTime(t.createdAt)}</p>
                                        {t.estimatedValue > 0 && <p className="text-sm font-black text-emerald-600">₹{t.estimatedValue}</p>}
                                        {tab === 'pending' && (
                                            <button onClick={() => { setAssignModal(t); setSelected(null); }}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-indigo-700 shadow-sm">
                                                <UserCheck size={12} /> Assign
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Assign Modal ── */}
            {assignModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setAssignModal(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <UserCheck size={18} className="text-blue-200" />
                                            <h2 className="text-lg font-black tracking-tight">Assign Collector</h2>
                                        </div>
                                        <p className="text-blue-200 text-sm font-semibold">
                                            {assignModal.deviceBrand} {assignModal.deviceModel}
                                            {assignModal.ticketId && <span className="text-blue-300 ml-2">· #{assignModal.ticketId}</span>}
                                        </p>
                                    </div>
                                    <button onClick={() => setAssignModal(null)}
                                        className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0">
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Ticket Info Pills */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {assignModal.pickupAddress && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white/15 px-3 py-1.5 rounded-full border border-white/20">
                                            <MapPin size={11} /> {assignModal.pickupAddress}
                                        </span>
                                    )}
                                    {ticketCity && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-400/30 text-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300/30">
                                            <Building2 size={11} /> {ticketCity} Zone
                                        </span>
                                    )}
                                    {assignModal.estimatedValue > 0 && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold bg-amber-400/30 text-amber-100 px-3 py-1.5 rounded-full border border-amber-300/30">
                                            ₹{assignModal.estimatedValue} Value
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Collectors List */}
                        <div className="p-5">
                            {/* Section Label */}
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                        {ticketCity ? `${ticketCity} Collectors` : 'Available Collectors'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                                        {sortedCollectors.length} collector{sortedCollectors.length !== 1 ? 's' : ''} available
                                        {assignModal.location?.lat && ' · Sorted by proximity'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {assignModal.location?.lat && (
                                        <span className="text-[9px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 flex items-center gap-1">
                                            <Navigation size={8} /> Location-based
                                        </span>
                                    )}
                                    {ticketCity && (
                                        <span className="text-[9px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 flex items-center gap-1">
                                            <Zap size={8} /> City filtered
                                        </span>
                                    )}
                                </div>
                            </div>

                            {sortedCollectors.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 text-2xl">🚫</div>
                                    <p className="font-bold text-sm text-slate-600">No collectors in {ticketCity || 'this area'}</p>
                                    <p className="text-xs text-slate-400 mt-1">Add collectors for this zone to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 -mr-1">
                                    {sortedCollectors.map((c, idx) => (
                                        <div key={c.uid} onClick={() => setSelected(c)}
                                            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${selected?.uid === c.uid
                                                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                                }`}>
                                            {/* Avatar */}
                                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${COLLECTOR_COLORS[idx % COLLECTOR_COLORS.length]} text-white flex items-center justify-center font-black text-base flex-shrink-0 shadow-sm`}>
                                                {(c.displayName || c.name || c.email || '?').charAt(0).toUpperCase()}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-sm text-slate-800 truncate">
                                                        {c.displayName || c.name || c.email?.split('@')[0]}
                                                    </p>
                                                    {idx === 0 && (
                                                        <span className="text-[9px] bg-amber-100 text-amber-700 font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                                                            <Star size={7} className="fill-amber-500" /> Nearest
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                    {c.address?.city && (
                                                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                                                            <Building2 size={9} /> {c.address.city}
                                                        </span>
                                                    )}
                                                    {c.distKm !== null ? (
                                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${c.distKm < 5 ? 'bg-emerald-100 text-emerald-700' : c.distKm < 15 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                                            📍 {c.distKm < 1 ? `${Math.round(c.distKm * 1000)}m away` : `${c.distKm.toFixed(1)} km away`}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400">
                                                            Location not set
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Radio */}
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected?.uid === c.uid ? 'border-blue-500 bg-blue-500 scale-110' : 'border-slate-300'}`}>
                                                {selected?.uid === c.uid && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Selected summary */}
                            {selected && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2">
                                    <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
                                    <p className="text-xs font-bold text-blue-700">
                                        Assigning to <span className="text-blue-900">{selected.displayName || selected.name}</span>
                                        {selected.address?.city && <span className="font-normal text-blue-600"> · {selected.address.city}</span>}
                                    </p>
                                </div>
                            )}

                            {/* OTP Note */}
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
                                <span className="text-base flex-shrink-0">🔐</span>
                                <p className="text-[10px] font-bold text-amber-700">
                                    A 6-digit OTP will be auto-generated and shown to the citizen for verification at pickup.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setAssignModal(null)}
                                    className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleAssign} disabled={!selected || assigning}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all ${selected && !assigning
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200'
                                        : 'bg-slate-200 cursor-not-allowed text-slate-400'
                                        }`}>
                                    {assigning
                                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <><UserCheck size={16} /> Confirm Assignment</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovTicketsPage;
