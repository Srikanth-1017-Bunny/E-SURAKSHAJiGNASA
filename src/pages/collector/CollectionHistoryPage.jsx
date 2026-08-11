import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Package, CheckCircle, MapPin, Clock, IndianRupee } from 'lucide-react';

const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' · ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const CollectionHistoryPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'assignments'),
            where('collectorId', '==', currentUser.uid),
            where('status', '==', 'Completed')
        );
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            // Sort by completedAt desc (most recent first)
            docs.sort((a, b) => {
                const aT = a.completedAt?.seconds || a.assignedAt?.seconds || 0;
                const bT = b.completedAt?.seconds || b.assignedAt?.seconds || 0;
                return bT - aT;
            });
            setHistory(docs);
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, [currentUser]);

    const totalEarned = history.reduce((sum, h) => {
        return sum + Math.round(50 + (h.estimatedValue || 0) * 0.1);
    }, 0);

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Package size={20} className="text-emerald-600" /> Recent Pickups
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">{history.length} completed pickups</p>
                </div>
                {history.length > 0 && (
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-semibold">Total Earned</p>
                        <p className="text-xl font-black text-emerald-600 flex items-center gap-0.5">
                            <IndianRupee size={16} />{totalEarned}
                        </p>
                    </div>
                )}
            </div>

            {/* List */}
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                    <CheckCircle size={48} className="mb-4 text-slate-200" />
                    <h3 className="text-lg font-black text-slate-600">No Completed Pickups Yet</h3>
                    <p className="text-sm mt-1">Completed pickup assignments will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {history.map((item, idx) => {
                        const earning = Math.round(50 + (item.estimatedValue || 0) * 0.1);
                        return (
                            <div key={item.id}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4">
                                <div className="flex items-start gap-4">
                                    {/* Icon / Number */}
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
                                        {item.icon || '📦'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="font-black text-slate-800 text-sm">{item.item || 'E-Waste Item'}</p>
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                Completed
                                            </span>
                                        </div>
                                        {item.pickupAddress && (
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <MapPin size={10} /> {item.pickupAddress}
                                            </p>
                                        )}
                                        {item.userName && (
                                            <p className="text-xs text-blue-500 font-semibold mt-0.5">👤 {item.userName}</p>
                                        )}
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                            <Clock size={10} /> {formatDate(item.completedAt || item.assignedAt)}
                                        </p>
                                    </div>
                                    {/* Earning */}
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <p className="text-base font-black text-emerald-600 flex items-center gap-0.5">
                                            <IndianRupee size={13} />{earning}
                                        </p>
                                        <p className="text-[10px] text-slate-400">earned</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CollectionHistoryPage;
