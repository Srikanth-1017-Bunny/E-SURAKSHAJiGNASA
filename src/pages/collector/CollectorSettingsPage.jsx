import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Bell, Shield, Eye, Moon, Globe, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollectorSettingsPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState({ newAssignment: true, completion: true, wallet: true });
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="space-y-6 max-w-[700px] mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-white to-emerald-50/60 p-5 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-xl font-black text-slate-800">Settings</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage your account preferences</p>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Bell className="text-emerald-600" size={17} />
                    </div>
                    <h3 className="font-black text-slate-800">Notifications</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { key: 'newAssignment', label: 'New Assignments', desc: 'Get notified when a pickup is assigned to you' },
                        { key: 'completion', label: 'Pickup Completed', desc: 'Confirmation when you mark a pickup as done' },
                        { key: 'wallet', label: 'Wallet Updates', desc: 'Notifications about wallet credits and debits' },
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-800">{label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                            </div>
                            <button
                                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                                className={`relative w-12 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform shadow-sm ${notifications[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Moon className="text-purple-600" size={17} />
                    </div>
                    <h3 className="font-black text-slate-800">Appearance</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-800">Dark Mode</p>
                        <p className="text-xs text-slate-400 mt-0.5">Switch to dark interface</p>
                    </div>
                    <button
                        onClick={() => setDarkMode(d => !d)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-500' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform shadow-sm ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Shield className="text-blue-600" size={17} />
                    </div>
                    <h3 className="font-black text-slate-800">Security</h3>
                </div>
                <button
                    onClick={() => navigate('/collector/change-password')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Eye size={16} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">Change Password</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                </button>
            </div>

            {/* Logout */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-bold"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default CollectorSettingsPage;
