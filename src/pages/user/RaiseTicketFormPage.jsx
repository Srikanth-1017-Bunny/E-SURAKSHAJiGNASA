import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import {
    FaArrowLeft, FaCheckCircle, FaChevronRight, FaTimes,
    FaMobileAlt, FaLaptop, FaTabletAlt, FaDesktop,
    FaKeyboard, FaPrint, FaCamera, FaHeadphones, FaClock,
    FaGamepad, FaBatteryFull, FaMicrochip
} from 'react-icons/fa';
import ImageUploader from '../../components/common/ImageUploader';
import AddressSelector from '../../components/common/AddressSelector';
import { analyzeImage } from '../../services/aiService';
import { toast } from 'react-toastify';

const RaiseTicketFormPage = () => {
    const { optionId, categoryId } = useParams();
    const { currentUser } = useAuth();
    const { addProduct } = useProducts();
    const navigate = useNavigate();

    const [formStep, setFormStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const electronicItems = [
        { id: 'smartphone', name: 'Smartphone', icon: <FaMobileAlt />, description: 'Mobile phones, iPhones, Android devices' },
        { id: 'laptop', name: 'Laptop', icon: <FaLaptop />, description: 'Laptops, notebooks, MacBooks' },
        { id: 'tablet', name: 'Tablet', icon: <FaTabletAlt />, description: 'Tablets, iPads' },
        { id: 'monitor', name: 'Monitor', icon: <FaDesktop />, description: 'Computer monitors, displays, screens' },
        { id: 'keyboard-mouse', name: 'Keyboard & Mouse', icon: <FaKeyboard />, description: 'Keyboards, mice, input devices' },
        { id: 'printer', name: 'Printer', icon: <FaPrint />, description: 'Printers, scanners, copiers' },
        { id: 'camera', name: 'Camera', icon: <FaCamera />, description: 'Cameras, webcams, camcorders' },
        { id: 'audio-device', name: 'Audio Device', icon: <FaHeadphones />, description: 'Headphones, speakers, earphones' },
        { id: 'smart-watch', name: 'Smart Watch', icon: <FaClock />, description: 'Smart watches, fitness trackers' },
        { id: 'gaming-console', name: 'Gaming Console', icon: <FaGamepad />, description: 'PlayStation, Xbox, Nintendo' },
        { id: 'battery-charger', name: 'Battery & Charger', icon: <FaBatteryFull />, description: 'Batteries, chargers, power banks' },
        { id: 'other-electronics', name: 'Other Electronics', icon: <FaMicrochip />, description: 'Other electronic devices' },
    ];

    const selectedItem = electronicItems.find(i => i.id === categoryId) || electronicItems[0];

    const [formData, setFormData] = useState({
        title: selectedItem.name,
        description: '',
        category: selectedItem.name,
        condition: optionId === 'income' ? 'working' : 'not-working',
        price: '',
        images: [],
        location: currentUser?.address || {},
        contactInfo: { phone: currentUser?.phone || '', email: currentUser?.email || '' }
    });

    const handleImageUpload = async (url) => {
        setFormData(prev => ({ ...prev, images: [url] }));
        setLoading(true);
        try {
            const result = await analyzeImage(url);
            setAiResult(result);
            toast.success("AI Scan Complete!");
        } catch (error) {
            toast.error("AI Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.images.length === 0 && formData.condition === 'not-working') {
            toast.warning("Please upload a photo of the item.");
            return;
        }
        setLoading(true);
        try {
            await addProduct({
                ...formData,
                status: 'pending',
                verificationStatus: 'pending',
                aiScanData: aiResult,
                type: optionId
            });
            setIsSuccess(true);
            toast.success("Listing submitted successfully!");
        } catch (error) {
            toast.error("Failed to submit listing.");
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8 animate-fadeIn">
                <div className="bg-white rounded-[3rem] p-20 shadow-2xl shadow-slate-200/50 text-center space-y-10 max-w-4xl w-full">
                    <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <FaCheckCircle size={64} />
                    </div>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tight uppercase leading-none">Request Submitted!</h2>
                    <p className="text-slate-400 text-xl font-bold max-w-lg mx-auto leading-relaxed">
                        Your listing has been added to your activity. A collector will be assigned to verify and pick up your items.
                    </p>
                    <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => navigate('/user/home')}
                            className="w-full md:w-auto px-16 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl uppercase tracking-widest"
                        >
                            My Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/user/requests')}
                            className="w-full md:w-auto px-16 py-5 bg-white border-4 border-slate-900 text-slate-900 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            My Activity
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-12 animate-fadeIn">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/40">
                    {/* Header with Steps */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <div className="flex items-start gap-6">
                            <button
                                onClick={() => formStep > 1 ? setFormStep(prev => prev - 1) : navigate(`/user/raise-ticket/category/${optionId}`)}
                                className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all shadow-sm active:scale-95"
                            >
                                <FaArrowLeft className="text-slate-700 text-lg" />
                            </button>
                            <div className="space-y-0.5">
                                <h2 className="text-2xl font-[900] text-slate-800 tracking-tight leading-none uppercase">List Product</h2>
                                <p className="text-slate-400 font-extrabold uppercase text-[9px] tracking-[0.2em]">STEP {formStep} OF 3</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 text-xs ${formStep >= s ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {formStep === 1 && (
                            <div className="space-y-8 animate-slideUp">
                                <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-6 mb-8">
                                    <div className="text-4xl text-emerald-600">{selectedItem.icon}</div>
                                    <div>
                                        <h4 className="font-black text-emerald-900 uppercase text-sm">Category: {selectedItem.name}</h4>
                                        <p className="text-emerald-600/70 font-bold text-[10px] uppercase tracking-tight">{selectedItem.description}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. iPhone 13 Pro"
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Condition</label>
                                        <select
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                            value={formData.condition}
                                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        >
                                            <option value="not-working">Not Working (E-Waste)</option>
                                            <option value="working">Working Item (Resale)</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.condition === 'working' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Estimated Price (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="Enter your expected price"
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        placeholder="Tell us more about the item's condition..."
                                        rows="4"
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:bg-white transition-all outline-none resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setFormStep(2)}
                                    className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 active:scale-95"
                                >
                                    Next Step <FaChevronRight size={10} />
                                </button>
                            </div>
                        )}

                        {formStep === 2 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="space-y-1 text-center max-w-lg mx-auto mb-10">
                                    <h3 className="text-xl font-[900] text-slate-800 uppercase tracking-tight">Upload Images</h3>
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Show us clear pictures of your {selectedItem.name}</p>
                                </div>

                                <div className="max-w-xl mx-auto">
                                    {!formData.images[0] ? (
                                        <ImageUploader
                                            onUpload={handleImageUpload}
                                            label="Select Image"
                                            sublabel="AI will automatically validate and scan electronic items"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-8">
                                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                                                <img src={formData.images[0]} alt="Selected" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, images: [] }))}
                                                        className="p-4 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                                                    >
                                                        <FaTimes size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {loading && (
                                                <div className="w-full p-6 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 animate-pulse flex flex-col items-center gap-4">
                                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="font-black text-indigo-700 uppercase tracking-widest text-[9px]">AI analysis in progress...</p>
                                                </div>
                                            )}

                                            {aiResult && !loading && (
                                                <div className="w-full p-6 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl animate-fadeIn">
                                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-emerald-100">
                                                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xs">AI</div>
                                                        <h4 className="font-black text-emerald-900 text-sm uppercase tracking-tight">Detection Result</h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Device Type</p>
                                                            <p className="text-sm font-black text-slate-800">{aiResult.detectedItem}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Est. Reward</p>
                                                            <p className="text-sm font-black text-emerald-700">{formData.condition === 'working' ? 'Market Price' : `🪙 ${aiResult.ecoPoints} Coins`}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    disabled={!formData.images.length || loading}
                                    onClick={() => setFormStep(3)}
                                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-4"
                                >
                                    Next Step <FaChevronRight size={10} />
                                </button>
                            </div>
                        )}

                        {formStep === 3 && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="space-y-1 text-center max-w-lg mx-auto mb-10">
                                    <h3 className="text-xl font-[900] text-slate-800 uppercase tracking-tight">Pickup Details</h3>
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Where should we collect the items?</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Location</label>
                                    <AddressSelector
                                        value={formData.location}
                                        onChange={(addr) => setFormData(prev => ({ ...prev, location: addr }))}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-10 py-6 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-emerald-200/50"
                                >
                                    {loading ? 'Processing...' : 'Confirm & Submit Listing'}
                                    <FaCheckCircle size={18} />
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RaiseTicketFormPage;
