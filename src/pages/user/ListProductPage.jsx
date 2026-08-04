import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ImageUploader from '../../components/common/ImageUploader';
import AddressSelector from '../../components/common/AddressSelector';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const ListProductPage = () => {
    const navigate = useNavigate();
    const { addProduct } = useProducts();
    const { currentUser } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electronics',
        condition: 'working', // working or not-working
        price: '',
        images: [],
        location: currentUser?.address || {},
        contactInfo: { phone: currentUser?.phone || '', email: currentUser?.email || '' }
    });

    const categories = ['Electronics', 'Appliances', 'Accessories', 'Parts', 'Other'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addProduct(formData);
            navigate('/user/my-products');
        } catch (error) {
            // Error handled in hook
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-8 text-center">List New Product</h1>

            {/* Steps Checkpoint */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                {[1, 2, 3, 4].map(n => (
                    <div key={n} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= n ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {n}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input name="title" required value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" placeholder="E.g. iPhone 13 Pro Max" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} className="w-full border p-2 rounded h-24" placeholder="Describe the item condition, age, etc." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Condition</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-3 border rounded cursor-pointer ${formData.condition === 'working' ? 'border-primary-600 bg-primary-50 text-primary-700' : ''}`}>
                                    <input type="radio" name="condition" value="working" checked={formData.condition === 'working'} onChange={handleChange} className="hidden" />
                                    <div className="font-bold text-center">Working</div>
                                    <div className="text-xs text-center text-gray-500">Sell for Rupees</div>
                                </label>
                                <label className={`flex-1 p-3 border rounded cursor-pointer ${formData.condition === 'not-working' ? 'border-primary-600 bg-primary-50 text-primary-700' : ''}`}>
                                    <input type="radio" name="condition" value="not-working" checked={formData.condition === 'not-working'} onChange={handleChange} className="hidden" />
                                    <div className="font-bold text-center">E-Waste / Not Working</div>
                                    <div className="text-xs text-center text-gray-500">Recycle for Coins</div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={() => setStep(2)} className="bg-primary-600 text-white px-6 py-2 rounded">Next</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Pricing & Location</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {formData.condition === 'working' ? 'Price (₹)' : 'Expected Coins'}
                            </label>
                            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>

                        <div className="mt-4">
                            <AddressSelector
                                value={formData.location}
                                onChange={(addr) => setFormData({ ...formData, location: addr })}
                                readOnly={true}
                                showMap={false}
                            />
                        </div>

                        <div className="flex justify-between mt-6">
                            <button type="button" onClick={() => setStep(1)} className="text-gray-500">Back</button>
                            <button type="button" onClick={() => setStep(3)} className="bg-primary-600 text-white px-6 py-2 rounded">Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded overflow-hidden">
                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                </div>
                            ))}

                            {formData.images.length < 4 && (
                                <ImageUploader onUpload={handleImageUpload} className="aspect-square" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Upload up to 4 images.</p>

                        <div className="flex justify-between mt-6">
                            <button type="button" onClick={() => setStep(2)} className="text-gray-500">Back</button>
                            <button type="button" onClick={() => setStep(4)} className="bg-primary-600 text-white px-6 py-2 rounded">Review</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>

                        <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
                            <p><span className="font-bold">Title:</span> {formData.title}</p>
                            <p><span className="font-bold">Price:</span> {formData.price} {formData.condition === 'working' ? 'INR' : 'Coins'}</p>
                            <p><span className="font-bold">Condition:</span> {formData.condition}</p>
                            <p><span className="font-bold">Location:</span> {formData.location.city}, {formData.location.state}</p>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button type="button" onClick={() => setStep(3)} className="text-gray-500">Back</button>
                            <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded">
                                {loading ? 'Submitting...' : 'Submit Listing'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ListProductPage;
