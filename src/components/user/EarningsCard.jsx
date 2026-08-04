import React from 'react';
import { FaWallet, FaCoins } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatting';

const EarningsCard = ({ wallet, loading }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FaWallet size={100} />
                </div>
                <h3 className="text-primary-100 text-sm font-medium mb-1">Wallet Balance</h3>
                <div className="text-3xl font-bold">
                    {loading ? '...' : formatCurrency(wallet.walletBalance)}
                </div>
                <p className="text-xs text-primary-200 mt-2">Proceeds from working products</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FaCoins size={100} />
                </div>
                <h3 className="text-yellow-100 text-sm font-medium mb-1">Jigyasa Coins</h3>
                <div className="text-3xl font-bold">
                    {loading ? '...' : `${wallet.coinsBalance}`}
                </div>
                <p className="text-xs text-yellow-100 mt-2">Earned from E-Waste collection</p>
            </div>
        </div>
    );
};

export default EarningsCard;
