import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Compass, Package } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const makeIcon = (num, color = '#10b981') => new L.DivIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;">${num}</div>`,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const formatTime = (ts) => {
    if (!ts) return 'N/A';
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const RoutePage = () => {
    const { currentUser } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'assignments'),
            where('collectorId', '==', currentUser.uid),
            where('status', '==', 'Assigned')
        );
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            docs.sort((a, b) => (a.assignedAt?.seconds || 0) - (b.assignedAt?.seconds || 0));
            setAssignments(docs);
            setLoading(false);
        });
        return unsub;
    }, [currentUser]);

    const routePoints = useMemo(() =>
        assignments
            .filter(a => a.ticketLocation?.lat && a.ticketLocation?.lng)
            .map((a, i) => ({
                lat: a.ticketLocation.lat,
                lng: a.ticketLocation.lng,
                name: a.pickupAddress || `Stop ${i + 1}`,
                time: a.scheduledTime || formatTime(a.assignedAt),
                item: a.item,
                ticketId: a.ticketId,
                icon: a.icon || '📦',
                priority: a.priority,
            })),
        [assignments]
    );

    const polyline = routePoints.map(p => [p.lat, p.lng]);
    const mapCenter = routePoints.length > 0
        ? [
            routePoints.reduce((s, p) => s + p.lat, 0) / routePoints.length,
            routePoints.reduce((s, p) => s + p.lng, 0) / routePoints.length,
        ]
        : [17.38, 78.53];

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-white to-emerald-50/60 p-5 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-xl font-black text-slate-800">My Route</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{routePoints.length} stops · {assignments.length} pending pickups</p>
                </div>
                {routePoints.length > 0 && (
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm rounded-xl shadow-sm hover:from-emerald-600 hover:to-teal-600 transition-all">
                            <Compass size={15} /> Optimize Route
                        </button>
                        <a
                            href={`https://maps.google.com/?q=${routePoints[0]?.lat},${routePoints[0]?.lng}`}
                            target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors"
                        >
                            <Navigation size={15} /> Open in Maps
                        </a>
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div style={{ height: '450px' }} className="rounded-xl overflow-hidden border border-slate-200">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : routePoints.length > 0 ? (
                        <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
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
                                <Polyline positions={polyline} color="#10b981" weight={3} dashArray="6, 10" />
                            )}
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                            <div className="text-center">
                                <MapPin size={40} className="mx-auto mb-3 text-slate-300" />
                                <p className="font-bold text-slate-600">No route data yet</p>
                                <p className="text-sm mt-1">Pickup locations will appear when assigned</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stop List */}
            {routePoints.length > 0 && (
                <div className="grid gap-4">
                    {routePoints.map((stop, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                                {i + 1}
                            </div>
                            <div className="text-2xl">{stop.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-black text-slate-800 text-sm">{stop.ticketId}</p>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        stop.priority === 'High' ? 'bg-red-100 text-red-600' :
                                        stop.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                    }`}>{stop.priority}</span>
                                </div>
                                <p className="text-sm text-slate-600 font-semibold">{stop.item}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                    <MapPin size={10} /> {stop.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                                    <Clock size={11} /> {stop.time}
                                </p>
                                <a
                                    href={`https://maps.google.com/?q=${stop.lat},${stop.lng}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1 px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                >
                                    <Navigation size={12} /> Go
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoutePage;
