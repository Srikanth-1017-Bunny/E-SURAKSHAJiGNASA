import React, { useState, useEffect } from 'react';
import { FaLocationArrow, FaMapMarkerAlt, FaGlobeAmericas } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ onLocationSelect, position }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const AddressSelector = ({ value, onChange, readOnly = false, showMap = true }) => {
    // value is expected to be { street, city, state, pincode, country, lat, lng }
    const [address, setAddress] = useState(value || { street: '', city: '', state: '', pincode: '', country: '', lat: 17.3850, lng: 78.4867 });

    const handleChange = (field, val) => {
        let newAddress = { ...address, [field]: val };

        if (field === 'city' && !readOnly) {
            const c = val.toLowerCase().trim();
            if (c === 'hyderabad') { newAddress.lat = 17.3850; newAddress.lng = 78.4867; }
            else if (c === 'nizamabad') { newAddress.lat = 18.6704; newAddress.lng = 78.0937; }
            else if (c === 'medchal') { newAddress.lat = 17.6294; newAddress.lng = 78.4811; }
        }

        setAddress(newAddress);
        if (onChange) onChange(newAddress);
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            return alert("Geolocation is not supported by your browser");
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const newAddress = { ...address, lat: latitude, lng: longitude };
            setAddress(newAddress);
            if (onChange) onChange(newAddress);
        }, (err) => {
            console.error(err);
            alert("Unable to retrieve your location");
        });
    };

    const handleMapClick = (latlng) => {
        if (readOnly) return;
        const newAddress = { ...address, lat: latlng.lat, lng: latlng.lng };
        setAddress(newAddress);
        if (onChange) onChange(newAddress);
    };

    const mapCenter = [address.lat || 17.3850, address.lng || 78.4867];

    return (
        <div className="space-y-5">
            {!readOnly && showMap && (
                <button
                    type="button"
                    onClick={handleLocate}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all active:scale-[0.98] shadow-lg shadow-indigo-200"
                >
                    <FaLocationArrow className="text-xs" /> Use Current Location
                </button>
            )}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Street Address</label>
                        <input
                            type="text"
                            placeholder="Enter street address"
                            value={address.street}
                            readOnly={readOnly}
                            onChange={(e) => handleChange('street', e.target.value)}
                            className={`w-full px-4 py-2.5 text-sm ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'bg-slate-50/50'} border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Pincode</label>
                        <input
                            type="text"
                            placeholder="Enter pincode"
                            value={address.pincode}
                            readOnly={readOnly}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            className={`w-full px-4 py-2.5 text-sm ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'bg-slate-50/50'} border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">City</label>
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={address.city}
                            readOnly={readOnly}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className={`w-full px-4 py-2.5 text-sm ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'bg-slate-50/50'} border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">State</label>
                        <input
                            type="text"
                            placeholder="Enter state"
                            value={address.state}
                            readOnly={readOnly}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className={`w-full px-4 py-2.5 text-sm ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'bg-slate-50/50'} border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400`}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Country</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaGlobeAmericas />
                            </span>
                            <input
                                type="text"
                                value="India"
                                readOnly={true}
                                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 cursor-not-allowed border border-slate-200 rounded-lg outline-none font-medium text-slate-800"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {showMap && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <FaMapMarkerAlt className="text-slate-600" />
                        <h3 className="text-sm font-bold text-slate-700">Pickup Location</h3>
                    </div>
                    <div className="relative rounded-xl overflow-hidden shadow-md bg-slate-100 h-72 border border-slate-200">
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationPicker onLocationSelect={handleMapClick} position={address.lat && address.lng ? [address.lat, address.lng] : null} />
                            <ChangeView center={mapCenter} />
                        </MapContainer>

                        {!readOnly && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                                Click on map to set location
                            </div>
                        )}

                        <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-slate-200 text-[9px] font-bold text-slate-600">
                            {address.lat?.toFixed(4)}, {address.lng?.toFixed(4)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressSelector;

