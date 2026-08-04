import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Leaf,
    Bell,
    ChevronRight,
    Recycle,
    Camera,
    Gift,
    Smartphone,
    ShoppingCart,
    Activity,
    Wind,
    TreePine,
    Zap,
    MapPin,
    History
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserWallet } from '../../hooks/useUserWallet';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import SplashScreen from '../../components/common/SplashScreen';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { wallet } = useUserWallet();
    const [stats, setStats] = useState({ total: 0, recycled: 12 });
    const [loading, setLoading] = useState(true);
    const [showIntro, setShowIntro] = useState(() => {
        return sessionStorage.getItem('splashScreenShown') !== 'true';
    });

    useEffect(() => {
        if (showIntro) {
            const timer = setTimeout(() => {
                setShowIntro(false);
                sessionStorage.setItem('splashScreenShown', 'true');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showIntro]);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(collection(db, 'tickets'), where('userId', '==', currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStats({
                total: tickets.length,
                recycled: tickets.filter(t => ['Verified', 'Completed'].includes(t.status)).length || 12, // fallback to 12 for UI demonstration
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);


    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    if (showIntro) {
        return <SplashScreen userName={currentUser?.displayName?.split(' ')[0]} showIntro={showIntro} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-teal-50 selection:text-teal-900 pb-20">
            {/* Minimal Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 font-bold shadow-sm border border-teal-200">
                            {currentUser?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Citizen Portal</span>
                            <h1 className="text-lg font-[1000] text-slate-900 tracking-tight leading-none">
                                E-Suraksha
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-teal-600 shadow-sm"
                        >
                            <Bell size={18} />
                        </motion.button>
                    </div>
                </header>

                {/* Hero Section */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-teal-900/20 border border-teal-700/50 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-900/80 to-transparent z-10"></div>

                    <div className="relative z-20 text-white max-w-xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-800/50 backdrop-blur-md rounded-full border border-teal-400/30">
                            <Leaf size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Green City Hero</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter leading-tight">
                            🌍 Welcome back, <span className="text-emerald-400">{currentUser?.displayName?.split(' ')[0] || 'Srikanth'}!</span>
                        </h2>
                        <p className="text-teal-100 text-lg font-medium leading-relaxed">
                            Let's make our city cleaner, one device at a time. You've already recycled <strong className="text-white">{stats.recycled} devices</strong> and prevented <strong className="text-emerald-300">24 kg of CO₂ emissions</strong>.
                        </p>
                    </div>

                    <div className="relative z-20 hidden md:block w-64 h-64">
                        <img src="https://illustrations.popsy.co/amber/environment.svg" alt="Environment Illustration" className="w-full h-full object-contain filter drop-shadow-2xl" />
                    </div>
                </motion.div>

                {/* Quick Overview Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Green Coins */}
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/user/awards')}>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                                <Trophy size={20} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">🟢 Green Coins</p>
                            <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">
                                <CountUp end={wallet?.coinsBalance || 0} separator="," />
                            </h3>
                        </div>
                    </motion.div>

                    {/* Devices Recycled */}
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                <Recycle size={20} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">♻ Devices Recycled</p>
                            <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">
                                <CountUp end={stats.recycled} />
                            </h3>
                        </div>
                    </motion.div>

                    {/* Environmental Impact CO2 */}
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                <Wind size={20} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">🌱 CO₂ Saved</p>
                            <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">
                                24 kg
                            </h3>
                        </div>
                    </motion.div>

                    {/* Trees Equivalent */}
                    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <TreePine size={20} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">🌳 Trees Equivalent</p>
                            <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">
                                4 Planted
                            </h3>
                        </div>
                    </motion.div>
                </div>



                {/* Featured Banner - AI Scan */}
                <motion.div
                    variants={itemVariants}
                    className="relative bg-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="absolute inset-0 opacity-40">
                        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200" alt="Tech Background" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10"></div>

                    <div className="relative z-20 text-white max-w-xl space-y-4">
                        <h2 className="text-3xl md:text-4xl font-[1000] tracking-tighter uppercase leading-none">Recycle Your Old Electronics</h2>
                        <p className="text-slate-300 text-sm font-semibold">
                            Turn unused devices into Green Coins and help build a cleaner city. Our AI will scan your device and provide an instant valuation.
                        </p>
                        <button onClick={() => navigate('/user/dispose')} className="mt-4 px-8 py-4 bg-teal-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/30">
                            <Camera size={18} /> Start AI Device Scan
                        </button>
                    </div>

                    <div className="relative z-20 hidden md:flex w-48 h-48 bg-white/5 border border-white/10 rounded-3xl items-center justify-center backdrop-blur-md">
                        <Camera size={64} className="text-teal-400" />
                        <div className="absolute inset-0 border-2 border-teal-500/50 rounded-3xl animate-pulse"></div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Environmental Storytelling */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-lg font-[1000] text-slate-900 uppercase">Your Impact</h3>
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <Wind className="text-emerald-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">🌍 You prevented <strong className="text-emerald-600">24 kg of CO₂</strong> emissions</p>
                                </div>
                            </div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                    <TreePine className="text-green-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">🌳 Equivalent to planting <strong className="text-green-600">4 trees</strong></p>
                                </div>
                            </div>
                            <div className="h-px w-full bg-slate-100"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <Zap className="text-amber-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">⚡ Saved enough energy to power a home for <strong className="text-amber-600">3 days</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rewards */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-[1000] text-slate-900 uppercase">Rewards</h3>
                            <button className="text-[10px] font-bold text-teal-600 uppercase tracking-widest hover:text-teal-800">View All</button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=200" alt="Amazon Voucher" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-slate-800">Amazon Voucher</h4>
                                    <p className="text-xs text-slate-500 mb-2">₹500 Gift Card</p>
                                    <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                                        <Trophy size={12} /> 1000 Coins
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=200" alt="Flipkart Voucher" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-slate-800">Flipkart Voucher</h4>
                                    <p className="text-xs text-slate-500 mb-2">₹250 Gift Card</p>
                                    <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                                        <Trophy size={12} /> 500 Coins
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-lg font-[1000] text-slate-900 uppercase">Recent Activity</h3>
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-6">
                            <div className="flex gap-4 relative">
                                <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200"></div>
                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                                    <MapPin className="text-teal-600" size={14} />
                                </div>
                                <div className="pb-4">
                                    <h4 className="text-sm font-bold text-slate-800">Pickup Completed</h4>
                                    <p className="text-xs text-slate-500">Your old laptop was collected.</p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Today, 10:30 AM</span>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200"></div>
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                                    <Trophy className="text-amber-600" size={14} />
                                </div>
                                <div className="pb-4">
                                    <h4 className="text-sm font-bold text-slate-800">Green Coins Earned</h4>
                                    <p className="text-xs text-slate-500">+250 Coins for recycling.</p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Yesterday</span>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                                    <History className="text-indigo-600" size={14} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Pickup Scheduled</h4>
                                    <p className="text-xs text-slate-500">Collector assigned for smartphone.</p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Aug 1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
