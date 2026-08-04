import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Activity } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createColoredIcon = (color, text) => new L.DivIcon({
    html: `<div style="background:${color};color:white;font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);">${text}</div>`,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const determinePriority = (value) => {
    if (value >= 3000) return 'High';
    if (value >= 1500) return 'Medium';
    return 'Low';
};

const GovMapViewPage = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'tickets'), (snap) => {
            setAllTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return unsub;
    }, []);

    const mapMarkers = allTickets
        .filter(t => t.location?.lat && t.location?.lng)
        .filter(t => filter === 'All' || t.status === filter)
        .map((t, i) => {
            const priority = determinePriority(t.estimatedValue || 0);
            const color = priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f97316' : '#22c55e';
            return { pos: [t.location.lat, t.location.lng], icon: createColoredIcon(color, (i + 1).toString()), ticket: t, priority };
        });

    const mapCenter = mapMarkers.length > 0
        ? [mapMarkers.reduce((s, m) => s + m.pos[0], 0) / mapMarkers.length, mapMarkers.reduce((s, m) => s + m.pos[1], 0) / mapMarkers.length]
        : [17.44, 78.48];

    const pending = allTickets.filter(t => t.status === 'Submitted').length;
    const assigned = allTickets.filter(t => ['Assigned', 'In Progress'].includes(t.status)).length;
    const completed = allTickets.filter(t => ['Completed', 'Collected'].includes(t.status)).length;

    return (
        <div className="space-y-5 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-xl font-black text-slate-800">Geospatial Map View</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{mapMarkers.length} tickets with location data</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> High Priority</span>
                    <span className="flex items-center gap-1 text-xs font-bold"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> Medium</span>
                    <span className="flex items-center gap-1 text-xs font-bold"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Low</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Pending', value: pending, color: 'text-amber-700', bg: 'from-amber-50 to-amber-100/50' },
                    { label: 'Assigned', value: assigned, color: 'text-blue-700', bg: 'from-blue-50 to-blue-100/50' },
                    { label: 'Completed', value: completed, color: 'text-emerald-700', bg: 'from-emerald-50 to-emerald-100/50' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`bg-gradient-to-br ${bg} rounded-2xl p-4 border border-slate-100 shadow-sm`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                        <p className={`text-3xl font-black ${color} mt-1`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {['All', 'Submitted', 'Assigned', 'Completed'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
                <div style={{ height: '500px' }} className="rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : mapMarkers.length > 0 ? (
                        <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                            {mapMarkers.map((m, i) => (
                                <Marker key={i} position={m.pos} icon={m.icon}>
                                    <Popup>
                                        <div className="text-xs p-1">
                                            <p className="font-black text-slate-800">{m.ticket.deviceBrand} {m.ticket.deviceModel}</p>
                                            <p className="text-slate-500 mt-0.5 flex items-center gap-1"><MapPin size={9} />{m.ticket.pickupAddress}</p>
                                            <p className="text-slate-400 mt-0.5">By: {m.ticket.userName}</p>
                                            <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${m.priority === 'High' ? 'bg-red-100 text-red-700' : m.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{m.priority}</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                            <div className="text-center">
                                <MapPin size={40} className="mx-auto mb-3 text-slate-300" />
                                <p className="font-bold text-slate-600">No location data available</p>
                                <p className="text-sm mt-1">Tickets will appear when citizens submit with location</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GovMapViewPage;
