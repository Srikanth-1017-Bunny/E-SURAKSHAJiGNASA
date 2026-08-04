import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Star, Package, Trophy, CreditCard, Edit } from 'lucide-react';

const CollectorProfilePage = () => {
    const { currentUser } = useAuth();

    return (
        <div className="space-y-6 max-w-[900px] mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-white to-emerald-50/60 p-5 rounded-2xl shadow-sm border border-slate-100">
                <h1 className="text-xl font-black text-slate-800">My Profile</h1>
                <p className="text-sm text-slate-500 mt-0.5">Your personal and professional details</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex flex-wrap items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-emerald-200">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                                (currentUser?.displayName?.[0] || currentUser?.name?.[0] || 'C').toUpperCase()
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Shield size={13} className="text-white" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-black text-slate-800">{currentUser?.displayName || currentUser?.name || 'Collector'}</h2>
                        <p className="text-emerald-600 font-bold text-sm mt-0.5 flex items-center gap-1">
                            <Shield size={13} /> Verified Collector
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3">
                            {currentUser?.email && (
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                                    <Mail size={12} /> {currentUser.email}
                                </span>
                            )}
                            {currentUser?.phone && (
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                                    <Phone size={12} /> {currentUser.phone}
                                </span>
                            )}
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                        <Edit size={14} /> Edit Profile
                    </button>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Personal Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                        <User size={16} className="text-emerald-600" /> Personal Information
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Full Name', value: currentUser?.displayName || currentUser?.name || '—' },
                            { label: 'Email', value: currentUser?.email || '—' },
                            { label: 'Phone', value: currentUser?.phone || '—' },
                            { label: 'Role', value: 'Collector' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                                <span className="text-sm font-bold text-slate-700">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                        <MapPin size={16} className="text-emerald-600" /> Service Area
                    </h3>
                    {currentUser?.address ? (
                        <div className="space-y-3">
                            {[
                                { label: 'Street', value: currentUser.address.street || '—' },
                                { label: 'City', value: currentUser.address.city || '—' },
                                { label: 'State', value: currentUser.address.state || '—' },
                                { label: 'Pincode', value: currentUser.address.pincode || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                                    <span className="text-sm font-bold text-slate-700">{value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-28 text-slate-400">
                            <MapPin size={24} className="mb-2 text-slate-300" />
                            <p className="text-sm font-bold">No address on file</p>
                        </div>
                    )}
                </div>

                {/* Performance */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                        <Trophy size={16} className="text-amber-500" /> Performance
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="flex text-amber-400 justify-center">
                                {[1,2,3,4].map(i => <Star key={i} size={20} className="fill-current" />)}
                                <Star size={20} className="text-slate-200" />
                            </div>
                            <p className="text-2xl font-black text-slate-800 mt-1">4.8</p>
                            <p className="text-xs text-slate-400">Rating</p>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                <Package className="text-emerald-600 mx-auto mb-1" size={18} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Pickups</p>
                                <p className="font-black text-slate-800">{currentUser?.completedPickups || 0}</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-3 text-center">
                                <Trophy className="text-amber-500 mx-auto mb-1" size={18} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Rank</p>
                                <p className="font-black text-slate-800">#1</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                        <CreditCard size={16} className="text-blue-600" /> Payment Details
                    </h3>
                    {currentUser?.bankDetails ? (
                        <div className="space-y-3">
                            {[
                                { label: 'Account No', value: currentUser.bankDetails.accountNumber || '—' },
                                { label: 'IFSC', value: currentUser.bankDetails.ifsc || '—' },
                                { label: 'UPI ID', value: currentUser.bankDetails.upiId || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                                    <span className="text-sm font-bold text-slate-700">{value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-28 text-slate-400">
                            <CreditCard size={24} className="mb-2 text-slate-300" />
                            <p className="text-sm font-bold">No bank details</p>
                            <p className="text-xs mt-0.5">Contact admin to add</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectorProfilePage;
