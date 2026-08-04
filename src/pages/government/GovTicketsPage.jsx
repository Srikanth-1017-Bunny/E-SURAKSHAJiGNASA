import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Filter, Search, X, CheckCircle, MapPin, Clock, UserCheck, ChevronRight, FileText } from 'lucide-react';

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
        !search || (t.ticketId || t.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.deviceBrand || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.pickupAddress || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleAssign = async () => {
        if (!selected || !assignModal) return;
        setAssigning(true);
        try {
            const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

            await updateDoc(doc(db, 'tickets', assignModal.id), {
                status: 'Assigned',
                collectorId: selected.uid,
                collectorName: selected.displayName || selected.name || selected.email?.split('@')[0],
                assignedTime: serverTimestamp(),
                otp: otp,
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
                otp: otp,
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
                                            <p className="font-black text-slate-800 text-sm">{t.ticketId || t.id?.slice(0,8)}</p>
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
                                            <button onClick={() => setAssignModal(t)}
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

            {/* Assign Modal */}
            {assignModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAssignModal(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black">Assign Collector</h2>
                                <button onClick={() => setAssignModal(null)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30"><X size={15} /></button>
                            </div>
                            <p className="text-blue-200 text-xs mt-1">{assignModal.deviceBrand} {assignModal.deviceModel} · {assignModal.ticketId}</p>
                        </div>
                        <div className="p-5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Available Collectors ({collectors.length})</p>
                            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                                {collectors.map(c => (
                                    <div key={c.uid} onClick={() => setSelected(c)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected?.uid === c.uid ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm">
                                            {(c.displayName || c.name || c.email || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-slate-800">{c.displayName || c.name || c.email?.split('@')[0]}</p>
                                            {c.address?.city && <p className="text-xs text-slate-400">{c.address.city} · {c.email}</p>}
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected?.uid === c.uid ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                                            {selected?.uid === c.uid && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setAssignModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50">Cancel</button>
                                <button onClick={handleAssign} disabled={!selected || assigning}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 ${selected && !assigning ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md' : 'bg-slate-300 cursor-not-allowed'}`}>
                                    {assigning ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserCheck size={14} /> Assign</>}
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
