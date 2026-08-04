import React from 'react';
import { Outlet } from 'react-router-dom';
import GovernmentSidebar from '../components/government/GovernmentSidebar';

const GovernmentLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <GovernmentSidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <div className="max-w-[1550px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default GovernmentLayout;
