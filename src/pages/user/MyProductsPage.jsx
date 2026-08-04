import React, { useEffect, useState, useCallback } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatting';

const MyProductsPage = () => {
    const { fetchUserProducts, deleteProduct } = useProducts();
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (currentUser) {
            setLoading(true);
            const data = await fetchUserProducts(currentUser.uid);
            setProducts(data);
            setLoading(false);
        }
    }, [currentUser, fetchUserProducts]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleDelete = async (id) => {
        await deleteProduct(id);
        refreshData(); // Refresh list
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Products</h1>
                <Link to="/user/list-product" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Add New</Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded shadow-sm">
                    <p className="text-gray-500 mb-4">You haven't listed any products yet.</p>
                    <Link to="/user/list-product" className="text-primary-600 font-semibold hover:underline">Start Listing</Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-gray-100 rounded flex-shrink-0">
                                                {product.images && product.images[0] && <img src={product.images[0]} alt="" className="h-10 w-10 object-cover rounded" />}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                                <div className="text-sm text-gray-500">{product.condition}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(product.price, product.condition === 'not-working' ? 'coins' : 'INR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-3">
                                            <Link to={`/product/${product.id}`} className="text-gray-600 hover:text-gray-900"><FaEye /></Link>
                                            <button className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyProductsPage;
