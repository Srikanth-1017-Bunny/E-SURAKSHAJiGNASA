import React from 'react';
import { FaRecycle, FaShieldAlt } from 'react-icons/fa';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920&auto=format&fit=crop")' }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            
            <div className="w-full max-w-5xl relative z-10">
                <div className="flex flex-col md:flex-row bg-white/95 backdrop-blur-md rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden min-h-[600px] border border-white/20">

                    {/* Left Side: Visuals (Brand Color) */}
                    <div className="hidden md:flex flex-1 relative items-center justify-center bg-gradient-to-br from-teal-600/90 to-emerald-600/90 p-12">
                        <div className="relative z-10">
                            {/* Main Diamond */}
                            <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-[2rem] transform rotate-45 flex items-center justify-center shadow-2xl border-4 border-white/20 mx-auto">
                                {/* Inner Icon */}
                                <div className="transform -rotate-45">
                                    <FaShieldAlt className="text-7xl text-white drop-shadow-md" />
                                </div>
                            </div>

                            {/* Static Floating Cards */}
                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl">
                                <FaRecycle className="text-2xl text-emerald-600" />
                            </div>

                            {/* 
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-full shadow-xl">
                                <FaRecycle className="text-2xl text-teal-600" />
                            </div> 
                            Removed duplicate/extra icon for cleaner look
                            */}
                        </div>

                        <div className="absolute bottom-10 left-10 z-20">
                            <h2 className="text-3xl font-[900] text-white tracking-tight leading-tight">
                                E-Suraksha
                            </h2>
                            <p className="text-emerald-100 mt-2 font-medium text-sm max-w-xs">{subtitle || "Securing the Future through Responsible E-Waste Management."}</p>
                        </div>
                    </div>

                    {/* Right Side: Form Area (White) */}
                    <div className="flex-1 bg-white p-10 md:p-14 flex flex-col justify-center">
                        {/* Mobile Header */}
                        <div className="md:hidden pb-8 text-center">
                            <h2 className="text-3xl font-black text-emerald-600">
                                E-Suraksha
                            </h2>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
