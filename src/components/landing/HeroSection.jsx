import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaLeaf, FaShieldAlt, FaMobileAlt, FaRecycle, FaLaptop, FaBatteryFull } from 'react-icons/fa';

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">

            {/* Abstract Background Shapes - More Liquid/Organic */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-50 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-teal-50 to-transparent rounded-full blur-3xl opacity-60 translate-y-1/3 -translate-x-1/4"></div>

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-left animate-slideUp">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-emerald-100/50 hover:bg-emerald-100 transition-colors">
                        <FaLeaf />
                        <span>Eco-Friendly & Certified Disposal</span>
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tighter">
                        Recycle Smarter, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Live Better</span>
                    </h1>

                    <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
                        The easiest way to dispose of your e-waste responsibly. Secure, certified, and rewarding.
                    </p>

                    <div className="flex flex-wrap gap-5">
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-emerald-600 transition-all transform hover:-translate-y-1 flex items-center gap-3 shadow-xl shadow-gray-200"
                        >
                            Schedule Pickup <FaArrowRight />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 bg-transparent text-gray-900 border-2 border-gray-200 rounded-full font-bold text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all"
                        >
                            Explore Flow
                        </a>
                    </div>
                </div>

                {/* Right Side - Organic Floating Elements Composition */}
                <div className="relative hidden lg:block h-[600px]">
                    {/* Central visual anchor - Abstract circular composition */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-emerald-100 rounded-full animate-spin-slow"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-dashed border-emerald-200 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>

                    {/* Floating Icons */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200/50 z-20 relative animate-blob">
                                <FaRecycle className="text-6xl text-white" />
                            </div>

                            {/* Orbiting Elements */}
                            <div className="absolute -top-24 -left-20 bg-white p-4 rounded-2xl shadow-lg animate-bounce-slow" style={{ animationDelay: '0s' }}>
                                <FaMobileAlt className="text-3xl text-gray-400" />
                            </div>
                            <div className="absolute -bottom-20 -right-24 bg-white p-5 rounded-2xl shadow-lg animate-bounce-slow" style={{ animationDelay: '1s' }}>
                                <FaLaptop className="text-4xl text-gray-400" />
                            </div>
                            <div className="absolute top-10 -right-32 bg-white p-3 rounded-xl shadow-lg animate-bounce-slow" style={{ animationDelay: '2s' }}>
                                <FaBatteryFull className="text-2xl text-emerald-500" />
                            </div>
                            <div className="absolute -bottom-10 -left-32 bg-white p-4 rounded-xl shadow-lg animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
                                <div className="flex items-center gap-2">
                                    <FaShieldAlt className="text-emerald-500" />
                                    <span className="text-xs font-bold text-gray-600">Secure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
