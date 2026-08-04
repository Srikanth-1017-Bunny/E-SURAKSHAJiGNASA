import React, { useState, useEffect } from 'react';
import { logisticsService } from '../../services/logisticsService';
import { FaTruck, FaBox, FaMapMarkerAlt, FaSearch, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LogisticsPage = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadShipments();
    }, []);

    const loadShipments = async () => {
        setLoading(true);
        const data = await logisticsService.getAllShipments();
        setShipments(data);
        setLoading(false);
    };

    const filteredShipments = shipments.filter(s =>
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaTruck className="text-blue-500" /> Logistics Dashboard
                    </h1>
                    <p className="text-gray-500">Track real-time shipment status and deliveries.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Tracking ID or Name..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div className="text-center py-20">Loading Logistics Data...</div>
            ) : (
                <div className="grid gap-6">
                    {filteredShipments.map(shipment => (
                        <div key={shipment.id} className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all">
                            {/* Icon status */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0
                                ${shipment.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                    shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-600' :
                                        'bg-orange-100 text-orange-600'}`}>
                                <FaBox />
                            </div>

                            {/* Main Info */}
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{shipment.id}</h3>
                                    <p className="text-sm text-gray-500">Weight: {shipment.weight} kg</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                        <span>{shipment.origin}</span>
                                    </div>
                                    <div className="h-4 border-l ml-3 border-gray-300 border-dashed"></div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        <span>{shipment.destination}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase w-fit mb-1
                                        ${shipment.status === 'Delivered' ? 'bg-green-500 text-white' :
                                            shipment.status === 'In Transit' ? 'bg-blue-500 text-white' :
                                                'bg-orange-400 text-white'}`}>
                                        {shipment.status}
                                    </span>
                                    <span className="text-xs text-gray-400">Est: {shipment.estimatedDelivery}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <Link
                                to={`/controller/logistics/${shipment.id}`}
                                className="w-full md:w-auto px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition"
                            >
                                Details <FaArrowRight />
                            </Link>
                        </div>
                    ))}

                    {filteredShipments.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                            <p className="text-gray-400">No active shipments found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LogisticsPage;
