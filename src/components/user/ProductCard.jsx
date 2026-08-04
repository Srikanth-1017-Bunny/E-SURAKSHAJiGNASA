import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, timeAgo } from '../../utils/formatting';
import { FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="relative aspect-square bg-gray-100">
                {product.images && product.images[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                    {product.condition}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                    <span className="font-bold text-primary-600">
                        {formatCurrency(product.price, product.condition === 'not-working' ? 'coins' : 'INR')}
                    </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">{product.description}</p>

                <div className="flex items-center text-xs text-gray-400 gap-3">
                    <div className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        <span className="truncate max-w-[100px]">{product.location?.city || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaRegClock />
                        <span>{timeAgo(product.createdAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
