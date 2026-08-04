import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RoleSwitcher = () => {
    const { currentUser, userRole, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const changeRole = async (newRole) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const ref = doc(db, 'users', currentUser.uid);
            await updateDoc(ref, { role: newRole });
            setMessage(`Success! Role updated to ${newRole}. Redirecting...`);

            setTimeout(() => {
                // Use window.location.href to force a full reload and navigate, ensuring AuthContext updates
                if (newRole === 'government') window.location.href = '/government/dashboard';
                else if (newRole === 'collector') window.location.href = '/collector/home';
                else window.location.href = '/user/home';
            }, 1000);
        } catch (error) {
            console.error("Error updating role:", error);
            setMessage("Error updating role: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Please Log In First</h1>
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">Go to Login</button>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Tools</h1>
                <p className="text-gray-500 mb-8">Current Role: <span className="font-bold uppercase text-emerald-600">{userRole || 'None'}</span></p>

                {message && (
                    <div className="mb-6 p-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={() => changeRole('government')}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 p-4 border-2 border-purple-100 hover:border-purple-500 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all group"
                    >
                        <FaUserShield className="text-2xl text-purple-500 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block font-bold text-purple-900">Become Municipal Officer</span>
                            <span className="text-xs text-purple-600">Access Command Center</span>
                        </div>
                    </button>

                    <button
                        onClick={() => changeRole('collector')}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 p-4 border-2 border-orange-100 hover:border-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all group"
                    >
                        <FaUserTie className="text-2xl text-orange-500 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block font-bold text-orange-900">Become Collector</span>
                            <span className="text-xs text-orange-600">Access Collector App</span>
                        </div>
                    </button>

                    <button
                        onClick={() => changeRole('user')}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-100 hover:border-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
                    >
                        <FaUser className="text-2xl text-gray-500 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block font-bold text-gray-900">Become User</span>
                            <span className="text-xs text-gray-600">Standard Access</span>
                        </div>
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 font-medium text-sm">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSwitcher;
