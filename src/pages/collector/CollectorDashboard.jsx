import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    collection, onSnapshot, doc, updateDoc, getDoc,
    query, where, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Bell, MapPin, Navigation, CheckCircle,
    QrCode, Headset,
    X, Clock, Zap, ChevronRight, TrendingUp,
    Phone, Play, User as UserIcon, Compass,
    Package, ArrowRight, ExternalLink
} from 'lucide-react';

// ── Leaflet icon fix ─────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const makeIcon = (num, color = '#10b981') => new L.DivIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;">${num}</div>`,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isToday) return timeStr;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + `, ${timeStr}`;
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const getTodayStr = () =>
    new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

// ── Priority badge ────────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
    const cfg = {
        High:   'bg-red-100   text-red-600   border-red-200',
        Medium: 'bg-amber-100 text-amber-600 border-amber-200',
        Low:    'bg-emerald-100 text-emerald-600 border-emerald-200',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cfg[priority] || cfg.Low}`}>
            {priority || 'Low'}
        </span>
    );
};

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onDone }) => {
    useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
    const bg = type === 'success'
        ? 'from-emerald-500 to-teal-600 shadow-emerald-200'
        : 'from-blue-500 to-indigo-600 shadow-blue-200';
    return (
        <div className={`fixed bottom-6 right-6 z-[99999] bg-gradient-to-r ${bg} text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3`}
            style={{ animation: 'slideUp 0.3s ease' }}>
            {type === 'success' ? <CheckCircle size={18} /> : <Zap size={18} />}
            <span className="font-bold text-sm">{message}</span>
        </div>
    );
};

// ── New Assignment Banner ─────────────────────────────────────────────────────
const NewAssignmentBanner = ({ assignment, onAccept, onDismiss }) => (
    <div className="fixed top-6 right-6 z-[99990] w-80 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden"
        style={{ animation: 'slideDown 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-white font-black text-sm">New Assignment!</span>
            </div>
            <button onClick={onDismiss} className="text-white/70 hover:text-white"><X size={15} /></button>
        </div>
        <div className="p-4">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {assignment.icon || '📦'}
                </div>
                <div>
                    <p className="font-black text-slate-800 text-sm">{assignment.item}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} />{assignment.pickupAddress || assignment.location}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                            <Clock size={9} />{assignment.scheduledTime}
                        </span>
                        <PriorityBadge priority={assignment.priority} />
                    </div>
                    {assignment.userName && (
                        <p className="text-[10px] text-blue-600 font-bold mt-1 flex items-center gap-1">
                            <UserIcon size={9} /> From: {assignment.userName}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onDismiss}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors">
                    Later
                </button>
                <button onClick={onAccept}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm flex items-center justify-center gap-1.5">
                    <Play size={12} /> Accept Now
                </button>
            </div>
        </div>
    </div>
);

// ── Ticket Detail Modal ───────────────────────────────────────────────────────
const TicketModal = ({ ticket, onClose, onComplete }) => {
    const [completing, setCompleting] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');

    const handleComplete = async () => {
        // Enforce OTP if ticket has one
        if (ticket.otp && otpInput !== String(ticket.otp)) {
            setOtpError('Invalid OTP. Please ask the citizen.');
            return;
        }

        setCompleting(true);
        try {
            // 1. Mark assignment as Completed
            if (ticket.firestoreId) {
                await updateDoc(doc(db, 'assignments', ticket.firestoreId), {
                    status: 'Completed',
                    completedAt: serverTimestamp(),
                });
            }

            // 2. If assignment links to a ticket, update it & credit rewards
            const ticketRef = ticket.ticketRef;
            if (ticketRef) {
                const ticketSnap = await getDoc(doc(db, 'tickets', ticketRef));
                if (ticketSnap.exists()) {
                    const ticketData = ticketSnap.data();

                    // 2a. Mark ticket as Completed
                    await updateDoc(doc(db, 'tickets', ticketRef), {
                        status: 'Completed',
                        completionTime: serverTimestamp(),
                    });

                    // 2b. Credit Green Coins to the citizen
                    const coinsToCredit = ticketData.estimatedValue || 0;
                    const citizenId = ticketData.userId;
                    if (citizenId && coinsToCredit > 0) {
                        await updateDoc(doc(db, 'users', citizenId), {
                            coinsBalance: increment(coinsToCredit),
                        });
                    }

                    // 2c. Credit pickup earnings to collector
                    const pickupEarning = Math.round(50 + coinsToCredit * 0.1); // base ₹50 + 10% of coin value
                    if (ticket.collectorId) {
                        await updateDoc(doc(db, 'users', ticket.collectorId), {
                            totalEarnings: increment(pickupEarning),
                            todayEarnings: increment(pickupEarning),
                        });
                    }
                }
            }
        } catch (e) { console.error('Error completing pickup:', e); }
        setTimeout(() => { onComplete(ticket); onClose(); }, 800);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                style={{ animation: 'slideUp 0.3s ease' }}>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-emerald-200 text-[11px] font-bold">{ticket.ticketId || ticket.id}</span>
                        <button onClick={onClose}
                            className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                    <p className="text-3xl mb-1">{ticket.icon || '📦'}</p>
                    <h3 className="text-lg font-black">{ticket.item}</h3>
                    <p className="text-emerald-200 text-xs mt-1 flex items-center gap-1">
                        <MapPin size={10} />{ticket.pickupAddress || ticket.location}
                    </p>
                </div>
                <div className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Scheduled</p>
                            <p className="text-xs font-bold text-slate-700 mt-1">
                                {ticket.scheduledTime || formatTime(ticket.assignedAt)}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Priority</p>
                            <div className="mt-1"><PriorityBadge priority={ticket.priority} /></div>
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="text-blue-600" size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup Address</p>
                            <p className="text-sm font-bold text-slate-800">{ticket.pickupAddress || ticket.location}</p>
                        </div>
                    </div>
                    {ticket.userName && (
                        <div className="bg-purple-50 rounded-xl p-3">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Citizen Details</p>
                            <p className="text-sm font-bold text-slate-800">👤 {ticket.userName}</p>
                            {ticket.userEmail && <p className="text-[11px] text-slate-500 mt-0.5">📧 {ticket.userEmail}</p>}
                            {ticket.userPhone && <p className="text-[11px] text-slate-500 mt-0.5">📞 {ticket.userPhone}</p>}
                        </div>
                    )}
                    {ticket.status === 'Completed' ? (
                        <div className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm text-center flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Pickup Completed
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Citizen OTP Verification</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    value={otpInput}
                                    onChange={(e) => { setOtpInput(e.target.value); setOtpError(''); }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-center font-bold tracking-widest text-lg"
                                />
                                {otpError && <p className="text-xs font-bold text-rose-500 text-center">{otpError}</p>}
                            </div>
                            <div className="flex gap-2">
                                <a href={`https://maps.google.com/?q=${encodeURIComponent(ticket.pickupAddress || ticket.location || '')}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex-1 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
                                    <Navigation size={13} /> Navigate
                                </a>
                                <button onClick={handleComplete} disabled={completing || otpInput.length < 6}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {completing
                                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <><CheckCircle size={13} /> Verify & Complete</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, subColor = 'text-slate-400', bg = 'bg-white', iconBg, iconColor }) => (
    <div className={`${bg} rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400 truncate">{label}</p>
            <p className="text-2xl font-black text-slate-800 leading-tight mt-0.5">{value}</p>
            {sub && <p className={`text-[11px] font-semibold ${subColor} mt-0.5`}>{sub}</p>}
        </div>
    </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const CollectorDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [assignments, setAssignments]               = useState([]);
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [newBanner, setNewBanner]                   = useState(null);
    const [selectedTicket, setSelectedTicket]         = useState(null);
    const [notifCount, setNotifCount]                 = useState(0);
    const [toast, setToast]                           = useState(null);
    const [notifOpen, setNotifOpen]                   = useState(false);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [routeStarted, setRouteStarted]             = useState(false);

    // ── Real-time: pending assignments ──────────────────────────────────
    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'assignments'),
            where('collectorId', '==', currentUser.uid),
            where('status', '==', 'Assigned')
        );
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            docs.sort((a, b) => (b.assignedAt?.seconds || 0) - (a.assignedAt?.seconds || 0));

            snap.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const assignedAt = data.assignedAt?.toDate?.();
                    const isNew = assignedAt && (Date.now() - assignedAt.getTime() < 10000);
                    if (isNew && data.status === 'Assigned') {
                        setNewBanner({ firestoreId: change.doc.id, ...data });
                        setNotifCount(n => n + 1);
                    }
                }
            });
            setAssignments(docs);
            setLoadingAssignments(false);
        }, () => setLoadingAssignments(false));
        return unsub;
    }, [currentUser]);

    // ── Real-time: completed assignments ────────────────────────────────
    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'assignments'),
            where('collectorId', '==', currentUser.uid),
            where('status', '==', 'Completed')
        );
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            docs.sort((a, b) => {
                const aT = a.completedAt?.seconds || a.assignedAt?.seconds || 0;
                const bT = b.completedAt?.seconds || b.assignedAt?.seconds || 0;
                return bT - aT;
            });
            setCompletedAssignments(docs);
        });
        return unsub;
    }, [currentUser]);

    const handleComplete = useCallback((ticket) => {
        setToast({ msg: `${ticket.ticketId || ticket.item} marked as completed!`, type: 'success' });
    }, []);

    // ── Derived data ────────────────────────────────────────────────────
    const pendingCount   = assignments.length;
    const completedCount = completedAssignments.length;
    const todayPickups   = pendingCount + completedCount;
    const totalEarnings  = completedAssignments.reduce((s, a) => s + (a.estimatedValue || 0), 0);

    const routePoints = useMemo(() =>
        assignments
            .filter(a => a.ticketLocation?.lat && a.ticketLocation?.lng)
            .map((a, i) => ({
                lat:      a.ticketLocation.lat,
                lng:      a.ticketLocation.lng,
                name:     a.pickupAddress || a.location || `Stop ${i + 1}`,
                time:     a.scheduledTime || formatTime(a.assignedAt),
                item:     a.item,
                ticketId: a.ticketId,
                icon:     a.icon || '📦',
                priority: a.priority,
                userName: a.userName,
                userPhone: a.userPhone,
                ref:      a,
            })),
        [assignments]
    );

    const polyline  = routePoints.map(p => [p.lat, p.lng]);
    const mapCenter = routePoints.length > 0
        ? [
            routePoints.reduce((s, p) => s + p.lat, 0) / routePoints.length,
            routePoints.reduce((s, p) => s + p.lng, 0) / routePoints.length,
        ]
        : [17.38, 78.53]; // Hyderabad default

    // Estimated total distance (rough straight-line km between consecutive stops)
    const estDistKm = useMemo(() => {
        if (routePoints.length < 2) return 21.4;
        let total = 0;
        for (let i = 0; i < routePoints.length - 1; i++) {
            const dLat = routePoints[i + 1].lat - routePoints[i].lat;
            const dLng = routePoints[i + 1].lng - routePoints[i].lng;
            total += Math.sqrt(dLat * dLat + dLng * dLng) * 111;
        }
        return Math.round(total * 10) / 10;
    }, [routePoints]);

    const estTimeMin = Math.round(estDistKm * 8 + pendingCount * 5);
    const estTimeStr = estTimeMin >= 60
        ? `${Math.floor(estTimeMin / 60)}h ${estTimeMin % 60}m`
        : `${estTimeMin}m`;

    // Upcoming pickups (show first 5 pending)
    const upcomingPickups = assignments.slice(0, 5);

    const greeting  = getGreeting();
    const todayStr  = getTodayStr();
    const firstName = currentUser?.displayName?.split(' ')[0] || 'Collector';

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto">
            <style>{`
                @keyframes slideUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
                @keyframes slideDown { from { opacity:0; transform:translateY(-16px) } to { opacity:1; transform:translateY(0) } }
                .dash-anim { animation: slideUp 0.35s ease both; }
            `}</style>

            {/* ── Overlays ─────────────────────────────────────────────────── */}
            {newBanner && (
                <NewAssignmentBanner
                    assignment={newBanner}
                    onAccept={() => { setSelectedTicket(newBanner); setNewBanner(null); }}
                    onDismiss={() => setNewBanner(null)}
                />
            )}
            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onComplete={handleComplete}
                />
            )}
            {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

            {/* ── Premium Header ────────────────────────────────────────────── */}
            <div className="dash-anim relative bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 rounded-[2rem] p-6 md:p-8 overflow-visible shadow-2xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                <div className="absolute inset-0 opacity-20 rounded-[2rem]" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-teal-900/80 to-transparent z-10 rounded-[2rem]"></div>
                
                <div className="relative z-20 text-white space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-400/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Collector Online</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-[1000] tracking-tighter leading-tight drop-shadow-md">
                        {greeting}, <span className="text-emerald-400">{firstName}!</span> 👋
                    </h1>
                    <p className="text-emerald-100 text-sm font-medium leading-relaxed drop-shadow-sm">
                        Today's Route &bull; <strong className="text-white">{todayPickups} Pickups</strong>
                        {' · '} Estimated Time: <strong className="text-white">{estTimeStr}</strong>
                    </p>
                </div>
                
                <div className="relative z-20 flex items-center gap-3 self-start md:self-center">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotifOpen(o => !o)}
                            className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-sm relative backdrop-blur-sm">
                            <Bell size={18} />
                            {notifCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                    {notifCount}
                                </span>
                            )}
                        </button>
                        {notifOpen && (
                            <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-2xl w-72 z-50 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                    <span className="font-black text-slate-800 text-sm">Notifications</span>
                                    <button onClick={() => { setNotifOpen(false); setNotifCount(0); }} className="text-slate-400 hover:text-slate-600">
                                        <X size={14} />
                                    </button>
                                </div>
                                {assignments.length > 0 ? assignments.slice(0, 4).map((a, i) => (
                                    <div key={i}
                                        onClick={() => { setSelectedTicket(a); setNotifOpen(false); }}
                                        className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3 items-start">
                                        <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Package size={12} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{a.ticketId} — New Assignment</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{a.item} · {a.pickupAddress || a.location}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-5 text-center text-slate-400 text-sm">No new notifications</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Stat Cards removed (moved to sidebar) ───────────────────────────────────────────────── */}

            {/* ── Today's Route ────────────────────────────────────────────── */}
            <div className="dash-anim bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                style={{ animationDelay: '0.1s' }}>
                {/* Route card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-black text-slate-800">Today's Route</h2>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            {todayPickups} Stops
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/collector/route')}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                        View Full Map <ExternalLink size={13} />
                    </button>
                </div>

                {/* Map */}
                <div className="relative" style={{ height: '300px' }}>
                    {loadingAssignments ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : routePoints.length > 0 ? (
                        <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                attribution='© <a href="https://www.openstreetmap.org/copyright">OSM</a>' />
                            {routePoints.map((p, i) => (
                                <Marker key={i} position={[p.lat, p.lng]} icon={makeIcon(i + 1)}>
                                    <Popup>
                                        <div className="text-xs font-bold p-1">
                                            <p className="text-slate-800">{p.item}</p>
                                            <p className="font-normal text-slate-500 mt-1">{p.name}</p>
                                            <p className="font-normal text-slate-400">{p.time}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                            {polyline.length > 1 && (
                                <Polyline positions={polyline} color="#10b981" weight={4} dashArray="8, 12" />
                            )}
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/30">
                            <div className="text-center">
                                <MapPin size={40} className="mx-auto mb-3 text-slate-300" />
                                <p className="font-bold text-slate-500">No route data yet</p>
                                <p className="text-sm text-slate-400 mt-1">Pickup locations will appear when assigned</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Route stats + Start button */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                                <Navigation size={15} className="text-slate-600" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-slate-800 leading-none">{estDistKm} km</p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Total Distance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                                <Clock size={15} className="text-slate-600" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-slate-800 leading-none">{estTimeStr}</p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Est. Time</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                                <MapPin size={15} className="text-slate-600" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-slate-800 leading-none">{pendingCount}</p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Stops</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={routePoints.length > 0
                                ? `https://maps.google.com/?q=${routePoints[0].lat},${routePoints[0].lng}`
                                : 'https://maps.google.com'}
                            target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 bg-white text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-50 transition-colors">
                            <Navigation size={15} /> Open Navigation
                        </a>
                        <button
                            onClick={() => { setRouteStarted(true); setToast({ msg: 'Route started! Drive safe 🚚', type: 'success' }); }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                                routeStarted
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200 hover:shadow-lg'
                            }`}>
                            <Play size={15} fill={routeStarted ? 'currentColor' : 'none'} />
                            {routeStarted ? 'Route Active' : 'Start Route'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Upcoming Pickups ─────────────────────────────────────────── */}
            <div className="dash-anim bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                style={{ animationDelay: '0.15s' }}>
                {/* Table header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-black text-slate-800">Upcoming Pickups</h2>
                        {pendingCount > 0 && (
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                {pendingCount} Pending
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/collector/tickets')}
                        className="flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        View All <ChevronRight size={14} />
                    </button>
                </div>

                {loadingAssignments ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : upcomingPickups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                        <CheckCircle size={36} className="mb-3 text-emerald-300" />
                        <p className="font-bold text-slate-500">All caught up!</p>
                        <p className="text-sm mt-1">New pickup assignments will appear here</p>
                    </div>
                ) : (
                    <>
                        {/* Table — desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                        <th className="px-6 py-3 text-left w-16">Stop</th>
                                        <th className="px-4 py-3 text-left">Customer Details</th>
                                        <th className="px-4 py-3 text-left">Address</th>
                                        <th className="px-4 py-3 text-left">Time Slot</th>
                                        <th className="px-4 py-3 text-left">Priority</th>
                                        <th className="px-4 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {upcomingPickups.map((a, idx) => (
                                        <tr key={a.firestoreId}
                                            className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedTicket(a)}>
                                            {/* Stop # */}
                                            <td className="px-6 py-4">
                                                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            {/* Customer */}
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-slate-800 text-sm">
                                                    {a.userName || 'Customer'}
                                                </p>
                                                {a.userPhone && (
                                                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <Phone size={10} /> {a.userPhone}
                                                    </p>
                                                )}
                                            </td>
                                            {/* Address */}
                                            <td className="px-4 py-4 max-w-[200px]">
                                                <p className="font-semibold text-slate-700 text-sm truncate">
                                                    {a.pickupAddress || a.location || 'N/A'}
                                                </p>
                                                {a.item && (
                                                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{a.item}</p>
                                                )}
                                            </td>
                                            {/* Time Slot */}
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                                                    {a.scheduledTime || formatTime(a.assignedAt)}
                                                </p>
                                            </td>
                                            {/* Priority */}
                                            <td className="px-4 py-4">
                                                <PriorityBadge priority={a.priority} />
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    {a.userPhone && (
                                                        <a href={`tel:${a.userPhone}`}
                                                            className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors">
                                                            <Phone size={14} />
                                                        </a>
                                                    )}
                                                    <a
                                                        href={`https://maps.google.com/?q=${encodeURIComponent(a.pickupAddress || a.location || '')}`}
                                                        target="_blank" rel="noreferrer"
                                                        className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                                                        <Navigation size={14} />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Card list — mobile */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {upcomingPickups.map((a, idx) => (
                                <div key={a.firestoreId}
                                    onClick={() => setSelectedTicket(a)}
                                    className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-sm flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="font-bold text-slate-800 text-sm truncate">
                                                {a.userName || 'Customer'}
                                            </p>
                                            <PriorityBadge priority={a.priority} />
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{a.pickupAddress || a.location}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{a.scheduledTime || formatTime(a.assignedAt)}</p>
                                    </div>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(a.pickupAddress || '')}`}
                                        target="_blank" rel="noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex-shrink-0">
                                        <Navigation size={12} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Quick Actions removed (moved to sidebar) ────────────────────────────────────────────── */}

            {/* ── Motivational Footer Banner ───────────────────────────────── */}
            <div className="dash-anim relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl overflow-hidden shadow-lg"
                style={{ animationDelay: '0.25s' }}>
                {/* Decorative circles */}
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute -right-2 -bottom-8 w-48 h-48 bg-white/5 rounded-full" />
                <div className="absolute right-32 top-2 w-16 h-16 bg-white/5 rounded-full" />

                <div className="relative flex items-center justify-between px-7 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🌿</span>
                        </div>
                        <div>
                            <p className="text-white font-black text-base">You are making a difference! Keep going!</p>
                            <p className="text-emerald-200 text-sm mt-0.5">
                                Every pickup counts towards a cleaner &amp; greener future.
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                        {/* Mini eco illustration */}
                        <div className="flex items-end gap-1 opacity-70">
                            <div className="w-2 bg-white/40 rounded-t-sm" style={{ height: 24 }} />
                            <div className="w-2 bg-white/40 rounded-t-sm" style={{ height: 36 }} />
                            <div className="w-2 bg-white/40 rounded-t-sm" style={{ height: 20 }} />
                            <span className="text-2xl ml-1">🌳</span>
                            <span className="text-xl">🌬️</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CollectorDashboard;
