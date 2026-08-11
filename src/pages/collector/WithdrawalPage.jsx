import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { toast } from 'react-toastify';
import { Banknote, Building2, Smartphone, IndianRupee, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WithdrawalPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [loadingParams, setLoadingParams] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('UPI'); // 'UPI' or 'Bank'

    // Form fields
    const [upiId, setUpiId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountHolder, setAccountHolder] = useState('');

    useEffect(() => {
        if (!currentUser) return;
        const fetchBalance = async () => {
            try {
                // Calculate balance from completed assignments
                const q = query(
                    collection(db, 'assignments'),
                    where('collectorId', '==', currentUser.uid),
                    where('status', '==', 'Completed')
                );
                const querySnapshot = await getDocs(q);
                let totalEarned = 0;
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    totalEarned += Math.round(50 + (data.estimatedValue || 0) * 0.1);
                });

                // Subtract existing withdrawal amounts (completed or pending)
                const wq = query(
                    collection(db, 'withdrawalRequests'),
                    where('collectorId', '==', currentUser.uid)
                );
                const wSnapshot = await getDocs(wq);
                let totalWithdrawn = 0;
                wSnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.status !== 'Rejected') {
                        totalWithdrawn += parseFloat(data.amount || 0);
                    }
                });

                setBalance(totalEarned - totalWithdrawn);
            } catch (error) {
                console.error("Error fetching balance:", error);
            } finally {
                setLoadingParams(false);
            }
        };

        fetchBalance();
    }, [currentUser]);

    const handleWithdraw = async (e) => {
        e.preventDefault();

        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        if (amount > balance) {
            toast.error("Withdrawal amount cannot exceed available balance.");
            return;
        }

        if (method === 'UPI' && !upiId.trim()) {
            toast.error("Please enter a valid UPI ID.");
            return;
        }

        if (method === 'Bank') {
            if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim() || !accountHolder.trim()) {
                toast.error("Please fill in all bank details.");
                return;
            }
        }

        setSubmitting(true);
        try {
            const requestData = {
                collectorId: currentUser.uid,
                collectorName: currentUser.displayName || currentUser.email.split('@')[0],
                amount: parseFloat(amount),
                method,
                status: 'Pending',
                createdAt: serverTimestamp(),
            };

            if (method === 'UPI') {
                requestData.upiId = upiId;
            } else {
                requestData.bankDetails = {
                    bankName,
                    accountNumber,
                    ifscCode,
                    accountHolder,
                };
            }

            await addDoc(collection(db, 'withdrawalRequests'), requestData);
            toast.success("Withdrawal request submitted successfully!");

            // Deduct locally for immediate UI update
            setBalance((prev) => prev - amount);
            setAmount('');
            setUpiId('');
            setBankName('');
            setAccountNumber('');
            setIfscCode('');
            setAccountHolder('');
            navigate('/collector/home'); // Navigate back after success

        } catch (error) {
            console.error("Error submitting withdrawal:", error);
            toast.error("Failed to submit request: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingParams) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center items-center min-h-[calc(100vh-160px)]">
            <div className="max-w-2xl w-full mx-auto space-y-6">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <p className="text-emerald-100 font-semibold tracking-wide uppercase text-sm mb-2">Available Balance</p>
                        <h1 className="text-5xl font-black flex items-center gap-1">
                            <IndianRupee size={40} className="mt-1" />
                            {balance.toFixed(2)}
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleWithdraw} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                            <Banknote size={24} className="text-emerald-500" />
                            Withdraw Funds
                        </h2>
                        <p className="text-slate-500 text-sm">Transfer your earnings directly to your bank account or UPI.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Amount to Withdraw (₹)</label>
                        <input
                            type="number"
                            min="1"
                            max={balance}
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-lg font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Withdrawal Method</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setMethod('UPI')}
                                className={`cursor-pointer rounded-2xl p-4 border-2 flex flex-col items-center gap-2 transition-all ${method === 'UPI' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-emerald-200 bg-white text-slate-600'}`}
                            >
                                <Smartphone size={28} className={method === 'UPI' ? 'text-emerald-500' : 'text-slate-400'} />
                                <span className="font-bold text-sm">UPI Transfer</span>
                            </div>
                            <div
                                onClick={() => setMethod('Bank')}
                                className={`cursor-pointer rounded-2xl p-4 border-2 flex flex-col items-center gap-2 transition-all ${method === 'Bank' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-emerald-200 bg-white text-slate-600'}`}
                            >
                                <Building2 size={28} className={method === 'Bank' ? 'text-emerald-500' : 'text-slate-400'} />
                                <span className="font-bold text-sm">Bank Transfer</span>
                            </div>
                        </div>
                    </div>

                    {method === 'UPI' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="block text-sm font-bold text-slate-700 mb-2">UPI ID</label>
                            <input
                                type="text"
                                required
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@bank"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    )}

                    {method === 'Bank' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Account Holder Name</label>
                                <input
                                    type="text"
                                    required
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    placeholder="Full Name as per bank"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="e.g. HDFC Bank, SBI"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    required
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Bank Account Number"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">IFSC Code</label>
                                <input
                                    type="text"
                                    required
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value)}
                                    placeholder="e.g. HDFC0001234"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium uppercase"
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 w-full sm:w-auto">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            Secure transfer. Processing takes 2-3 business days.
                        </p>
                        <button
                            type="submit"
                            disabled={submitting || balance <= 0 || !amount || amount > balance}
                            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${submitting || balance <= 0 || !amount || amount > balance ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg shadow-emerald-500/20'}`}
                        >
                            {submitting ? 'Processing...' : (
                                <>
                                    Withdraw Now <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawalPage;
