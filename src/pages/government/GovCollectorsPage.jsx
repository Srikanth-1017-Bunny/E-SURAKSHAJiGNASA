import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Users, MapPin, Mail, Phone, Star, Shield, Search, CheckCircle, Package } from 'lucide-react';

const GovCollectorsPage = () => {
    const [collectors, setCollectors] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'users'), where('role', '==', 'collector'));
        const unsub = onSnapshot(q, (snap) => {
            setCollectors(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
            setLoading(false);
        });
        return unsub;
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'assignments'), (snap) => {
            setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const getCollectorStats = (uid) => {
        const collAssign = assignments.filter(a => a.collectorId === uid);
        return {
            total: collAssign.length,
            completed: collAssign.filter(a => a.status === 'Completed').length,
            active: collAssign.filter(a => a.status === 'Assigned').length,
        };
    };

    const filtered = collectors.filter(c =>
        !search ||
        (c.displayName || c.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.address?.city || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-xl font-black text-slate-800">Collectors</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{collectors.length} registered collectors</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search collectors..."
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            {/* Collectors Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                    <Users size={40} className="mb-3 text-slate-300" />
                    <p className="font-bold text-slate-600">No collectors found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((c, i) => {
                        const stats = getCollectorStats(c.uid);
                        return (
                            <div key={c.uid} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5">
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                                            {(c.displayName || c.name || c.email || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-slate-800 truncate">{c.displayName || c.name || c.email?.split('@')[0]}</p>
                                            {i === 0 && <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">Top ⭐</span>}
                                        </div>
                                        {c.address?.city && (
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <MapPin size={10} /> {c.address.city}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="space-y-1.5 mb-4">
                                    {c.email && (
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <Mail size={11} className="text-slate-300" /> {c.email}
                                        </p>
                                    )}
                                    {c.phone && (
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <Phone size={11} className="text-slate-300" /> {c.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Total', value: stats.total, color: 'text-blue-700', bg: 'bg-blue-50' },
                                        { label: 'Done', value: stats.completed, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                                        { label: 'Active', value: stats.active, color: 'text-amber-700', bg: 'bg-amber-50' },
                                    ].map(({ label, value, color, bg }) => (
                                        <div key={label} className={`${bg} rounded-xl p-2.5 text-center`}>
                                            <p className={`text-base font-black ${color}`}>{value}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Verification */}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${c.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        <Shield size={10} /> {c.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                    <div className="flex text-amber-400">
                                        {[1,2,3,4].map(n => <Star key={n} size={12} className="fill-current" />)}
                                        <Star size={12} className="text-slate-200" />
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

export default GovCollectorsPage;
