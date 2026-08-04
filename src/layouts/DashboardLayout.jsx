import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { Bot, Mic } from 'lucide-react';

const DashboardLayout = ({ role = 'user' }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar 
                role={role} 
                isMobileOpen={isMobileOpen} 
                setIsMobileOpen={setIsMobileOpen} 
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <Header setIsMobileOpen={setIsMobileOpen} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            {/* Global AI Assistant FAB */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <button className="w-12 h-12 bg-white text-secondary-600 rounded-full shadow-lg border border-secondary-100 flex items-center justify-center hover:bg-secondary-50 transition-transform hover:scale-105">
                    <Mic className="w-5 h-5" />
                </button>
                <button className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-transform hover:scale-110">
                    <Bot className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default DashboardLayout;
