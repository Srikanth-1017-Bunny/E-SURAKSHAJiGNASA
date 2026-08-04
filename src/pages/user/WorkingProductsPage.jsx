import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaShoppingBag, FaArrowLeft, FaMapMarkerAlt, FaRegClock, FaCheckCircle } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatting';

const WorkingProductsPage = () => {
    const { products, fetchProducts, loading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const categories = ['All', 'Electronics', 'Appliances', 'Accessories', 'Parts', 'Other'];

    const workingProducts = products.filter(p =>
        p.condition === 'working' &&
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/user/home')}
                            className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all mb-2"
                        >
                            <FaArrowLeft /> Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight">
                            Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Working Tech</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Buy verified, pre-owned gadgets at great prices.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl w-full sm:w-72 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : workingProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {workingProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                            >
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000'}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                                            <FaCheckCircle size={10} /> Verified
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-900/20">
                                            <FaShoppingBag size={12} />
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{product.category}</p>
                                        <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <FaMapMarkerAlt /> {product.location?.city || 'No location'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaRegClock /> {product.createdAt?.seconds ? new Date(product.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <p className="text-2xl font-[1000] text-slate-900 tracking-tighter">
                                            {formatCurrency(product.price)}
                                        </p>
                                        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-indigo-600 transition-all active:scale-95">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                            <FaShoppingBag size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800">No working products found</p>
                            <p className="text-slate-500 text-sm font-medium">Try changing your search or category filter.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkingProductsPage;
