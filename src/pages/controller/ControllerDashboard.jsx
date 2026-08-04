import React from 'react';
import { useController } from '../../hooks/useController';
import { FaUsers, FaRecycle, FaTruck, FaExclamationCircle, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatCurrency, timeAgo } from '../../utils/formatting';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => {
    const colorVariants = {
        blue: { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600', shadow: 'shadow-blue-200' },
        emerald: { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'shadow-emerald-200' },
        orange: { bg: 'from-orange-400 to-red-500', light: 'bg-orange-50', text: 'text-orange-600', shadow: 'shadow-orange-200' },
        purple: { bg: 'from-purple-500 to-fuchsia-600', light: 'bg-purple-50', text: 'text-purple-600', shadow: 'shadow-purple-200' }
    };
    const style = colorVariants[color] || colorVariants.blue;

    return (
        <div className="glass-card group p-8 rounded-[2rem]">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 bg-gradient-to-br ${style.bg} text-white rounded-2xl shadow-lg ${style.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-2xl" />
                </div>
                <div className="text-right">
                    <p className={`text-xs font-black uppercase tracking-widest ${style.text} opacity-80 mb-1`}>{title}</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none">{value}</h3>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${style.bg} w-2/3`}></div>
                </div>
                <p className="text-slate-400 text-[10px] font-bold whitespace-nowrap">{subtext}</p>
            </div>
        </div>
    );
};

const ControllerDashboard = () => {
    const { stats, requests, loading } = useController();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    const recentRequests = requests.slice(0, 5);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 relative">
            {/* Global Admin Accents */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-emerald-500 to-blue-600 z-50"></div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">System Console</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-emerald-600">Central</span></h1>
                        <p className="text-slate-500 font-medium">Monitoring platform health and operational efficiency.</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideUp">
                    <StatCard
                        title="User Base"
                        value={stats.totalUsers}
                        icon={FaUsers}
                        color="blue"
                        subtext="+12% this month"
                    />
                    <StatCard
                        title="Recycled"
                        value={`${stats.totalRecycled} kg`}
                        icon={FaRecycle}
                        color="emerald"
                        subtext="Impact: Tier 1"
                    />
                    <StatCard
                        title="Collectors"
                        value={stats.activeCollectors}
                        icon={FaTruck}
                        color="orange"
                        subtext="Fleet: Operational"
                    />
                    <StatCard
                        title="Uptime"
                        value="99.9%"
                        icon={FaChartLine}
                        color="purple"
                        subtext="System Health: Optimal"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Requests Table */}
                    <div className="lg:col-span-2 glass-card rounded-[2.5rem] overflow-hidden animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                Recent Operations
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] rounded-md uppercase font-black">Live</span>
                            </h2>
                            <Link to="/controller/requests" className="text-emerald-600 text-sm font-bold hover:underline bg-emerald-50 px-4 py-2 rounded-xl transition-colors">View All Analysis</Link>
                        </div>
                        <div className="overflow-x-auto p-2">
                            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                                <thead className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Component</th>
                                        <th className="px-6 py-4">Source</th>
                                        <th className="px-6 py-4 text-center">Lifecycle</th>
                                        <th className="px-6 py-4 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600 font-medium">
                                    {recentRequests.map(req => (
                                        <tr key={req.id} className="group hover:bg-slate-50/50 rounded-2xl transition-all cursor-pointer">
                                            <td className="px-6 py-4 font-bold text-slate-900 bg-white group-hover:bg-transparent rounded-l-2xl border-y border-l border-slate-100 group-hover:border-transparent transition-all">{req.productTitle}</td>
                                            <td className="px-6 py-4 bg-white group-hover:bg-transparent border-y border-slate-100 group-hover:border-transparent transition-all">{req.userName || 'System'}</td>
                                            <td className="px-6 py-4 bg-white group-hover:bg-transparent border-y border-slate-100 group-hover:border-transparent transition-all text-center">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter
                                                    ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        req.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-slate-100 text-slate-600'}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 bg-white group-hover:bg-transparent rounded-r-2xl border-y border-r border-slate-100 group-hover:border-transparent transition-all text-right text-xs tabular-nums text-slate-400 font-bold">{timeAgo(req.createdAt)}</td>
                                        </tr>
                                    ))}
                                    {recentRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-16 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No active telemetry</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Navigation/Actions Panel */}
                    <div className="space-y-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="font-black text-2xl mb-2">Management</h3>
                            <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed">System-wide command and control interface.</p>

                            <div className="space-y-3 relative z-10">
                                {[
                                    { to: "/controller/users", icon: FaUsers, label: "User Control" },
                                    { to: "/controller/products", icon: FaRecycle, label: "Product Audit" },
                                    { to: "/controller/requests", icon: FaExclamationCircle, label: "System Complaints" },
                                    { to: "/controller/logistics", icon: FaTruck, label: "Logistics Hub" },
                                    { to: "/controller/gift-codes", icon: FaRecycle, label: "Reward Engine" }
                                ].map((item, idx) => (
                                    <Link key={idx} to={item.to} className="block bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all flex items-center gap-4 group/item">
                                        <div className="p-2 bg-white/5 rounded-xl group-hover/item:text-emerald-400 transition-colors">
                                            <item.icon className="text-lg" />
                                        </div>
                                        <span className="font-bold text-sm group-hover/item:translate-x-1 transition-transform">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControllerDashboard;
