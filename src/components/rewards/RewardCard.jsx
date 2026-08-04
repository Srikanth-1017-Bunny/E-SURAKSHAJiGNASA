import React from 'react';
import { formatCurrency } from '../../utils/formatting';
import { FaCoins } from 'react-icons/fa';

const RewardCard = ({ reward, onRedeem }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden flex flex-col h-full">
            <div className="aspect-[4/3] bg-gray-100 relative">
                {reward.image ? (
                    <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded backdrop-blur-sm">
                    {reward.category || 'General'}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{reward.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{reward.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <div className="font-bold text-primary-600 flex items-center gap-1">
                        {reward.costType === 'coins' ? (
                            <>
                                <FaCoins className="text-yellow-500" />
                                {reward.cost}
                            </>
                        ) : (
                            formatCurrency(reward.cost)
                        )}
                    </div>
                    <button
                        onClick={() => onRedeem(reward)}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RewardCard;
