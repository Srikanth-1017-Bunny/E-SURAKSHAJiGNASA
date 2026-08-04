import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-red-500">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaLock className="text-2xl" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Restricted</h1>
                <p className="text-slate-500 mb-8 font-medium">
                    Your current role does not have authorization to view this terminal. If you believe this is a mistake, please contact the system administrator.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-8 text-left">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Support Channel</p>
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        admin@green-tech.solutions
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        to="/"
                        className="block w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-[0.98]"
                    >
                        Return to Safety
                    </Link>
                    <Link
                        to="/login"
                        className="block w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-50 transition active:scale-[0.98]"
                    >
                        Switch Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
