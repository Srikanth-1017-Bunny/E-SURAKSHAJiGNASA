import React from 'react';
import { formatCurrency, formatTime } from '../../utils/formatting';
import { FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';

const TransactionHistory = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-dashed">
                <div className="text-gray-300 text-4xl mb-3 flex justify-center"><FaExchangeAlt /></div>
                <p className="text-gray-500">No transactions yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="divide-y">
                {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {tx.type === 'credit' ? <FaArrowDown className="text-sm" /> : <FaArrowUp className="text-sm" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{tx.description || 'Transaction'}</p>
                                <p className="text-xs text-gray-500">{formatTime(tx.createdAt)}</p>
                            </div>
                        </div>
                        <div className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-800'
                            }`}>
                            {tx.type === 'credit' ? '+' : '-'}
                            {tx.currency === 'COINS'
                                ? `${tx.amount} coins`
                                : formatCurrency(tx.amount)
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
