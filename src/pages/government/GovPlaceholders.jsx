import React from 'react';

const PlaceholderPage = ({ title, desc }) => (
    <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-xl font-black text-slate-800">{title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
            <h2 className="text-lg font-bold text-slate-600 mb-2">Coming Soon</h2>
            <p className="text-sm">This section is currently under development.</p>
        </div>
    </div>
);

export const GovReportsPage = () => <PlaceholderPage title="Reports" desc="Generate and export system reports" />;
export const GovAnalyticsPage = () => <PlaceholderPage title="AI Analytics" desc="Advanced predictive insights" />;
export const GovRecyclersPage = () => <PlaceholderPage title="Recyclers" desc="Manage recycling partners" />;
export const GovNotificationsPage = () => <PlaceholderPage title="Notifications" desc="System alerts and broadcasts" />;
export const GovSettingsPage = () => <PlaceholderPage title="Settings" desc="Platform configuration" />;
