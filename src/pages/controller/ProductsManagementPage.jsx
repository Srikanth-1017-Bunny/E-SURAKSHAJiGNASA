import React, { useState } from 'react';
import { useController } from '../../hooks/useController';
import { FaSearch, FaCheck, FaTimes, FaTag } from 'react-icons/fa';
import { formatDate } from '../../utils/formatting';

const ProductsManagementPage = () => {
    // In our schema, "products" are essentially the initial state of a collection request
    // or we could have a separate 'products' collection if we were building a marketplace.
    // For this context, let's treat 'requests' as the product inventory we are managing.
    const { requests, loading, updateRequestStatus } = useController();
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) return <div className="p-8 text-center">Loading Inventory...</div>;

    const filteredProducts = requests.filter(req =>
        req.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Moderate Products</h1>
                    <p className="text-gray-500">Review and approve waste items listed by users.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden group hover:shadow-md transition-all">
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.productTitle}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                    No Image Available
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase backdrop-blur-md
                                    ${item.status === 'completed' ? 'bg-green-500/80 text-white' :
                                        item.status === 'rejected' ? 'bg-red-500/80 text-white' :
                                            'bg-white/80 text-gray-800'}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.productTitle}</h3>
                                {item.estimatedWeight && <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{item.estimatedWeight} kg</span>}
                            </div>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description || 'No description provided.'}</p>

                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                                <FaTag />
                                <span>{item.category}</span>
                                <span>•</span>
                                <span>{formatDate(item.createdAt)}</span>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                {item.status === 'pending' || item.status === 'open' ? (
                                    <>
                                        <button
                                            onClick={() => updateRequestStatus(item.id, 'assigned')}
                                            className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateRequestStatus(item.id, 'rejected')}
                                            className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            title="Reject"
                                        >
                                            <FaTimes />
                                        </button>
                                    </>
                                ) : (
                                    <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-bold cursor-not-allowed">
                                        {item.status === 'rejected' ? 'Rejected' : 'Processed'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">No products found.</p>
                </div>
            )}
        </div>
    );
};

export default ProductsManagementPage;
