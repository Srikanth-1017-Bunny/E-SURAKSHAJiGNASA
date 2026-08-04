import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { FaTruck, FaClock, FaTrash, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Countdown Timer Component
const CountdownTimer = ({ createdAt, status }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        if (['Verified', 'Completed'].includes(status)) {
            setTimeLeft('Resolved');
            return;
        }

        const updateTimer = () => {
            if (!createdAt) return;
            const createdMs = createdAt.seconds ? createdAt.seconds * 1000 : new Date(createdAt).getTime();
            const targetMs = createdMs + (24 * 60 * 60 * 1000);
            const now = Date.now();
            const diff = targetMs - now;

            if (diff <= 0) {
                setTimeLeft('SLA Overdue');
                setIsOverdue(true);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours} Hours ${minutes} Mins Remaining`);
                setIsOverdue(false);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, [createdAt, status]);

    if (timeLeft === 'Resolved') {
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">SLA Resolved</span>;
    }
    if (isOverdue) {
        return <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">Overdue</span>;
    }
    return (
        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider">
            {timeLeft}
        </span>
    );
};

const MyRequestsPage = () => {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        setLoading(true);
        const q = query(
            collection(db, 'tickets'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort: most recent first
            data.sort((a, b) => {
                const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
                const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
                return (bTime || 0) - (aTime || 0);
            });
            setRequests(data);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to tickets:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to cancel this disposal ticket?")) {
            try {
                await deleteDoc(doc(db, 'tickets', id));
                toast.success("Disposal ticket cancelled");
            } catch (error) {
                toast.error("Failed to cancel ticket");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Disposal Requests</h1>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Track and manage your active e-waste collection tickets</p>
                </header>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold text-lg uppercase tracking-wider">No active disposal requests found</p>
                        </div>
                    ) : (
                        requests.map((item) => (
                            <div key={item.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center flex-grow">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner flex-shrink-0 flex items-center justify-center text-slate-400">
                                            {item.image ? (
                                                <img src={item.image} alt={item.deviceModel} className="w-full h-full object-cover" />
                                            ) : (
                                                <img
                                                    src={
                                                        item.deviceCategory === 'Mobile' ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500' :
                                                        item.deviceCategory === 'Laptop' ? 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500' :
                                                        item.deviceCategory === 'Television' ? 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=500' :
                                                        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500'
                                                    }
                                                    alt={item.deviceModel}
                                                    className="w-full h-full object-cover opacity-60"
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-3 flex-grow">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-xl font-[1000] text-slate-800 uppercase tracking-tight">
                                                    {item.deviceBrand} {item.deviceModel}
                                                </h3>
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                    {item.status}
                                                </span>
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                    Grade {item.grade}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-xs">
                                                <div className="flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-slate-300" />
                                                    <span>Lat: {item.location?.lat?.toFixed(4)}, Lng: {item.location?.lng?.toFixed(4)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-slate-300" />
                                                    <CountdownTimer createdAt={item.createdAt} status={item.status} />
                                                </div>
                                                {item.collectorName && (
                                                    <div className="flex items-center gap-2">
                                                        <FaTruck className="text-blue-500" />
                                                        <span className="text-blue-700 font-extrabold uppercase">Collector: {item.collectorName}</span>
                                                    </div>
                                                )}
                                                {item.otp && item.status === 'Assigned' && (
                                                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                                        <FaShieldAlt className="text-teal-600" />
                                                        <span className="text-slate-600 font-bold text-[10px] uppercase tracking-wider">Pickup OTP:</span>
                                                        <span className="text-sm font-[1000] text-teal-700 tracking-widest">{item.otp}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col justify-between items-end gap-4 min-w-[120px]">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Green Coins Reward</p>
                                            <p className="text-2xl font-[1000] text-amber-600 tracking-tight mt-1">{item.estimatedValue}</p>
                                        </div>
                                        {['Submitted', 'Assigned'].includes(item.status) && (
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors shadow-sm bg-white border border-slate-100"
                                                title="Cancel Request"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRequestsPage;
