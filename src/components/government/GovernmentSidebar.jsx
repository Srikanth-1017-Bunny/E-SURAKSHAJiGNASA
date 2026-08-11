import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard, FileText, Users, MapPin,
    FileBarChart, BarChart2, Recycle, Bell, Settings,
    Shield, ChevronRight
} from 'lucide-react';

const GovernmentSidebar = ({ onClose }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/government/dashboard', icon: LayoutDashboard },
        { name: 'Tickets', path: '/government/tickets', icon: FileText },
        { name: 'Collectors', path: '/government/collectors', icon: Users },
        { name: 'Map View', path: '/government/map', icon: MapPin },
        { name: 'Reports', path: '/government/reports', icon: FileBarChart },
        { name: 'Analytics', path: '/government/analytics', icon: BarChart2 },
        { name: 'Recyclers', path: '/government/recyclers', icon: Recycle },
        { name: 'Notifications', path: '/government/notifications', icon: Bell, badge: 6 },
        { name: 'Settings', path: '/government/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#0d1b2a] text-white flex flex-col h-full overflow-y-auto shadow-2xl md:shadow-none border-r border-slate-800">
            {/* Header / Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-sm font-bold tracking-wider leading-tight">E-SURAKSHA</h1>
                    <p className="text-[10px] text-blue-200">Municipal Corporation</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => onClose && onClose()}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                            ${isActive ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <item.icon size={18} />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Profile */}
            <div className="p-4 mt-auto">
                <div
                    onClick={handleLogout}
                    className="bg-red-500/10 rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:bg-red-500/20 text-red-400 transition-colors mb-3 text-sm font-bold justify-center"
                >
                    Log Out
                </div>
                <div className="bg-[#1b263b] rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center border border-slate-600">
                        {currentUser?.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-lg">{currentUser?.name?.[0] || currentUser?.displayName?.[0] || 'M'}</span>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">{currentUser?.name || currentUser?.displayName || 'M. Ramesh'}</p>
                        <p className="text-[10px] text-slate-400 truncate">Municipal Officer</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                </div>
            </div>
        </aside>
    );
};

export default GovernmentSidebar;
