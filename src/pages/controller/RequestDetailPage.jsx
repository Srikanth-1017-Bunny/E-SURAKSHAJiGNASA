import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaUser, FaTruck, FaBox, FaMapMarkerAlt, FaCalendarAlt, FaHistory, FaArrowLeft } from 'react-icons/fa';
import { formatDate, formatTime } from '../../utils/formatting';

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const docRef = doc(db, 'collections', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRequest({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen pt-20">Loading...</div>;
    if (!request) return <div className="p-8 text-center">Request not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
                <FaArrowLeft /> Back
            </button>

            <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{request.productTitle}</h1>
                            <p className="opacity-90 flex items-center gap-2">
                                <FaBox /> {request.category} • {request.estimatedWeight || 'N/A'} kg
                            </p>
                        </div>
                        <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl font-bold text-sm uppercase border border-white/30">
                            {request.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                    {/* Left Column: Details */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                                <FaUser className="text-emerald-500" /> User Details
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium">{request.userName || 'Anonymous'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="font-medium">{request.userPhone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email:</span>
                                    <span className="font-medium">{request.userEmail || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-emerald-500" /> Pickup Location
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700">
                                <p className="leading-relaxed">
                                    {request.userAddress?.fullAddress}, {request.userAddress?.city}, {request.userAddress?.state} - {request.userAddress?.pincode}
                                </p>
                            </div>
                        </div>

                        {request.imageUrl && (
                            <div>
                                <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                                    <FaBox className="text-emerald-500" /> Item Photo
                                </h3>
                                <div className="rounded-xl overflow-hidden border">
                                    <img src={request.imageUrl} alt="Product" className="w-full h-auto" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Tracking & Status */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                                <FaHistory className="text-emerald-500" /> Timeline
                            </h3>
                            <div className="relative border-l-2 border-emerald-100 ml-3 space-y-6 pl-6 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                                    <h4 className="font-bold text-gray-900 text-sm">Request Created</h4>
                                    <p className="text-xs text-gray-500">{formatDate(request.createdAt)} at {formatTime(request.createdAt)}</p>
                                </div>

                                {request.assignedAt && (
                                    <div className="relative">
                                        <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                        <h4 className="font-bold text-gray-900 text-sm">Collector Assigned</h4>
                                        <p className="text-xs text-gray-500">{formatDate(request.assignedAt)}</p>
                                    </div>
                                )}

                                {request.pickedUpAt && (
                                    <div className="relative">
                                        <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white"></div>
                                        <h4 className="font-bold text-gray-900 text-sm">Picked Up</h4>
                                        <p className="text-xs text-gray-500">{formatDate(request.pickedUpAt)}</p>
                                    </div>
                                )}

                                {request.status === 'completed' && (
                                    <div className="relative">
                                        <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                                        <h4 className="font-bold text-gray-900 text-sm">Completed & Recycled</h4>
                                        <p className="text-xs text-gray-500">{formatDate(request.completedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {request.collectorId && (
                            <div>
                                <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                                    <FaTruck className="text-emerald-500" /> Assigned Collector
                                </h3>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="font-bold text-gray-900">ID: {request.collectorId}</p>
                                    <p className="text-xs text-blue-600 mt-1">Assignments are managed by the admin panel.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailPage;
