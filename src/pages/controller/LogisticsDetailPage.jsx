import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logisticsService } from '../../services/logisticsService';
import { generateShippingLabel } from '../../utils/LabelGenerator';
import { FaArrowLeft, FaPrint, FaTruck, FaBoxOpen, FaCheckCircle, FaMapMarkedAlt } from 'react-icons/fa';

const LogisticsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadShipment = async () => {
            setLoading(true);
            const data = await logisticsService.getShipmentById(id);
            setShipment(data);
            setLoading(false);
        };
        loadShipment();
    }, [id]);

    const handlePrintLabel = async () => {
        if (!shipment) return;
        await generateShippingLabel(shipment);
    };

    if (loading) return <div className="p-8 text-center min-h-screen pt-20">Loading Shipment Details...</div>;
    if (!shipment) return <div className="p-8 text-center text-red-500">Shipment Not Found</div>;

    const getIconForEvent = (event) => {
        if (event.includes('Delivered')) return <FaCheckCircle className="text-white" />;
        if (event.includes('Picked Up')) return <FaBoxOpen className="text-white" />;
        return <FaTruck className="text-white" />;
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
                <FaArrowLeft /> Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Tracking Number</div>
                            <h1 className="text-3xl md:text-4xl font-extrabold">{shipment.id}</h1>
                        </div>
                        <button
                            onClick={handlePrintLabel}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                        >
                            <FaPrint /> Print Label
                        </button>
                    </div>

                    {/* Decor */}
                    <FaMapMarkedAlt className="absolute right-0 bottom-0 text-9xl text-white/5 -mb-4 -mr-4 transform rotate-12" />
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-12">
                    {/* Info Column */}
                    <div className="md:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">Sender</h3>
                            <div className="font-medium text-gray-900">{shipment.sender}</div>
                            <div className="text-gray-500 text-sm">{shipment.origin}</div>
                        </div>

                        <div>
                            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">Recipient</h3>
                            <div className="font-medium text-gray-900">{shipment.recipient}</div>
                            <div className="text-gray-500 text-sm">{shipment.destination}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Weight</h3>
                                <div className="font-bold text-gray-800">{shipment.weight} kg</div>
                            </div>
                            <div>
                                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">ETA</h3>
                                <div className="font-bold text-gray-800">{shipment.estimatedDelivery}</div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Column */}
                    <div className="md:col-span-2">
                        <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
                            <FaTruck className="text-blue-500" /> Shipment Progress
                        </h3>

                        <div className="space-y-0 relative pl-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-100 rounded-full"></div>

                            {shipment.timeline.map((event, index) => (
                                <div key={index} className="relative flex gap-6 items-start pb-8 last:pb-0 group">
                                    <div className={`
                                        z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-transform group-hover:scale-110
                                        ${index === shipment.timeline.length - 1 ? 'bg-blue-500 shadow-blue-200' : 'bg-gray-300'}
                                    `}>
                                        {getIconForEvent(event.event)}
                                    </div>
                                    <div className="pt-2">
                                        <div className="font-bold text-gray-900 text-lg">{event.event}</div>
                                        <div className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                            <span>{event.time}</span>
                                            <span>•</span>
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsDetailPage;
