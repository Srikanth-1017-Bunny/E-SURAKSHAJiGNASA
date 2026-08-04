import React from 'react';
import { Outlet } from 'react-router-dom';
import CollectorSidebar from '../components/collector/CollectorSidebar';

const CollectorLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <CollectorSidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <div className="max-w-[1400px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CollectorLayout;
