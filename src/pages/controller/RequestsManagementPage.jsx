import React, { useState } from 'react';
import { useController } from '../../hooks/useController';
import { FaCalendarAlt, FaUser, FaBox, FaCheck, FaTimes, FaTruck } from 'react-icons/fa';
import { formatDate } from '../../utils/formatting';
import { Link } from 'react-router-dom';

const TabButton = ({ active, label, onClick, count }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${active
            ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
    >
        {label}
        {count !== undefined && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${active ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                {count}
            </span>
        )}
    </button>
);

const RequestsManagementPage = () => {
    const { requests, loading, assignCollector, updateRequestStatus, users } = useController();
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedCollector, setSelectedCollector] = useState('');

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    const filteredRequests = requests.filter(req => {
        if (activeTab === 'pending') return req.status === 'pending' || req.status === 'open'; // Handle 'open' or 'pending'
        if (activeTab === 'assigned') return req.status === 'assigned' || req.status === 'picked_up';
        if (activeTab === 'completed') return req.status === 'completed';
        if (activeTab === 'rejected') return req.status === 'rejected';
        return true;
    });

    const collectors = users.filter(u => u.role === 'collector');

    const handleAssign = (requestId) => {
        if (!selectedCollector) {
            alert("Please select a collector");
            return;
        }
        assignCollector(requestId, selectedCollector);
        setSelectedCollector(''); // Reset
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Requests</h1>
                <p className="text-gray-500">Track and assign waste collection requests.</p>
            </header>

            {/* Tabs */}
            <div className="flex border-b mb-8 overflow-x-auto">
                <TabButton
                    label="Pending"
                    active={activeTab === 'pending'}
                    onClick={() => setActiveTab('pending')}
                    count={requests.filter(r => r.status === 'pending').length}
                />
                <TabButton
                    label="Assigned & In Progress"
                    active={activeTab === 'assigned'}
                    onClick={() => setActiveTab('assigned')}
                    count={requests.filter(r => ['assigned', 'picked_up'].includes(r.status)).length}
                />
                <TabButton
                    label="Completed"
                    active={activeTab === 'completed'}
                    onClick={() => setActiveTab('completed')}
                />
                <TabButton
                    label="Rejected"
                    active={activeTab === 'rejected'}
                    onClick={() => setActiveTab('rejected')}
                />
            </div>

            {/* Content */}
            <div className="space-y-4">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Details */}
                                <div className="space-y-2 flex-grow">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-gray-900">{req.productTitle}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {req.status?.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-gray-400" />
                                            <span>User: {req.userName || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400" />
                                            <span>Date: {formatDate(req.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaBox className="text-gray-400" />
                                            <span>Type: {req.category}</span>
                                        </div>
                                    </div>

                                    {req.userAddress && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                            <strong>Pickup Location:</strong> {req.userAddress.fullAddress}, {req.userAddress.city}, {req.userAddress.pincode}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="md:w-72 shrink-0 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                                    {activeTab === 'pending' && (
                                        <>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 mb-1 block">Assign Collector</label>
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    onChange={(e) => setSelectedCollector(e.target.value)}
                                                    value={selectedCollector}
                                                >
                                                    <option value="">Select Collector...</option>
                                                    {collectors.map(c => (
                                                        <option key={c.id} value={c.uid}>{c.displayName || c.email} ({c.serviceArea || 'General'})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAssign(req.id)}
                                                    disabled={!selectedCollector}
                                                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    <FaTruck /> Assign
                                                </button>
                                                <button
                                                    onClick={() => updateRequestStatus(req.id, 'rejected')}
                                                    className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                                    title="Reject Request"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'assigned' && req.status === 'picked_up' && (
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-2">Item picked up via UTR: <strong>{req.utr}</strong></p>
                                            <button
                                                onClick={() => updateRequestStatus(req.id, 'completed')}
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                                            >
                                                <FaCheck /> Mark Completed
                                            </button>
                                        </div>
                                    )}

                                    <Link
                                        to={`/controller/request/${req.id}`}
                                        className="text-center text-sm text-gray-500 hover:text-emerald-600 font-medium"
                                    >
                                        View Full Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                        <p className="text-gray-400">No requests found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsManagementPage;
