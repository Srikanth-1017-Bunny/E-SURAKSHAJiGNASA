import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, IndianRupee, Package, CheckCircle, Clock, Trophy, Star } from 'lucide-react';

const formatTime = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const EarningsPage = () => {
    const { currentUser } = useAuth();
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'assignments'),
            where('collectorId', '==', currentUser.uid),
            where('status', '==', 'Completed')
        );
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            docs.sort((a, b) => (b.completedAt?.seconds || b.assignedAt?.seconds || 0) - (a.completedAt?.seconds || a.assignedAt?.seconds || 0));
            setCompletedAssignments(docs);
            setLoading(false);
        });
        return unsub;
    }, [currentUser]);

    const totalEarnings = completedAssignments.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);
    const avgEarningsPerPickup = completedAssignments.length > 0 ? Math.round(totalEarnings / completedAssignments.length) : 0;
    const walletBalance = currentUser?.walletBalance || 0;

    // Monthly earnings grouped
    const monthlyData = useMemo(() => {
        const map = {};
        completedAssignments.forEach(a => {
            const date = a.completedAt?.seconds ? new Date(a.completedAt.seconds * 1000) : new Date();
            const key = date.toLocaleDateString('en-IN', { month: 'short' });
            map[key] = (map[key] || 0) + (a.estimatedValue || 0);
        });
        return Object.entries(map).map(([month, amount]) => ({ month, amount }));
    }, [completedAssignments]);

    const statsCards = [
        { label: 'Total Earned', value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-700', bg: 'from-emerald-50 to-emerald-100/50', iconBg: 'bg-emerald-600' },
        { label: 'Wallet Balance', value: `₹${walletBalance.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-blue-700', bg: 'from-blue-50 to-blue-100/50', iconBg: 'bg-blue-600' },
        { label: 'Total Pickups', value: completedAssignments.length, icon: Package, color: 'text-purple-700', bg: 'from-purple-50 to-purple-100/50', iconBg: 'bg-purple-600' },
        { label: 'Avg per Pickup', value: `₹${avgEarningsPerPickup.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-amber-700', bg: 'from-amber-50 to-amber-100/50', iconBg: 'bg-amber-600' },
    ];

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-white to-emerald-50/60 p-5 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-xl font-black text-slate-800">Earnings</h1>
                <p className="text-sm text-slate-500 mt-0.5">Your collection earnings and performance overview</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map(({ label, value, icon: Icon, color, bg, iconBg }) => (
                    <div key={label} className={`bg-gradient-to-br ${bg} rounded-2xl p-5 border border-slate-100/80 shadow-sm`}>
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{label}</p>
                            <div className={`w-9 h-9 rounded-xl ${iconBg} text-white flex items-center justify-center shadow-sm`}>
                                <Icon size={17} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Earnings Trend */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <h3 className="font-black text-slate-800 mb-4">Earnings Trend</h3>
                    {completedAssignments.length > 0 ? (
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={completedAssignments.slice(0, 10).map((a, i) => ({ name: i + 1, value: a.estimatedValue || 0 }))}>
                                    <defs>
                                        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip formatter={(v) => [`₹${v}`, 'Earnings']} />
                                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#earningsGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-slate-400">
                            <p className="font-bold">No data yet</p>
                        </div>
                    )}
                </div>

                {/* Monthly Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <h3 className="font-black text-slate-800 mb-4">Monthly Breakdown</h3>
                    {monthlyData.length > 0 ? (
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip formatter={(v) => [`₹${v}`, 'Earnings']} />
                                    <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-slate-400">
                            <p className="font-bold">No monthly data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Earnings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="font-black text-slate-800 mb-4">Recent Pickups & Earnings</h3>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : completedAssignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                        <Package size={28} className="mb-2 text-slate-300" />
                        <p className="font-bold">No completed pickups yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {completedAssignments.slice(0, 10).map((a, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                                    {a.icon || '📦'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-black text-sm text-slate-800">{a.ticketId}</p>
                                        <span className="text-xs text-slate-500">{a.item}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                        <Clock size={10} /> {formatTime(a.completedAt || a.assignedAt)}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-black text-emerald-600">₹{a.estimatedValue || 0}</p>
                                    <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                                        <CheckCircle className="inline" size={8} /> Done
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EarningsPage;
