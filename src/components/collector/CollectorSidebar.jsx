import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard, Map, ClipboardList, Ticket,
    Package, Wallet, TrendingUp, Bell,
    AlertTriangle, User, Settings, Phone,
    Shield, ChevronRight, Headset
} from 'lucide-react';

const CollectorSidebar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard',         path: '/collector/home',      icon: LayoutDashboard },
        { name: 'My Route',          path: '/collector/route',     icon: Map },
        { name: 'Upcoming Pickups',  path: '/collector/tickets',   icon: ClipboardList,  badge: null },
        { name: 'Ticket Queue',      path: '/collector/tickets',   icon: Ticket,         badge: null },
        { name: 'Recent Pickups',    path: '/collector/history',   icon: Package },
        { name: 'Earnings',          path: '/collector/earnings',  icon: TrendingUp },
        { name: 'Notifications',     path: '/collector/home',      icon: Bell,           badge: null },
        { name: 'Complaints',        path: '/collector/complaint', icon: AlertTriangle },
        { name: 'Profile',           path: '/collector/profile',   icon: User },
        { name: 'Settings',          path: '/collector/settings',  icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#063b2f] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50"
            style={{ scrollbarWidth: 'none' }}>

            {/* ── Logo / Header ─────────────────────── */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield size={22} className="text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-sm font-black tracking-widest leading-tight text-white">E-SURAKSHA</h1>
                    <p className="text-[10px] text-emerald-300 font-medium">Collector App</p>
                </div>
            </div>

            {/* ── Navigation ────────────────────────── */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name + item.path}
                        to={item.path}
                        end={item.path === '/collector/home'}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-150 group relative
                            ${isActive
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                                : 'text-emerald-100/70 hover:text-white hover:bg-white/8'
                            }
                        `}
                    >
                        <item.icon size={17} className="flex-shrink-0" />
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.badge !== undefined && item.badge !== null && (
                            <span className="text-[10px] font-black bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full leading-none">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── Profile Card ──────────────────────── */}
            <div className="px-3 pb-3">
                <button
                    onClick={() => navigate('/collector/profile')}
                    className="w-full bg-[#0b4b3d] hover:bg-white/10 transition-colors rounded-xl p-3 flex items-center gap-3 cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 overflow-hidden flex items-center justify-center border-2 border-emerald-500/50 flex-shrink-0">
                        {currentUser?.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-black text-base text-white">
                                {currentUser?.displayName?.[0]?.toUpperCase() || 'S'}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold truncate text-white leading-tight">
                            {currentUser?.displayName || 'Srikanth'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                            <p className="text-[10px] text-emerald-300 font-semibold">Online</p>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-emerald-500 flex-shrink-0" />
                </button>
            </div>

            {/* ── Need Help ─────────────────────────── */}
            <div className="px-3 pb-5">
                <div className="bg-[#0b4b3d] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Headset size={14} className="text-emerald-400" />
                        <span className="text-[11px] font-bold text-emerald-300">Need Help?</span>
                    </div>
                    <a
                        href="tel:18001234567"
                        className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        <Phone size={12} />
                        <span className="text-[12px] font-black tracking-wide">1800 123 4567</span>
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default CollectorSidebar;
