import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaCoins, FaLock, FaChevronRight,
    FaTicketAlt, FaMicrochip, FaTshirt, FaHeart
} from 'react-icons/fa';
import { useUserWallet } from '../../hooks/useUserWallet';

const RewardsPage = () => {
    const navigate = useNavigate();
    const { wallet } = useUserWallet();
    const [activeTab, setActiveTab] = useState('All');

    const categories = ['All', 'Vouchers', 'Electronics', 'Merch', 'Donations'];

    const items = {
        Vouchers: [
            { id: 1, brand: 'Amazon Pay', offer: '₹500 Gift Voucher', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', bg: 'bg-[#FF9900]/5', coins: 1500, icon: <FaTicketAlt /> },
            { id: 2, brand: 'Uber', offer: '40% Off on next 5 rides', image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg', bg: 'bg-slate-50', coins: 800, icon: <FaTicketAlt /> },
            { id: 3, brand: 'Domino\'s', offer: 'Free Garlic Bread on ₹399', image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg', bg: 'bg-white', coins: 300, icon: <FaTicketAlt /> },
            { id: 7, brand: 'Sun NXT', offer: 'Rs.150 Off On Annual Premium Plan', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2000&auto=format&fit=crop', bg: 'bg-red-50', coins: 500, icon: <FaTicketAlt /> },
            { id: 8, brand: 'Sony LIV', offer: 'Rs.139 Off on 1 Month Premium Pack', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2000&auto=format&fit=crop', bg: 'bg-blue-50', coins: 400, isNew: true, icon: <FaTicketAlt /> },
        ],
        Electronics: [
            { id: 4, brand: 'Nano Banana', offer: 'Pro Wireless Earbuds', image: 'https://images.unsplash.com/photo-1572569533902-4e69d807aa11?auto=format&fit=crop&w=400', bg: 'bg-slate-50', coins: 5000, icon: <FaMicrochip /> },
            { id: 5, brand: 'Nano Banana', offer: 'Smart Watch Series X', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400', bg: 'bg-slate-100', coins: 8000, isNew: true, icon: <FaMicrochip /> },
        ],
        Merch: [
            { id: 9, brand: 'Nano Banana', offer: 'Recycled Plastic Bottle Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400', bg: 'bg-white', coins: 2500, icon: <FaTshirt /> },
        ],
        Donations: [
            { id: 10, brand: 'Greenpeace', offer: 'Plant 10 Trees in your name', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop', bg: 'bg-green-50', coins: 1000, icon: <FaHeart /> },
            { id: 11, brand: 'WWF', offer: 'Adopt a Snow Leopard', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000&auto=format&fit=crop', bg: 'bg-slate-50', coins: 1500, icon: <FaHeart /> },
        ]
    };

    const getFilteredItems = () => {
        if (activeTab === 'All') {
            return Object.values(items).flat();
        }
        return items[activeTab] || [];
    };

    return (
        <div className="min-h-screen bg-slate-50/30">
            {/* Navbar for Mobile/Back */}
            <div className="bg-white px-6 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-white/80">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-100 transition-all">
                        <FaArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">Rewards Store</h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Spend your hard-earned coins</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
                    <FaCoins className="text-amber-500 text-sm" />
                    <span className="text-amber-700 font-black text-sm">{wallet?.coinsBalance || 0}</span>
                </div>
            </div>

            {/* Category Browser */}
            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 ${activeTab === cat
                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-105'
                                : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100 shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {getFilteredItems().map((v) => (
                        <div key={v.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-2">
                            <div className={`h-56 ${v.bg} relative flex items-center justify-center p-8 overflow-hidden`}>
                                {v.isNew && (
                                    <div className="absolute top-5 left-5 bg-rose-500 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl z-10">
                                        <span className="animate-pulse text-[10px]">NEW</span>
                                    </div>
                                )}
                                <img
                                    src={v.image}
                                    alt={v.brand}
                                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl rounded-xl"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg text-xs">{v.icon}</div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{v.brand}</span>
                                </div>
                                <h3 className="text-sm font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-900 transition-colors mb-auto">
                                    {v.offer}
                                </h3>

                                <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <FaCoins className="text-amber-500" size={14} />
                                        <span className="font-black text-slate-700 text-sm">{v.coins}</span>
                                    </div>
                                    <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl font-black text-[8px] uppercase tracking-widest flex items-center gap-2 group-hover:bg-slate-100 transition-all border border-slate-100/50">
                                        <FaLock size={10} className="mb-0.5" /> Redeem
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {getFilteredItems().length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <FaLock className="text-slate-200 text-3xl" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No rewards available in this category yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RewardsPage;
