import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, BarChart, FileText, Bell, CheckCircle, Recycle, Award, MapPin, Phone, Mail, TrendingUp, Shield, Clock, Package, RefreshCw } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const HeaderPanel = ({ title, desc, onExport, exporting }) => (
    <div className="bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-black text-slate-800">{title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
        </div>
        <button
            onClick={onExport}
            disabled={exporting}
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
            {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            {exporting ? 'Preparing...' : 'Export Data'}
        </button>
    </div>
);

const generateCSV = (tickets) => {
    const headers = ['Ticket ID', 'User Name', 'User Email', 'Device Category', 'Brand', 'Model', 'Condition', 'Grade', 'Estimated Value (Coins)', 'Pickup Address', 'Status', 'Created At'];
    const rows = tickets.map(t => [
        t.ticketId || t.id || '',
        t.userName || '',
        t.userEmail || '',
        t.deviceCategory || '',
        t.deviceBrand || '',
        t.deviceModel || '',
        t.deviceCondition || '',
        t.grade || '',
        t.estimatedValue || 0,
        `"${(t.pickupAddress || '').replace(/"/g, "'")}"`,
        t.status || '',
        t.createdAt?.seconds
            ? new Date(t.createdAt.seconds * 1000).toLocaleString('en-IN')
            : t.createdAt
                ? new Date(t.createdAt).toLocaleString('en-IN')
                : ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `e-suraksha-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const GovReportsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
                console.error('Error fetching tickets:', err);
                // fallback: load without ordering if index missing
                try {
                    const snap = await getDocs(collection(db, 'tickets'));
                    setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                } catch (e) {
                    console.error('Fallback fetch failed:', e);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            generateCSV(tickets);
        } finally {
            setExporting(false);
        }
    };

    const filtered = tickets.filter(t => {
        const s = search.toLowerCase();
        return !s || (t.ticketId || '').toLowerCase().includes(s) ||
            (t.userName || '').toLowerCase().includes(s) ||
            (t.deviceCategory || '').toLowerCase().includes(s) ||
            (t.status || '').toLowerCase().includes(s);
    });

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
            <HeaderPanel
                title="E-Waste Generation Reports"
                desc={`Live data from Firestore — ${tickets.length} total tickets`}
                onExport={handleExport}
                exporting={exporting}
            />
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={18} className="text-blue-500" />
                        All Tickets
                        {loading && <RefreshCw size={14} className="animate-spin text-slate-400 ml-2" />}
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search tickets..."
                            className="pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-400">
                        <RefreshCw size={32} className="mx-auto mb-2 animate-spin opacity-40" />
                        <p className="text-sm font-bold">Loading tickets...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <FileText size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-bold">{search ? 'No matching tickets' : 'No tickets found'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
                                <tr>
                                    <th className="p-4 rounded-tl-lg">Ticket ID</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Device</th>
                                    <th className="p-4">Grade</th>
                                    <th className="p-4">Eco-Coins</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 rounded-tr-lg">Download</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.slice(0, 50).map((t, i) => (
                                    <tr key={t.id || i} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-xs text-slate-700">{t.ticketId || t.id?.slice(0, 8) || '—'}</td>
                                        <td className="p-4">
                                            <p className="font-semibold text-xs text-slate-700">{t.userName || '—'}</p>
                                            <p className="text-[10px] text-slate-400">{t.userEmail || ''}</p>
                                        </td>
                                        <td className="p-4 text-xs text-slate-600">{t.deviceCategory} · {t.deviceBrand} {t.deviceModel}</td>
                                        <td className="p-4 text-xs font-bold text-indigo-600">{t.grade || '—'}</td>
                                        <td className="p-4 text-xs font-black text-amber-600">🟢 {t.estimatedValue || 0}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${t.status === 'Completed'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : t.status === 'Assigned'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[10px] text-slate-400">
                                            {t.createdAt?.seconds
                                                ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('en-IN')
                                                : '—'}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => generateCSV([t])}
                                                className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:text-blue-800 transition-colors"
                                            >
                                                <Download size={12} /> CSV
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length > 50 && (
                            <p className="text-center text-xs text-slate-400 py-4 border-t">
                                Showing 50 of {filtered.length} — use Export to download all
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};



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

const RECYCLER_DATA = [
    {
        name: 'GreenEarth India Pvt. Ltd.',
        abbr: 'GE',
        status: 'Active',
        city: 'Hyderabad',
        zone: 'Central',
        capacity: 700,
        used: 520,
        email: 'ops@greenearth.in',
        phone: '+91 98765 43210',
        certifications: ['ISO 14001', 'E-Waste (M) Rules 2022', 'PCB Certified'],
        lastAudit: 'Aug 5, 2026',
        totalProcessed: 4820,
        pendingBatch: 12,
        color: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        barColor: 'bg-emerald-500',
    },
    {
        name: 'TechScrap Solutions LLP',
        abbr: 'TS',
        status: 'Active',
        city: 'Nizamabad',
        zone: 'North',
        capacity: 500,
        used: 310,
        email: 'contact@techscrap.co.in',
        phone: '+91 90123 45678',
        certifications: ['ISO 9001', 'E-Waste (M) Rules 2022'],
        lastAudit: 'Jul 28, 2026',
        totalProcessed: 2940,
        pendingBatch: 7,
        color: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        barColor: 'bg-blue-500',
    },
    {
        name: 'EcoRecycle Corp',
        abbr: 'ER',
        status: 'Active',
        city: 'Medchal',
        zone: 'East',
        capacity: 900,
        used: 640,
        email: 'admin@ecorecycle.org',
        phone: '+91 87654 32109',
        certifications: ['ISO 14001', 'ISO 45001', 'E-Waste (M) Rules 2022', 'BIS Certified'],
        lastAudit: 'Aug 9, 2026',
        totalProcessed: 6150,
        pendingBatch: 18,
        color: 'from-violet-500 to-purple-600',
        bgLight: 'bg-violet-50',
        textColor: 'text-violet-700',
        borderColor: 'border-violet-200',
        barColor: 'bg-violet-500',
    },
];

export const GovRecyclersPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const totalProcessed = RECYCLER_DATA.reduce((s, r) => s + r.totalProcessed, 0);
    const totalCapacity = RECYCLER_DATA.reduce((s, r) => s + r.capacity, 0);
    const totalUsed = RECYCLER_DATA.reduce((s, r) => s + r.used, 0);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
            <HeaderPanel title="Certified Recyclers" desc="Manage and monitor authorised e-waste processing facilities" />

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Partner Facilities', value: RECYCLER_DATA.length, icon: <Recycle size={20} className="text-emerald-600" />, bg: 'bg-emerald-50' },
                    { label: 'Total Processed (kg)', value: totalProcessed.toLocaleString(), icon: <Package size={20} className="text-blue-600" />, bg: 'bg-blue-50' },
                    { label: 'Avg Utilisation', value: `${Math.round((totalUsed / totalCapacity) * 100)}%`, icon: <TrendingUp size={20} className="text-violet-600" />, bg: 'bg-violet-50' },
                    { label: 'Active Certifications', value: RECYCLER_DATA.reduce((s, r) => s + r.certifications.length, 0), icon: <Award size={20} className="text-amber-600" />, bg: 'bg-amber-50' },
                ].map(({ label, value, icon, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
                        <div>
                            <p className="text-xl font-black text-slate-800">{value}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recycler Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {RECYCLER_DATA.map((r) => {
                    const utilPct = Math.round((r.used / r.capacity) * 100);
                    return (
                        <div key={r.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            {/* Card Top */}
                            <div className={`bg-gradient-to-r ${r.color} p-5 text-white`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-lg font-black border border-white/30 backdrop-blur-sm">
                                            {r.abbr}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm leading-tight">{r.name}</h3>
                                            <p className="text-white/70 text-[11px] mt-0.5 flex items-center gap-1">
                                                <MapPin size={10} /> {r.city} · {r.zone} Zone
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black bg-white/20 border border-white/30 px-2 py-1 rounded-full">
                                        ✔ {r.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-4">
                                {/* Capacity Bar */}
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                        <span>Capacity Utilisation</span>
                                        <span className={utilPct > 80 ? 'text-red-600' : r.textColor}>{utilPct}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${r.barColor} transition-all`} style={{ width: `${utilPct}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                                        <span>{r.used} tons used</span>
                                        <span>{r.capacity} tons max</span>
                                    </div>
                                </div>

                                {/* Mini Stats */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`${r.bgLight} rounded-xl p-3`}>
                                        <p className="text-base font-black text-slate-800">{r.totalProcessed.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Processed (kg)</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-xl p-3">
                                        <p className="text-base font-black text-amber-700">{r.pendingBatch}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pending Batches</p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="space-y-1.5">
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5"><Mail size={11} className="text-slate-300" /> {r.email}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5"><Phone size={11} className="text-slate-300" /> {r.phone}</p>
                                </div>

                                {/* Certifications */}
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                        <Shield size={9} /> Certifications
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {r.certifications.map(cert => (
                                            <span key={cert} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${r.bgLight} ${r.textColor} ${r.borderColor}`}>
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Last Audit */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                        <Clock size={10} /> Last Audit: {r.lastAudit}
                                    </span>
                                    <button className={`text-[10px] font-black px-3 py-1.5 rounded-lg ${r.bgLight} ${r.textColor} hover:opacity-80 transition-opacity`}>
                                        View Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <h3 className="font-bold text-slate-800">Recent Audit Log</h3>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">Auto-updated</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Facility</th>
                                <th className="px-4 py-3">Audit Type</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Inspector</th>
                                <th className="px-4 py-3">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { facility: 'GreenEarth India', type: 'Compliance Audit', date: 'Aug 5, 2026', inspector: 'CPCB Officer', result: 'Pass' },
                                { facility: 'EcoRecycle Corp', type: 'Safety Inspection', date: 'Aug 9, 2026', inspector: 'State PCB', result: 'Pass' },
                                { facility: 'TechScrap Solutions', type: 'Capacity Review', date: 'Jul 28, 2026', inspector: 'Municipal Dept', result: 'Pass' },
                                { facility: 'GreenEarth India', type: 'Hazmat Check', date: 'Jul 15, 2026', inspector: 'CPCB Officer', result: 'Pass' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-bold text-xs text-slate-700">{row.facility}</td>
                                    <td className="px-4 py-4 text-xs text-slate-500">{row.type}</td>
                                    <td className="px-4 py-4 text-xs text-slate-500">{row.date}</td>
                                    <td className="px-4 py-4 text-xs text-slate-500">{row.inspector}</td>
                                    <td className="px-4 py-4">
                                        <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">✔ {row.result}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

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

