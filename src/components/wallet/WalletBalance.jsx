import React from 'react';
import { formatCurrency } from '../../utils/formatting';
import { FaWallet, FaCoins } from 'react-icons/fa';

const WalletBalance = ({ wallet }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <FaWallet className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-primary-100 text-sm font-medium">Main Balance</p>
                        <h3 className="text-3xl font-bold">{formatCurrency(wallet.walletBalance)}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <FaCoins className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-yellow-100 text-sm font-medium">Jigyasa Coins</p>
                        <h3 className="text-3xl font-bold">{wallet.coinsBalance?.toLocaleString()} c</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletBalance;
