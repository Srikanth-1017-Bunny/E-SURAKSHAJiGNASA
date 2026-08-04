import React, { useState, useEffect } from 'react';
import { logisticsService } from '../../services/logisticsService';
import { FaTicketAlt, FaPlus, FaCopy, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { formatDate } from '../../utils/formatting';

const GiftCodesPage = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState(50);
    const [copied, setCopied] = useState('');

    useEffect(() => {
        loadCodes();
    }, []);

    const loadCodes = async () => {
        setLoading(true);
        const data = await logisticsService.getGiftCodes();
        setCodes(data);
        setLoading(false);
    };

    const handleGenerate = () => {
        const newCode = logisticsService.generateGiftCode(amount);
        const newEntry = {
            code: newCode,
            amount: amount,
            status: 'Active',
            createdBy: 'Admin',
            createdAt: new Date().toISOString()
        };
        // In a real app, we'd save this to backend. Here we just update local state mock.
        setCodes([newEntry, ...codes]);
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaTicketAlt className="text-pink-500" /> Gift Codes
                    </h1>
                    <p className="text-gray-500">Manage rewards and redeemable coupons for users.</p>
                </div>

                <div className="bg-white p-2 rounded-xl shadow-sm border flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-600 pl-2">Value: ₹</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="w-16 p-1 border rounded text-center font-bold outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                        onClick={handleGenerate}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all"
                    >
                        <FaPlus /> Generate Code
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="text-center py-10">Loading Codes...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {codes.map((item, index) => (
                        <div key={index} className="relative bg-white rounded-2xl shadow-sm border overflow-hidden group hover:shadow-md transition-all">
                            {/* Decorative Side */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${item.status === 'Active' ? 'bg-gradient-to-b from-pink-500 to-rose-500' : 'bg-gray-300'}`}></div>

                            {/* Cutout circles for coupon effect */}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>

                            <div className="p-6 pl-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">₹{item.amount}</h3>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${item.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <FaTicketAlt className={`text-xl ${item.status === 'Active' ? 'text-pink-400' : 'text-gray-300'}`} />
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 flex justify-between items-center mb-4 group-hover:border-pink-300 transition-colors">
                                    <code className="font-mono font-bold text-gray-700 tracking-wide text-sm">{item.code}</code>
                                    <button
                                        onClick={() => copyToClipboard(item.code)}
                                        className="text-gray-400 hover:text-pink-600 transition-colors relative"
                                        title="Copy Code"
                                    >
                                        {copied === item.code ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <FaHistory /> {formatDate(item.createdAt)}
                                    </div>
                                    <span>By {item.createdBy}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GiftCodesPage;
