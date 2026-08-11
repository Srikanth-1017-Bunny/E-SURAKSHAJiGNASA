import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CollectorSidebar from '../components/collector/CollectorSidebar';
import { Menu, X } from 'lucide-react';

const CollectorLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f8fafc] overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-[#063b2f] text-white p-4 flex items-center justify-between z-[60] shadow-md">
                <span className="font-black text-sm tracking-widest uppercase text-emerald-400">Collector App</span>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-1 hover:bg-white/10 rounded">
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/50 z-[40] backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Wrapper */}
            <div className={`fixed inset-y-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-[50] md:relative md:flex h-screen`}>
                <CollectorSidebar onClose={() => setIsMobileOpen(false)} />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full overflow-y-auto h-screen p-4 pt-20 md:pt-8 md:p-8">
                <div className="max-w-[1400px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CollectorLayout;
