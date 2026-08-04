import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, doc, updateDoc, query, where, serverTimestamp, getDoc, increment } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { MapPin, CheckCircle, Clock, Navigation, Package, Filter, Search, X, ChevronRight, AlertCircle } from 'lucide-react';

const formatTime = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isToday) return `Today, ${timeStr}`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + `, ${timeStr}`;
};

const TicketsPage = () => {
    const { currentUser } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('active');
    const [search, setSearch] = useState('');
    const [completing, setCompleting] = useState(null);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, 'assignments'), where('collectorId', '==', currentUser.uid), where('status', '==', 'Assigned'));
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            docs.sort((a, b) => (b.assignedAt?.seconds || 0) - (a.assignedAt?.seconds || 0));
            setAssignments(docs);
            setLoading(false);
        });
        return unsub;
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, 'assignments'), where('collectorId', '==', currentUser.uid), where('status', '==', 'Completed'));
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            docs.sort((a, b) => (b.completedAt?.seconds || b.assignedAt?.seconds || 0) - (a.completedAt?.seconds || a.assignedAt?.seconds || 0));
            setCompletedAssignments(docs);
        });
        return unsub;
    }, [currentUser]);

    const handleComplete = async (ticket) => {
        setCompleting(ticket.firestoreId);
        try {
            await updateDoc(doc(db, 'assignments', ticket.firestoreId), {
                status: 'Completed',
                completedAt: serverTimestamp(),
            });

            if (ticket.ticketRef) {
                const ticketSnap = await getDoc(doc(db, 'tickets', ticket.ticketRef));
                if (ticketSnap.exists()) {
                    const ticketData = ticketSnap.data();

                    await updateDoc(doc(db, 'tickets', ticket.ticketRef), {
                        status: 'Completed',
                        completionTime: serverTimestamp(),
                    });

                    const coinsToCredit = ticketData.estimatedValue || 0;
                    const citizenId = ticketData.userId;
                    if (citizenId && coinsToCredit > 0) {
                        await updateDoc(doc(db, 'users', citizenId), {
                            coinsBalance: increment(coinsToCredit),
                        });
                    }

                    const pickupEarning = Math.round(50 + coinsToCredit * 0.1);
                    if (ticket.collectorId) {
                        await updateDoc(doc(db, 'users', ticket.collectorId), {
                            totalEarnings: increment(pickupEarning),
                            todayEarnings: increment(pickupEarning),
                        });
                    }
                }
            }
        } catch (e) { console.error(e); }
        setCompleting(null);
    };

    const displayed = tab === 'active' ? assignments : completedAssignments;
    const filtered = displayed.filter(a =>
        !search || (a.item || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.ticketId || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.pickupAddress || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-white to-emerald-50/60 p-5 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-xl font-black text-slate-800">My Tickets</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{assignments.length} active · {completedAssignments.length} completed</p>
                </div>
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                    {[
                        { key: 'active', label: `Active (${assignments.length})` },
                        { key: 'completed', label: `Completed (${completedAssignments.length})` },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === key ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search tickets..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X size={14} className="text-slate-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Ticket List */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                    <Package size={40} className="mb-3 text-slate-300" />
                    <p className="font-bold text-slate-600">No {tab} tickets</p>
                    <p className="text-sm mt-1">{tab === 'active' ? 'New assignments will appear here' : 'Completed pickups will show here'}</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((ticket) => (
                        <div
                            key={ticket.firestoreId}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5"
                        >
                            <div className="flex flex-wrap items-start gap-4">
                                {/* Icon + Info */}
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
                                    {ticket.icon || '📦'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <p className="font-black text-slate-800">{ticket.ticketId}</p>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                            ticket.priority === 'High' ? 'bg-red-100 text-red-600' :
                                            ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>{ticket.priority}</span>
                                        {tab === 'completed' && (
                                            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle size={9} /> Done
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{ticket.item}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <MapPin size={11} /> {ticket.pickupAddress || ticket.location || 'No address'}
                                    </p>
                                    {ticket.userName && (
                                        <p className="text-xs text-blue-500 font-bold mt-1">👤 {ticket.userName}</p>
                                    )}
                                </div>
                                {/* Time + Value */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                                        <Clock size={11} /> {formatTime(ticket.assignedAt)}
                                    </p>
                                    {ticket.estimatedValue > 0 && (
                                        <p className="text-sm font-black text-emerald-600">₹{ticket.estimatedValue}</p>
                                    )}
                                    {/* Actions */}
                                    {tab === 'active' && (
                                        <div className="flex gap-2">
                                            <a
                                                href={`https://maps.google.com/?q=${encodeURIComponent(ticket.pickupAddress || '')}`}
                                                target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1 px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                <Navigation size={12} /> Navigate
                                            </a>
                                            <button
                                                onClick={() => handleComplete(ticket)}
                                                disabled={completing === ticket.firestoreId}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm disabled:opacity-70"
                                            >
                                                {completing === ticket.firestoreId ? (
                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <><CheckCircle size={12} /> Complete</>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketsPage;
