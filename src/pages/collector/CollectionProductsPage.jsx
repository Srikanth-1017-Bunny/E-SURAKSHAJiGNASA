import React, { useState } from 'react';
import { useCollector } from '../../hooks/useCollector';
import { FaTruck, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaRecycle, FaIndustry, FaTimes } from 'react-icons/fa';
import { formatDate } from '../../utils/formatting';

const RecyclerModal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedRecycler, setSelectedRecycler] = useState('');

    if (!isOpen) return null;

    const recyclers = [
        { id: 'R001', name: 'EcoTech Recyclers Ltd', capacity: 'High', location: 'Industrial Area Phase 1' },
        { id: 'R002', name: 'GreenCycle Solutions', capacity: 'Medium', location: 'Tech Park Zone' },
        { id: 'R003', name: 'Urban Mining Corp', capacity: 'High', location: 'City Outskirts' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-scaleIn">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">Select Recycler</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Authorized Partners</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100">
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {recyclers.map(r => (
                        <div
                            key={r.id}
                            onClick={() => setSelectedRecycler(r.name)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedRecycler === r.name ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${selectedRecycler === r.name ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                <FaIndustry />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{r.name}</h4>
                                <p className="text-xs text-slate-500">{r.location}</p>
                            </div>
                            <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-100 uppercase tracking-wider text-slate-400">
                                {r.capacity} Cap
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => onConfirm(selectedRecycler)}
                    disabled={!selectedRecycler}
                    className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                    Authorize Transfer
                </button>
            </div>
        </div>
    );
};

const CollectionProductsPage = () => {
    const { assignments, loading, submitUTR, assignToRecycler } = useCollector();
    const [utrInput, setUtrInput] = useState({});

    // Recycler Modal State
    const [recyclerModalOpen, setRecyclerModalOpen] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);

    const handleUtrChange = (id, value) => {
        setUtrInput(prev => ({ ...prev, [id]: value }));
    };

    const handleRecyclerClick = (id) => {
        setSelectedCollectionId(id);
        setRecyclerModalOpen(true);
    };

    const onRecyclerConfirm = async (recyclerName) => {
        await assignToRecycler(selectedCollectionId, recyclerName);
        setRecyclerModalOpen(false);
        setSelectedCollectionId(null);
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaTruck className="text-indigo-600" />
                Active Assignments
                <span className="bg-slate-100 text-slate-500 text-sm py-1 px-3 rounded-full">{assignments.length}</span>
            </h1>

            {assignments.length > 0 ? (
                <div className="grid gap-6">
                    {assignments.map(item => (
                        <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start group hover:shadow-lg transition-all">

                            {/* Icon / Status */}
                            <div className="flex-shrink-0">
                                {item.status === 'collected' ? (
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl">
                                        <FaCheckCircle />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl animate-pulse">
                                        <FaTruck />
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 w-full space-y-4">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{item.productTitle}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-2">
                                            <span>ID: {item.id.slice(0, 8)}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className={`${item.status === 'collected' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {item.status.replace('_', ' ')}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned</p>
                                        <p className="text-sm font-bold text-slate-700">{formatDate(item.assignedAt)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-rose-500 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Location</p>
                                            <p className="text-sm font-bold text-slate-700 leading-tight mt-1">{item.userAddress?.fullAddress || 'Address not available'}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">{item.userAddress?.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaPhone className="text-indigo-500" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                                            <p className="text-sm font-bold text-slate-700 mt-1">{item.userPhone || 'No contact'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-2">
                                    {item.status === 'assigned' && (
                                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                                            <div className="flex-1 w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 focus-within:border-indigo-400 transition-colors">
                                                <span className="text-xs font-black text-slate-400 uppercase">UTR / ID:</span>
                                                <input
                                                    type="text"
                                                    value={utrInput[item.id] || ''}
                                                    onChange={(e) => handleUtrChange(item.id, e.target.value)}
                                                    placeholder="Enter transaction ref..."
                                                    className="flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => submitUTR(item.id, utrInput[item.id])}
                                                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                                            >
                                                Confirm Pickup & Pay
                                            </button>
                                        </div>
                                    )}

                                    {item.status === 'collected' && (
                                        <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                            <div className="flex items-center gap-3">
                                                <FaCheckCircle className="text-emerald-500" />
                                                <p className="text-sm font-bold text-emerald-800">Item Collected</p>
                                            </div>
                                            <button
                                                onClick={() => handleRecyclerClick(item.id)}
                                                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
                                            >
                                                Send to Recycler <FaRecycle />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <FaTruck className="text-6xl text-slate-200 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-slate-800">No Active Assignments</h3>
                    <p className="text-slate-400 font-medium mt-2">Accept new tickets from the dashboard to get started.</p>
                </div>
            )}

            <RecyclerModal
                isOpen={recyclerModalOpen}
                onClose={() => setRecyclerModalOpen(false)}
                onConfirm={onRecyclerConfirm}
            />
        </div>
    );
};

export default CollectionProductsPage;
