import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RoleSelector from './RoleSelector';
import ImageUploader from '../common/ImageUploader';
import AddressSelector from '../common/AddressSelector';
import { toast } from 'react-toastify';
import AuthLayout from './AuthLayout';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const SignUpForm = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [step, setStep] = useState(1);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        profileImage: '',
        address: { street: '', city: '', state: '', pincode: '', lat: 0, lng: 0 },
        govId: '',
        verificationVideo: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const additionalData = {
                name: formData.name,
                phone: formData.phone,
                profileImage: formData.profileImage,
                address: formData.address,
                walletBalance: 0,
                coinsBalance: 0,
            };

            if (role === 'collector') {
                additionalData.collectorDetails = {
                    govId: formData.govId,
                    verificationVideo: formData.verificationVideo,
                    verificationStatus: 'pending'
                };
            }

            await signup(formData.email, formData.password, role, additionalData);
            toast.success("Account created successfully!");
            navigate(role === 'collector' ? '/collector/home' : (role === 'government' ? '/government/dashboard' : '/user/home'));
        } catch (error) {
            console.error(error);
            toast.error("Failed to create account: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ icon: Icon, type, name, placeholder, value, onChange }) => (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                <Icon />
            </div>
            <input
                type={type}
                name={name}
                required
                value={value}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-4 rounded-xl glass-input outline-none font-bold placeholder-slate-500 transition-all focus:ring-2 focus:ring-emerald-500/20"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <AuthLayout
            title="Join the Movement"
            subtitle="Start your journey towards a sustainable future today."
        >
            <div className="w-full max-w-xl mx-auto animate-fadeInRight">
                {/* Header */}
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
                    <p className="text-slate-400 text-sm font-medium">Step {step} of 3 • {step === 1 ? 'Select Role' : step === 2 ? 'Basic Details' : 'Final Verification'}</p>

                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* STEP 1: ROLE SELECTION */}
                    {step === 1 && (
                        <div className="animate-slideUp">
                            <RoleSelector selectedRole={role} onSelect={setRole} />

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1 transition-all flex items-center gap-2"
                                >
                                    Continue <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: BASIC INFO */}
                    {step === 2 && (
                        <div className="space-y-4 animate-slideUp">
                            <div className="flex justify-center mb-6">
                                <ImageUploader
                                    label="Profile Photo"
                                    onUpload={(url) => setFormData({ ...formData, profileImage: url })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField icon={FaUser} type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                                <InputField icon={FaPhone} type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                            </div>

                            <InputField icon={FaEnvelope} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField icon={FaLock} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                                <InputField icon={FaLock} type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                            </div>

                            <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                                <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-white font-bold text-sm flex items-center gap-2 px-4 py-2 transition-colors">
                                    <FaArrowLeft /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1 transition-all flex items-center gap-2"
                                >
                                    Next Step <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ADDRESS & VERIFICATION */}
                    {step === 3 && (
                        <div className="space-y-6 animate-slideUp">
                            <div className="glass-panel p-6 rounded-2xl">
                                <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-4">Location Details</h3>
                                <AddressSelector
                                    value={formData.address}
                                    onChange={(addr) => setFormData({ ...formData, address: addr })}
                                />
                            </div>

                            {role === 'collector' && (
                                <div className="glass-panel p-6 rounded-2xl border-l-4 border-amber-500">
                                    <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-4">Collector Verification</h3>
                                    <div className="space-y-4">
                                        <InputField icon={FaUser} type="text" name="govId" placeholder="Govt ID Number (Aadhar/PAN)" value={formData.govId} onChange={handleChange} />
                                        <div className="pt-2">
                                            <ImageUploader
                                                label="Upload ID Document"
                                                onUpload={(url) => setFormData({ ...formData, verificationVideo: url })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                                <button type="button" onClick={() => setStep(2)} className="text-slate-400 hover:text-white font-bold text-sm flex items-center gap-2 px-4 py-2 transition-colors">
                                    <FaArrowLeft /> Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : <>Complete Signup <FaCheck /></>}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <p className="mt-8 text-center text-sm font-medium text-slate-400">
                    Already have an account? <Link to="/login" className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline">Log In</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignUpForm;
