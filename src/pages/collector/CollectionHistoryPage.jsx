import React from 'react';
import { useCollector } from '../../hooks/useCollector';
import { FaHistory, FaCheckCircle, FaRupeeSign, FaCalendarDay, FaBox } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../../utils/formatting';

const CollectionHistoryPage = () => {
    const { history, loading } = useCollector();

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaHistory className="text-indigo-600" /> Collection History
                <span className="bg-slate-100 text-slate-500 text-sm py-1 px-3 rounded-full">{history.length}</span>
            </h1>

            {history.length > 0 ? (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Completion Date</th>
                                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Incentive</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                    <FaBox className="text-xl" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-lg leading-tight">{item.productTitle}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">ID: {item.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                <FaCalendarDay className="text-slate-300" />
                                                {formatDate(item.completedAt)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="font-black text-emerald-600 text-lg py-1 px-3 bg-emerald-50 rounded-lg">
                                                {formatCurrency(item.incentive || 0)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <FaCheckCircle className="text-6xl text-slate-200 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-slate-800">No History Yet</h3>
                    <p className="text-slate-400 font-medium mt-2">Your completed collections will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default CollectionHistoryPage;
