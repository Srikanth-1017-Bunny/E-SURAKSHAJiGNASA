import React from 'react';
import { FaTruck, FaRecycle, FaBullhorn, FaLeaf, FaShieldAlt, FaChartLine } from 'react-icons/fa';

const FeaturesSection = () => {
    return (
        <section className="py-24 bg-white" id="features">
            <div className="container mx-auto px-6">

                {/* Intro Removed for simplicity */}

                {/* Our Solutions - Clean Layout */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Green Tech Solutions</h2>
                    <div className="w-20 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {/* Solution 1 */}
                    <div className="group">
                        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gray-100 h-64">
                            <img
                                src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                alt="Smart Collection Truck"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-sm z-10">
                                <FaTruck className="text-2xl text-emerald-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">Smart Collection</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Doorstep pickup scheduled at your convenience with real-time tracking.
                        </p>
                    </div>

                    {/* Solution 2 */}
                    <div className="group">
                        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gray-100 h-64">
                            <img
                                src="/images/landing/certified-recycling.png"
                                alt="Certified Recycling"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-sm z-10">
                                <FaRecycle className="text-2xl text-teal-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">Certified Recycling</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Zero-landfill policy with certified data destruction for your devices.
                        </p>
                    </div>

                    {/* Solution 3 */}
                    <div className="group">
                        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gray-100 h-64">
                            <img
                                src="/images/landing/awareness-rewards.png"
                                alt="Awareness and Rewards"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-sm z-10">
                                <FaBullhorn className="text-2xl text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Awareness & Rewards</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Earn rewards for every contribution and track your impact easily.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
