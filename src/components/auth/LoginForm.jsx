import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from './AuthLayout';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(email, password);

            // Fetch role from firestore
            const userDoc = await getDoc(doc(db, "users", result.user.uid));
            const role = userDoc.exists() ? userDoc.data().role : 'user';

            toast.success("Logged in successfully");

            if (role === 'government') navigate('/government/dashboard');
            else if (role === 'collector') navigate('/collector/home');
            else navigate('/user/home');
        } catch (error) {
            console.error(error);
            toast.error("Failed to login: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await loginWithGoogle();

            // Fetch role from firestore
            const userDoc = await getDoc(doc(db, "users", result.user.uid));
            const role = userDoc.exists() ? userDoc.data().role : 'user';

            toast.success("Logged in with Google");

            if (role === 'government') navigate('/government/dashboard');
            else if (role === 'collector') navigate('/collector/home');
            else navigate('/user/home');
        } catch (error) {
            toast.error("Google login failed");
        }
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-sm mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Login</h2>
                    <p className="text-slate-500 font-medium text-sm mt-2">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-bold placeholder-slate-400 text-sm outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <FaLock />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-bold placeholder-slate-400 text-sm outline-none transition-all"
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Remember me</span>
                            </label>
                            <a onClick={() => toast.info("Feature coming soon!")} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">Forgot Password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-[900] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Processing...' : 'Access Account'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="px-4 bg-white text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex justify-center items-center gap-3 py-3.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300"
                    >
                        <FaGoogle className="text-rose-500" />
                        <span>Sign in with Google</span>
                    </button>
                </form>

                <p className="mt-8 text-center text-xs font-bold text-slate-500">
                    Don't have an account? <Link to="/signup" className="text-emerald-600 hover:underline">Sign up</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginForm;
