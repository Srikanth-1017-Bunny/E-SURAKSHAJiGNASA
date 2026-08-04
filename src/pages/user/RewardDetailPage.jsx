import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRewards } from '../../hooks/useRewards';
import { useUserWallet } from '../../hooks/useUserWallet';
import { FaArrowLeft, FaCoins, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatting';

const RewardDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { rewards, redeemReward } = useRewards();
    const { wallet } = useUserWallet();
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [errorMsg, setErrorMsg] = useState('');

    const reward = rewards.find(r => r.id === id);

    if (!reward) {
        // Because rewards are loaded in the hook, validation might need to wait or check loading state. 
        // For simplicity, if not found (and assuming hook loaded), show not found.
        return <div className="p-8 text-center">Reward not found or loading...</div>;
    }

    const canAfford = reward.costType === 'coins'
        ? (wallet.coinsBalance || 0) >= reward.cost
        : (wallet.walletBalance || 0) >= reward.cost;

    const handleRedeem = async () => {
        if (!canAfford) return;
        setStatus('processing');
        try {
            await redeemReward(reward);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-4xl">
                        <FaCheckCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Redemption Successful!</h2>
                    <p className="text-gray-500 mb-8">You have successfully redeemed <strong>{reward.title}</strong>. Check your email for details.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => navigate('/user/wallet')} className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">
                            Go to Wallet
                        </button>
                        <button onClick={() => navigate('/user/rewards')} className="w-full py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl">
                            Browse More Rewards
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <button onClick={() => navigate('/user/rewards')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6">
                    <FaArrowLeft /> Back to Rewards
                </button>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Image Section */}
                    <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                        {reward.image ? (
                            <img src={reward.image} alt={reward.title} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <div className="mb-1 text-primary-600 font-semibold tracking-wide uppercase text-sm">{reward.category}</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{reward.title}</h1>

                        <div className="bg-gray-50 p-4 rounded-xl mb-6">
                            <div className="font-bold text-lg mb-1">Cost</div>
                            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                {reward.costType === 'coins' ? (
                                    <>
                                        <FaCoins className="text-yellow-500" />
                                        {reward.cost.toLocaleString()} Coins
                                    </>
                                ) : (
                                    formatCurrency(reward.cost)
                                )}
                            </div>
                        </div>

                        <div className="prose text-gray-600 mb-8">
                            <h3 className="text-gray-900 font-semibold mb-2">Description</h3>
                            <p>{reward.description}</p>
                        </div>

                        <div className="mt-auto">
                            {status === 'error' && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                                    <FaExclamationCircle /> {errorMsg || "Redemption failed."}
                                </div>
                            )}

                            <button
                                onClick={handleRedeem}
                                disabled={!canAfford || status === 'processing'}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 ${canAfford
                                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {status === 'processing' ? 'Processing...' : (
                                    canAfford ? 'Redeem Now' : `Insufficient ${reward.costType === 'coins' ? 'Coins' : 'Balance'}`
                                )}
                            </button>
                            {!canAfford && (
                                <p className="text-center text-sm text-red-500 mt-2 font-medium">
                                    You need {reward.cost - (reward.costType === 'coins' ? wallet.coinsBalance : wallet.walletBalance)} more {reward.costType === 'coins' ? 'coins' : 'rupees'} to redeem this.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardDetailPage;
